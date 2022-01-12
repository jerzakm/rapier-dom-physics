import { PositionSyncMap } from "./main";
import { getRapier } from "./rapier";

const maxFps = 60;
const deltaGoal = 1000 / maxFps;
const VECTOR_ZERO = { x: 0, y: 0 };

const bodyAddQueue: any[] = [];

let cursor: any = {
  handle: undefined,
  body: undefined,
  collider: undefined,
  position: { x: 100, y: 100 },
};

async function init() {
  const RAPIER = await getRapier();
  // Use the RAPIER module here.
  let gravity = { x: 0.0, y: 0 };
  let world = new RAPIER.World(gravity);

  const applyForceToRandomBody = () => {
    const bodyCount = world.bodies.len();

    if (bodyCount == 0) return;
    const bodyIndex = Math.round(Math.random() * bodyCount);

    const body = world.getRigidBody(bodyIndex);
    if (!body) return;
    const mass = body.mass();

    body.applyImpulse(
      {
        x: (Math.random() - 0.5) * mass * 0.5,
        y: (Math.random() - 0.5) * mass * 0.5,
      },
      true
    );
  };

  const syncPositions = (delta: number) => {
    const syncObj: PositionSyncMap = {};

    let count = 0;

    world.forEachRigidBody((body) => {
      const { x, y } = body.translation();
      const rotation = body.rotation();
      syncObj[body.handle] = { x, y, rotation };

      count++;
    });

    self.postMessage({
      type: "BODY_SYNC",
      data: syncObj,
      delta,
    });
  };

  const outOfBoundCheck = () => {
    world.forEachRigidBody((body) => {
      const { x, y } = body.translation();

      if (Math.abs(x) + Math.abs(y) > 6000) {
        body.setTranslation(
          {
            x: 100,
            y: 100,
          },
          true
        );
      }
    });
  };

  let gameLoop = (delta = 16) => {
    const startTs = performance.now();

    if (Math.random() < 0.01) {
      // applyForceToRandomBody();
    }

    while (bodyAddQueue.length > 0) {
      const { x, y, width, height, options } = bodyAddQueue[0];

      let rigidBody;

      if (options.isStatic) {
        rigidBody = world.createRigidBody(
          RAPIER.RigidBodyDesc.newStatic().setTranslation(x, y)
        );
      } else {
        rigidBody = world.createRigidBody(
          RAPIER.RigidBodyDesc.newDynamic().setTranslation(x, y)
        );
      }

      let colliderDesc = new RAPIER.ColliderDesc(
        new RAPIER.Cuboid(width / 2, height / 2)
      ).setTranslation(0, 0);

      if (options.shape == "circle") {
        colliderDesc = new RAPIER.ColliderDesc(new RAPIER.Ball(width / 2));
      }

      const bodyCollider = world.createCollider(colliderDesc, rigidBody.handle);

      bodyAddQueue.shift();

      if (options.type == "cursor") {
        cursor.handle = bodyCollider.handle;
        cursor.collider = bodyCollider;
        cursor.body = rigidBody;
        rigidBody.setGravityScale(0, true);
      }
      self.postMessage({
        type: "BODY_CREATED",
        data: {
          id: bodyCollider.handle,
          domId: options.domId,
          x,
          y,
          width,
          height,
          angle: 0,
          sprite: undefined,
        },
      });
    }

    // Cursor movement 1
    if (cursor.position.x && cursor.position.y && cursor.body) {
      const body = cursor.body;
      const velocity = body.linvel();

      const direction = {
        x: 0,
        y: 0,
      };
      const position = cursor.body.translation();
      const goal = cursor.position;

      const distanceFromGoal = Math.sqrt(
        (position.x - goal.x) ** 2 + (position.y - goal.y) ** 2
      );
      if (distanceFromGoal < 8 || distanceFromGoal > 300) {
        body.setTranslation(goal, true);

        direction.x = 0;
        direction.y = 0;
        body.setAngvel(0, true);
        body.setLinvel(VECTOR_ZERO, true);
        cursor.position.x = undefined;
        cursor.position.y = undefined;
      } else {
        const x = goal.x - position.x;
        const y = goal.y - position.y;
        const div = Math.max(Math.abs(x), Math.abs(y));
        direction.x = x / div;
        direction.y = y / div;
      }

      const impulse = {
        x: (direction.x * 20 - velocity.x) * 100,
        y: (direction.y * 20 - velocity.y) * 100,
      };
      body.applyImpulse(impulse, true);
    }

    world.timestep = delta;

    world.step();
    syncPositions(delta);

    const currentDelta = performance.now() - startTs;

    // this bit limits max FPS to 60
    const deltaGoalDifference = Math.max(0, deltaGoal - currentDelta);
    const d = Math.max(currentDelta, deltaGoal);

    setTimeout(() => gameLoop(d), deltaGoalDifference);
  };
  gameLoop();

  self.postMessage({
    type: "PHYSICS_LOADED",
  });

  // once a second check for bodies out of bound
  setInterval(() => {
    outOfBoundCheck();
  }, 100);

  self.addEventListener("message", (e) => {
    const message = e.data || e;

    switch (message.type) {
      case "ADD_BODY":
        bodyAddQueue.push(message.data);
        return;
      case "SYNC_CURSOR":
        const { x, y } = message.data;
        cursor.position = {
          x,
          y,
        };
        return;
      default:
        console.log("unknown command sent to worker");
    }
  });
}

init();
