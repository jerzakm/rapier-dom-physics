import Box2DFactory from 'box2d-wasm'
import { Helpers } from './helpers'
import { CanvasDebugDraw } from './debugDraw'
import { WorldFactory } from './world'

export default class PhysicsWorld {
  constructor() {
    this.physDivList = []
    this.initBox2D()
    this.PIXELS_PER_METER = 1
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

    this.initDebugCanvas()

    this.worldFactory = new WorldFactory(this.box2D, this.helpers)
    const { step, draw, destroy } = this.worldFactory.create(this.renderer)

    const canvasOffset = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
    }
    const viewCenterPixel = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
    }
    const myRound = (val, places) => {
      let c = 1
      for (let i = 0; i < places; i++) c *= 10
      return Math.round(val * c) / c
    }

    const getWorldPointFromPixelPoint = (pixelPoint) => ({
      x: (pixelPoint.x - canvasOffset.x) / this.PIXELS_PER_METER,
      y:
        (pixelPoint.y - (this.canvas.height - canvasOffset.y)) /
        this.PIXELS_PER_METER,
    })

    const setViewCenterWorld = (pos, instantaneous) => {
      const currentViewCenterWorld =
        getWorldPointFromPixelPoint(viewCenterPixel)
      const toMoveX = pos.get_x() - currentViewCenterWorld.x
      const toMoveY = pos.get_y() - currentViewCenterWorld.y
      const fraction = instantaneous ? 1 : 0.25
      canvasOffset.x -= myRound(fraction * toMoveX * this.PIXELS_PER_METER, 0)
      canvasOffset.y += myRound(fraction * toMoveY * this.PIXELS_PER_METER, 0)
    }

    setViewCenterWorld(new b2Vec2(0, 0), true)

    const drawCanvas = () => {
      //transparent background
      if (this.ctx) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.save()
        this.ctx.scale(this.PIXELS_PER_METER, -this.PIXELS_PER_METER)
        this.ctx.lineWidth /= this.PIXELS_PER_METER
        this.ctx.fillStyle = 'rgb(255,255,0)'
        draw()
        this.ctx.restore()
      }
    }

    let handle

    const ticker = (prevMs = window.performance.now()) => {
      const nowMs = window.performance.now()
      handle = requestAnimationFrame(ticker.bind(null, nowMs))
      const deltaMs = nowMs - prevMs
      step(deltaMs)
      this.syncDomToPhysics()
      drawCanvas()
    }

    // this.physicsEnabled.set(true)

    ticker()
  }

  initDebugCanvas() {
    const {
      b2Vec2,
      b2Draw: { e_shapeBit },
    } = this.box2D
    const canvas = document.createElement('canvas')
    canvas.style.position = 'fixed'
    canvas.style.top = 0
    canvas.style.left = 0
    canvas.style.width = window.innerWidth + 'px'
    canvas.style.height = window.innerHeight + 'px'
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    document.body.appendChild(canvas)

    const ctx = canvas.getContext('2d')
    this.canvas = canvas
    this.ctx = ctx

    const renderer = new CanvasDebugDraw(
      this.box2D,
      this.helpers,
      ctx,
      this.PIXELS_PER_METER
    ).constructJSDraw()
    renderer.SetFlags(e_shapeBit)
    this.renderer = renderer
  }

  registerPhysDiv(el) {
    const origin = el.getBoundingClientRect()

    if (this.worldFactory) {
      const body = this.worldFactory.createShape(
        origin.x,
        origin.y,
        origin.width,
        origin.height
      )

      this.physDivList.push({ el, body, origin })
    } else {
      setTimeout(() => {
        this.registerPhysDiv(el), 100
      })
    }
  }

  syncDomToPhysics() {
    for (const obj of this.physDivList) {
      const physPos = obj.body.GetPosition()
      const physAngle = obj.body.GetAngle()

      let update = false

      if (
        !obj.lastPosition ||
        Math.abs(
          obj.lastPosition.x + obj.lastPosition.y - physPos.x - physPos.y
        ) > 100
      ) {
        update = true
      }

      if (update) {
        obj.el.style.transform = `translate3d(${
          physPos.x - obj.origin.x - physAngle
        }px, ${physPos.y - obj.origin.y}px, 0) rotate(${
          (physAngle * 180) / Math.PI
        }deg)`
      }
    }
  }
}
