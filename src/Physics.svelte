<script>
  import Box2DFactory from "box2d-wasm";
  import { onMount } from "svelte";
  import { CanvasDebugDraw } from "./debugDraw";
  import { Helpers } from "./helpers";
  import { WorldFactory } from "./world";

  let canvas;

  onMount(async () => {
    const box2D = await Box2DFactory({
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

    const pixelsPerMeter = 1;

    const renderer = new CanvasDebugDraw(
      box2D,
      helpers,
      ctx,
      pixelsPerMeter
    ).constructJSDraw();
    renderer.SetFlags(e_shapeBit);
    const worldFactory = new WorldFactory(box2D, helpers)
    const { step, draw, destroy } = worldFactory.create(
      renderer
    );
    // console.log(worldFactory.createFallingShapes)
    // worldFactory.createFallingShapes()
    worldFactory.createShape()

    const myRound = (val, places) => {
      let c = 1;
      for (let i = 0; i < places; i++) c *= 10;
      return Math.round(val * c) / c;
    };

    const getWorldPointFromPixelPoint = (pixelPoint) => ({
      x: (pixelPoint.x - canvasOffset.x) / pixelsPerMeter,
      y: (pixelPoint.y - (canvas.height - canvasOffset.y)) / pixelsPerMeter,
    });

    const setViewCenterWorld = (pos, instantaneous) => {
      const currentViewCenterWorld = getWorldPointFromPixelPoint(
        viewCenterPixel
      );
      const toMoveX = pos.get_x() - currentViewCenterWorld.x;
      const toMoveY = pos.get_y() - currentViewCenterWorld.y;
      const fraction = instantaneous ? 1 : 0.25;
      canvasOffset.x -= myRound(fraction * toMoveX * pixelsPerMeter, 0);
      canvasOffset.y += myRound(fraction * toMoveY * pixelsPerMeter, 0);
    };
    setViewCenterWorld(new b2Vec2(0, 0), true);

    const drawCanvas = () => {
      //transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(canvasOffset.x, canvasOffset.y);
      ctx.scale(pixelsPerMeter, -pixelsPerMeter);
      ctx.lineWidth /= pixelsPerMeter;
      // CanvasDebugDraw.drawAxes(ctx!);
      ctx.fillStyle = "rgb(255,255,0)";
      draw();

      ctx.restore();
    };

    let handle;

    (function loop(prevMs) {
      const nowMs = window.performance.now();
      handle = requestAnimationFrame(loop.bind(null, nowMs));
      const deltaMs = nowMs - prevMs;
      step(deltaMs);
      drawCanvas();
    })(window.performance.now());

    return () => {
      cancelAnimationFrame(handle);
      destroy();
    };
  });
</script>

<canvas
  bind:this={canvas}
  width={window.innerWidth}
  height={window.innerHeight}
/>

<style>
  canvas {
    position: fixed;
    top: 0;
    left: 0;
    /* -webkit-mask: url(logo.svg) 50% 50% no-repeat;
    mask: url(logo.svg) 50% 50% no-repeat; */
  }
</style>

<slot></slot>