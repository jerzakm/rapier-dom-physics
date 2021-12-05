import "./style/global.css";
import * as PIXI from "pixi.js";
import { Renderer } from "./renderer";
import PhysicsDomWorker from "./physicsDomWorker?worker";

const findDomPhysicsElements = () => {
  // DOM ELEMENTS
  const elements: PhysicsElement[] = [];
  let domId = 0;
  document.body.querySelectorAll("[data-physics-type]").forEach((el) => {
    const rect = el.getBoundingClientRect();
    elements.push({
      el,
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      domId,
    });
    domId++;
  });

  return elements;
};

async function startDomPhysics() {
  const worker = new PhysicsDomWorker();

  const { app, stage } = new Renderer();
  const container = new PIXI.Container();

  stage.addChild(container);

  const physicsObjects: IPhysicsSyncBody[] = [];
  const domElements = findDomPhysicsElements();

  const addBody = (
    x = 0,
    y = 0,
    width = 10,
    height = 10,
    options: any = {
      restitution: 0,
    }
  ) => {
    const newBody = {
      x,
      y,
      width,
      height,
      options,
    };

    worker.postMessage({
      type: "ADD_BODY",
      data: newBody,
    });
  };

  const setupWalls = () => {
    const WALL_THICKNESS = 50;
    addBody(
      window.innerWidth / 2,
      0 - WALL_THICKNESS / 3,
      window.innerWidth,
      WALL_THICKNESS,
      {
        isStatic: true,
      }
    );
    addBody(
      window.innerWidth / 2,
      window.innerHeight + WALL_THICKNESS / 3,
      window.innerWidth,
      WALL_THICKNESS,
      {
        isStatic: true,
      }
    );
    addBody(
      0 - WALL_THICKNESS / 3,
      window.innerHeight / 2,
      WALL_THICKNESS,
      window.innerHeight,
      {
        isStatic: true,
      }
    );
    addBody(
      window.innerWidth + WALL_THICKNESS / 3,
      window.innerHeight / 2,
      WALL_THICKNESS,
      window.innerHeight,
      {
        isStatic: true,
      }
    );
  };

  const setupCursorPhysics = () => {
    const cursor: any = document.body.querySelector("cursor");
    addBody(window.innerWidth / 2, window.innerHeight / 2, 32, 32, {
      shape: "circle",
      type: "cursor",
    });

    let lastPosition = {
      x: 0,
      y: 0,
    };

    window.addEventListener("mousemove", ({ x, y }) => {
      if (cursor) {
        const newPosition = { x, y };

        const changeDistance = Math.sqrt(
          (lastPosition.x - newPosition.x) ** 2 +
            (lastPosition.y - newPosition.y) ** 2
        );
        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;

        if (changeDistance > 8) {
          lastPosition = newPosition;
          worker.postMessage({
            type: "SYNC_CURSOR",
            data: {
              x,
              y,
            },
          });
        }
      }
    });
  };

  const initPhysicsHandler = () => {
    // Listener to handle data that worker passes to main thread
    worker.addEventListener("message", (e) => {
      if (e.data.type == "BODY_SYNC") {
        const physData = e.data.data;

        for (const obj of physicsObjects) {
          const { x, y, rotation } = physData[obj.id];
          if (!obj.sprite) return;
          obj.sprite.position.x = x;
          obj.sprite.position.y = y;
          obj.sprite.rotation = rotation;
          if (obj.domId >= 0) {
            const p = domElements[obj.domId];
            //@ts-ignore
            p.el.style.transform = `translate(${x - p.x - p.width / 2}px, ${
              y - p.y - p.height / 2
            }px) rotate(${rotation}rad)`;
          }
        }
      }
      if (e.data.type == "BODY_CREATED") {
        console.log(e.data);
        const texture = PIXI.Texture.from("square.png");
        const sprite = new PIXI.Sprite(texture);
        const { x, y, width, height, id, domId } = e.data.data;
        sprite.anchor.set(0.5);
        sprite.position.x = x;
        sprite.position.y = y;
        sprite.width = width;
        sprite.height = height;
        container.addChild(sprite);

        physicsObjects.push({
          id,
          x,
          y,
          width,
          height,
          angle: 0,
          sprite,
          domId,
        });
      }
      if (e.data.type == "PHYSICS_LOADED") {
        // initial spawn
        setupWalls();
        setupCursorPhysics();

        for (const { x, y, width, height, domId } of domElements) {
          addBody(x + width / 2, y + height / 2, width, height, {
            isStatic: false,
            domId,
          });
        }
      }
    });
  };

  initPhysicsHandler();

  // gameloop
  let delta = 0;

  app.ticker.stop();

  let start = performance.now();
  const gameLoop = () => {
    start = performance.now();
    app.render();

    delta = performance.now() - start;
    setTimeout(() => gameLoop(), 0);
  };

  gameLoop();
}

const setup = async () => {
  const button = document.body.querySelector("#physics-btn");
  if (!button) {
    console.log("start physics button not found");
    return;
  }

  button.addEventListener("click", (e) => {
    startDomPhysics();
  });
};

setup();
// startDomPhysics();

interface IPhysicsSyncBody {
  id: string | number;
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  domId: number;
  sprite: PIXI.Sprite | undefined;
}

export type PositionSyncMap = {
  [key: number]: {
    x: number;
    y: number;
    rotation: number;
  };
};

export interface PhysicsObjectOptions {
  isStatic: boolean;
}

interface PhysicsElement {
  el: Element;
  x: number;
  y: number;
  width: number;
  height: number;
  domId: number;
}
