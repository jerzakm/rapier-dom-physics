import Box2DFactory from 'box2d-wasm'
import { Helpers } from './helpers'
import { WorldFactory } from './world'

export default class PhysicsWorld {
  constructor() {
    this.initBox2D()
  }
  async initBox2D() {
    this.box2D = await Box2DFactory({
      locateFile: (url) => url,
    })

    const {
      b2Vec2,
      b2Draw: { e_shapeBit },
    } = this.box2D
    this.helpers = new Helpers(this.box2D)

    this.worldFactory = new WorldFactory(this.box2D, this.helpers)
  }
}
