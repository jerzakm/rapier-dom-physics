import "./style/global.css";
import * as PIXI from "pixi.js";
import { Renderer } from "./renderer";
import PhysicsDomWorker from "./physicsDomWorker?worker";

async function startDomPhysics() {
  const worker = new PhysicsDomWorker();

  const { app, stage } = new Renderer();
  const container = new PIXI.Container();

  stage.addChild(container);

  const physicsObjects: IPhysicsSyncBody[] = [];

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
        }
      }
      if (e.data.type == "BODY_CREATED") {
        const texture = PIXI.Texture.from("square.png");
        const sprite = new PIXI.Sprite(texture);
        const { x, y, width, height, id }: IPhysicsSyncBody = e.data.data;
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
        });
      }
      if (e.data.type == "PHYSICS_LOADED") {
        // initial spawn
        setupWalls();
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
startDomPhysics();

interface IPhysicsSyncBody {
  id: string | number;
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
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
