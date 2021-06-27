export class WorldFactory {
  constructor(box2D, helpers) {
    this.box2D = box2D
    this.helpers = helpers
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
    } = this.box2D
    const myQueryCallback = new JSQueryCallback()

    myQueryCallback.ReportFixture = (fixturePtr) => {
      const fixture = wrapPointer(fixturePtr, b2Fixture)
      if (fixture.GetBody().GetType() != b2_dynamicBody) return true
      return false
    }
    const world = new b2World(new b2Vec2(0.0, 600.0))
    world.SetAllowSleeping(true)
    world.SetDebugDraw(renderer)
    this.world = world

    const maxTimeStepMs = (1 / 60) * 1000

    this.makeWorldBorders()

    return {
      step(deltaMs) {
        const clampedDeltaMs = Math.min(deltaMs, maxTimeStepMs)
        world.Step(clampedDeltaMs / 1000, 10, 10)
      },
      draw() {
        world.DebugDraw()
      },
      destroy() {
        destroy(world)
      },
    }
  }

  makeWorldBorders = () => {
    // bottom
    this.createShape(
      0,
      window.innerHeight - 7,
      window.innerWidth + 50,
      50,
      false
    )
    //top
    this.createShape(0, -45, window.innerWidth * 2 + 50, 50, false)
    //left
    this.createShape(0, 0, 5, window.innerWidth * 2 + 50, false)

    //right
    this.createShape(
      window.innerWidth - 25,
      0,
      50,
      window.innerWidth * 2 + 50,
      false
    )
  }

  createShape = (x, y, width, height, dynamic = true) => {
    let world = this.world
    const { createPolygonShape } = this.helpers
    const { b2BodyDef, b2Vec2, b2_dynamicBody } = this.box2D

    const temp = new b2Vec2(x, y)

    const bd = new b2BodyDef()
    if (dynamic) {
      bd.set_type(b2_dynamicBody)
    }
    // bd.set_position(ZERO);
    const body = world.CreateBody(bd)

    const verts = []
    verts.push(new b2Vec2(0, 0))
    verts.push(new b2Vec2(0, height))
    verts.push(new b2Vec2(width, height))
    verts.push(new b2Vec2(width, 0))

    const shape = createPolygonShape(verts)
    body.CreateFixture(shape, 1.0)

    body.SetTransform(temp, 0)
    body.SetEnabled(true)

    return body
  }
}
