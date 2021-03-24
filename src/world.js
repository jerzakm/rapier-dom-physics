import { Helpers } from './helpers';



export class WorldFactory {
  constructor(
   box2D,
    helpers
  ) {
    this.box2D = box2D;
    this.helpers = helpers;
  }
  create(renderer) {
    const { b2_dynamicBody, b2BodyDef, b2Fixture,
    b2Vec2, b2World, destroy, JSQueryCallback, wrapPointer } = this.box2D;
    const myQueryCallback = new JSQueryCallback();

    myQueryCallback.ReportFixture = (fixturePtr) => {
        const fixture = wrapPointer( fixturePtr, b2Fixture );
        if ( fixture.GetBody().GetType() != b2_dynamicBody ) //mouse cannot drag static bodies around
          return true;
        return false;
    };
    const world = new b2World(new b2Vec2(0.0, -10.0));
    world.SetDebugDraw(renderer);
    this.world = world
    const bd_ground = new b2BodyDef();
    const groundBody = world.CreateBody(bd_ground);

    //ground edges
    // this.createFixtures(groundBody);

    // this.createFallingShapes(world);

    // this.createStaticPolygonAndChainShapes(groundBody);

    // calculate no more than a 60th of a second during one world.Step() call
    const maxTimeStepMs = 1/60*1000;

    return {
      step(deltaMs) {
        const clampedDeltaMs = Math.min(deltaMs, maxTimeStepMs);
        world.Step(clampedDeltaMs/1000, 3, 2);
      },
      draw() {
        world.DebugDraw();
      },
      destroy() {
        destroy(world);
        destroyRope();
      }
    };
  }

  /** ground edges */
  createFixtures = (groundBody) => {
    const { b2EdgeShape, b2Vec2 } = this.box2D;
    const shape0 = new b2EdgeShape();
    shape0.SetTwoSided(new b2Vec2(-40.0, -16.0), new b2Vec2(40.0, -16.0));
    groundBody.CreateFixture(shape0, 0.0);

  };

  createStaticPolygonAndChainShapes = (groundBody) => {
    const { createChainShape, createPolygonShape } = this.helpers;
    const { b2Vec2 } = this.box2D;
    const verts = [];
    verts.push( new b2Vec2( 7,-1) );
    verts.push( new b2Vec2( 8,-2) );
    verts.push( new b2Vec2( 9, 3) );
    verts.push( new b2Vec2( 7, 1) );
    const polygonShape = createPolygonShape(verts);
    groundBody.CreateFixture(polygonShape, 0.0);

    //mirror vertices in x-axis and use for chain shape
    for (let i = 0; i < verts.length; i++)
        verts[i].set_x( -verts[i].get_x() );
    verts.reverse();
    const chainShape = createChainShape(verts, true);//true for closed loop *** some problem with this atm
    // polygonShape = createPolygonShape(verts);
    groundBody.CreateFixture(chainShape, 0.0);
  };

  createShape = () => {
    let world = this.world
    const { createPolygonShape } = this.helpers
    const {
      b2BodyDef,
      b2CircleShape,
      b2Vec2,
      b2_dynamicBody,
    } = this.box2D

    const cshape = new b2CircleShape()
    cshape.set_m_radius(0.5)

    const ZERO = new b2Vec2(0, 0)
    const temp = new b2Vec2(0, 0)

    const bd = new b2BodyDef()
    bd.set_type(b2_dynamicBody)
    bd.set_position(ZERO)
    const body = world.CreateBody(bd)

    const verts = []
    verts.push(new b2Vec2(0, 0))
    verts.push(new b2Vec2(0, 200))
    verts.push(new b2Vec2(200, 200))
    verts.push(new b2Vec2(200, 0))

    const shape = createPolygonShape(verts)
    body.CreateFixture(shape, 1.0)
    temp.Set(16 * (Math.random() - 0.5), 4.0 + 2.5 * 0)
    body.SetTransform(temp, 0.0)
    body.SetLinearVelocity(ZERO)
    body.SetEnabled(true)
  }

  createFallingShapes = () => {
    let world = this.world
    const { createRandomPolygonShape } = this.helpers;
    const { b2BodyDef, b2CircleShape, b2Vec2, b2_dynamicBody, b2PolygonShape } = this.box2D;

    const cshape = new b2CircleShape();
    cshape.set_m_radius(0.5);

    const ZERO = new b2Vec2(0, 0);
    const temp = new b2Vec2(0, 0);
    for (let i = 0; i < 20; i++) {
      const bd = new b2BodyDef();
      bd.set_type(b2_dynamicBody);
      bd.set_position(ZERO);
      const body = world.CreateBody(bd);
      const randomValue = Math.random();
      const shape = randomValue < 0.2 ? cshape : createRandomPolygonShape(0.5);
      body.CreateFixture(shape, 1.0);
      temp.Set(16*(Math.random()-0.5), 4.0 + 2.5 * i);
      body.SetTransform(temp, 0.0);
      body.SetLinearVelocity(ZERO);
      body.SetEnabled(true);
    }
  }
}