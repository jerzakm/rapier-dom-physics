import "./style/global.css";
import PhysicsDomWorker from "./physicsDomWorker?worker";

let physicsEnabled = false;

const findDomPhysicsElements = () => {
  // DOM ELEMENTS
  const elements: PhysicsElement[] = [];
  let domId = 0;
  document.body.querySelectorAll("[data-physics-type]").forEach((el) => {
    //@ts-ignore
    el.style.transitionDuration = "0s";
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

let worker: any;

async function toggleDomPhysics() {
  physicsEnabled = !physicsEnabled;

  const physicsObjects: IPhysicsSyncBody[] = [];
  const domElements = findDomPhysicsElements();

  if (!physicsEnabled) {
    if (worker) {
      worker.terminate();

      for (const d in domElements) {
        const p = domElements[d];
        //@ts-ignore
        p.el.style.transitionDuration = "1s";
        //@ts-ignore
        p.el.style.transform = `translate(${0}px, ${0}px) rotate(${0}rad)`;
      }
    }
    return;
  }

  worker = new PhysicsDomWorker();

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

        if (changeDistance > 4) {
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
    //@ts-ignore
    worker.addEventListener("message", (e) => {
      if (e.data.type == "BODY_SYNC") {
        const physData = e.data.data;

        for (const obj of physicsObjects) {
          const { x, y, rotation } = physData[obj.id];
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
        const { x, y, width, height, id, domId } = e.data.data;

        physicsObjects.push({
          id,
          x,
          y,
          width,
          height,
          angle: 0,

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

  // app.ticker.stop();

  let start = performance.now();
  const gameLoop = () => {
    start = performance.now();
    // app.render();

    delta = performance.now() - start;
    setTimeout(() => gameLoop(), 0);
  };

  gameLoop();
}

const setup = async () => {
  const button = document.body.querySelector("#physics-btn");
  if (!button) {
    return;
  }

  button.addEventListener("click", (e) => {
    toggleDomPhysics();
    if (physicsEnabled) {
      button.innerHTML = `Stop this madness!`;
    } else {
      button.innerHTML = `Let's get physical`;
    }
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
