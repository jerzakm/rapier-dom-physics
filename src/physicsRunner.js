import Box2DFactory from 'box2d-wasm'

import { CanvasDebugDraw } from './debugDraw'
import { Helpers } from './helpers'
import { WorldFactory } from './world'
import { physicsEnabled } from './store'

let box2D, helpers, worldFactory

const PIXELS_PER_METER = 1

const physDivList = []

export const runPhysics = async (canvas) => {
  box2D = await Box2DFactory({
    /**
     * By default, this looks for Box2D.wasm relative to public/build/bundle.js:
     * @example (url, scriptDirectory) => `${scriptDirectory}${url}`
     * But we want to look for Box2D.wasm relative to public/index.html instead.
     */
    locateFile: (url) => url,
  })

  const {
    b2Vec2,
    b2Draw: { e_shapeBit },
  } = box2D
  helpers = new Helpers(box2D)

  const ctx = canvas.getContext('2d')
  const canvasOffset = {
    x: canvas.width / 2,
    y: canvas.height / 2,
  }
  const viewCenterPixel = {
    x: canvas.width / 2,
    y: canvas.height / 2,
  }

  const renderer = new CanvasDebugDraw(
    box2D,
    helpers,
    ctx,
    PIXELS_PER_METER
  ).constructJSDraw()
  renderer.SetFlags(e_shapeBit)
  worldFactory = new WorldFactory(box2D, helpers)
  const { step, draw, destroy } = worldFactory.create(renderer)
  //   worldFactory.createShape(50, 50, 200, 100);

  const myRound = (val, places) => {
    let c = 1
    for (let i = 0; i < places; i++) c *= 10
    return Math.round(val * c) / c
  }

  const getWorldPointFromPixelPoint = (pixelPoint) => ({
    x: (pixelPoint.x - canvasOffset.x) / PIXELS_PER_METER,
    y: (pixelPoint.y - (canvas.height - canvasOffset.y)) / PIXELS_PER_METER,
  })

  const setViewCenterWorld = (pos, instantaneous) => {
    const currentViewCenterWorld = getWorldPointFromPixelPoint(viewCenterPixel)
    const toMoveX = pos.get_x() - currentViewCenterWorld.x
    const toMoveY = pos.get_y() - currentViewCenterWorld.y
    const fraction = instantaneous ? 1 : 0.25
    canvasOffset.x -= myRound(fraction * toMoveX * PIXELS_PER_METER, 0)
    canvasOffset.y += myRound(fraction * toMoveY * PIXELS_PER_METER, 0)
  }

  setViewCenterWorld(new b2Vec2(0, 0), true)

  const drawCanvas = () => {
    //transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.save()
    ctx.scale(PIXELS_PER_METER, -PIXELS_PER_METER)
    ctx.lineWidth /= PIXELS_PER_METER
    ctx.fillStyle = 'rgb(255,255,0)'
    draw()

    ctx.restore()
  }

  let handle

  function ticker(prevMs = window.performance.now()) {
    const nowMs = window.performance.now()
    handle = requestAnimationFrame(ticker.bind(null, nowMs))
    const deltaMs = nowMs - prevMs
    step(deltaMs)
    syncDomToPhysics()
    drawCanvas()
  }

  physicsEnabled.set(true)

  ticker()
}

export const registerPhysDiv = (el) => {
  const origin = el.getBoundingClientRect()
  const body = worldFactory.createShape(
    origin.x,
    origin.y,
    origin.width,
    origin.height
  )

  physDivList.push({ el, body, origin })
}

function syncDomToPhysics() {
  for (const obj of physDivList) {
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
