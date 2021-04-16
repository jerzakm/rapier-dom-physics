import Box2DFactory from "box2d-wasm";

import { CanvasDebugDraw } from "./debugDraw";
import { Helpers } from "./helpers";
import { WorldFactory } from "./world";

let box2D;

const PIXELS_PER_METER = 1;

export const runPhysics = async (canvas) => {
  box2D = await Box2DFactory({
    /**
     * By default, this looks for Box2D.wasm relative to public/build/bundle.js:
     * @example (url, scriptDirectory) => `${scriptDirectory}${url}`
     * But we want to look for Box2D.wasm relative to public/index.html instead.
     */
    locateFile: (url) => url,
  });

  const {
    b2Vec2,
    b2Draw: { e_shapeBit },
  } = box2D;
  const helpers = new Helpers(box2D);

  const ctx = canvas.getContext("2d");
  const canvasOffset = {
    x: canvas.width / 2,
    y: canvas.height / 2,
  };
  const viewCenterPixel = {
    x: canvas.width / 2,
    y: canvas.height / 2,
  };

  const renderer = new CanvasDebugDraw(
    box2D,
    helpers,
    ctx,
    PIXELS_PER_METER
  ).constructJSDraw();
  renderer.SetFlags(e_shapeBit);
  const worldFactory = new WorldFactory(box2D, helpers);
  const { step, draw, destroy } = worldFactory.create(renderer);
  worldFactory.createShape();

  const myRound = (val, places) => {
    let c = 1;
    for (let i = 0; i < places; i++) c *= 10;
    return Math.round(val * c) / c;
  };

  const getWorldPointFromPixelPoint = (pixelPoint) => ({
    x: (pixelPoint.x - canvasOffset.x) / PIXELS_PER_METER,
    y: (pixelPoint.y - (canvas.height - canvasOffset.y)) / PIXELS_PER_METER,
  });

  const setViewCenterWorld = (pos, instantaneous) => {
    const currentViewCenterWorld = getWorldPointFromPixelPoint(viewCenterPixel);
    const toMoveX = pos.get_x() - currentViewCenterWorld.x;
    const toMoveY = pos.get_y() - currentViewCenterWorld.y;
    const fraction = instantaneous ? 1 : 0.25;
    canvasOffset.x -= myRound(fraction * toMoveX * PIXELS_PER_METER, 0);
    canvasOffset.y += myRound(fraction * toMoveY * PIXELS_PER_METER, 0);
  };

  setViewCenterWorld(new b2Vec2(0, 0), true);

  const drawCanvas = () => {
    //transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvasOffset.x, canvasOffset.y);
    ctx.scale(PIXELS_PER_METER, -PIXELS_PER_METER);
    ctx.lineWidth /= PIXELS_PER_METER;
    // CanvasDebugDraw.drawAxes(ctx!);
    ctx.fillStyle = "rgb(255,255,0)";
    draw();

    ctx.restore();
  };

  let handle;

  function ticker(prevMs = window.performance.now()) {
    const nowMs = window.performance.now();
    handle = requestAnimationFrame(ticker.bind(null, nowMs));
    const deltaMs = nowMs - prevMs;
    step(deltaMs);
    drawCanvas();
  }

  ticker();
};
