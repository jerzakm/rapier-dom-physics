import { Helpers } from "./helpers";

export class WorldFactory {
  constructor(box2D, helpers) {
    this.box2D = box2D;
    this.helpers = helpers;
  }
  create(renderer) {
    const {
      b2_dynamicBody,
      b2BodyDef,
      b2Fixture,
      b2Vec2,
      b2World,
      destroy,
      JSQueryCallback,
      wrapPointer,
    } = this.box2D;
    const myQueryCallback = new JSQueryCallback();

    myQueryCallback.ReportFixture = (fixturePtr) => {
      const fixture = wrapPointer(fixturePtr, b2Fixture);
      if (fixture.GetBody().GetType() != b2_dynamicBody)
        //mouse cannot drag static bodies around
        return true;
      return false;
    };
    const world = new b2World(new b2Vec2(0.0, -10.0));
    world.SetDebugDraw(renderer);
    this.world = world;
    const bd_ground = new b2BodyDef();
    const groundBody = world.CreateBody(bd_ground);

    //ground edges
    // this.createFixtures(groundBody);

    // this.createFallingShapes(world);

    // this.createStaticPolygonAndChainShapes(groundBody);

    // calculate no more than a 60th of a second during one world.Step() call
    const maxTimeStepMs = (1 / 60) * 1000;

    return {
      step(deltaMs) {
        const clampedDeltaMs = Math.min(deltaMs, maxTimeStepMs);
        world.Step(clampedDeltaMs / 1000, 3, 2);
      },
      draw() {
        world.DebugDraw();
      },
      destroy() {
        destroy(world);
        destroyRope();
      },
    };
  }

  createShape = (x, y, width, height) => {
    let world = this.world;
    const { createPolygonShape } = this.helpers;
    const { b2BodyDef, b2Vec2, b2_dynamicBody } = this.box2D;

    const temp = new b2Vec2(x, y);

    const bd = new b2BodyDef();
    bd.set_type(b2_dynamicBody);
    // bd.set_position(ZERO);
    const body = world.CreateBody(bd);

    const verts = [];
    verts.push(new b2Vec2(0, 0));
    verts.push(new b2Vec2(0, height));
    verts.push(new b2Vec2(width, height));
    verts.push(new b2Vec2(width, 0));

    const shape = createPolygonShape(verts);
    body.CreateFixture(shape, 1.0);

    body.SetTransform(temp, 0);
    console.log(body);
    body.SetEnabled(true);

    return body;
  };
}
