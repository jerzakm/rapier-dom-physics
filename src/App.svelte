<script>
  import PhysDiv from "./components/PhysDiv.svelte";
  import { runPhysics } from "./physicsRunner";
  import { onMount } from "svelte";
  let canvas;

  onMount(() => {
    runPhysics(canvas);
  });
</script>

<canvas
  bind:this={canvas}
  width={window.innerWidth}
  height={window.innerHeight}
/>
<main>
  <info>
    <div>
      <PhysDiv>
        <h1>Svelte DOM Physics</h1>
      </PhysDiv>
      <h2>
        Adds awesome interaction in form of real-time physics to your DOM
        elements.
      </h2>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Harum libero
        consequatur corrupti officiis molestias dolores deleniti est saepe
        adipisci nostrum!
      </p>
    </div>
    <div>
      <p>More info about the project can be found <a href=".">HERE</a></p>
      <p>
        Want to contribute, discuss implementation, performance or anything
        else?
      </p>
      <a href=".">Open an issue</a> or <a href=".">Send me a message</a>
    </div>
  </info>
  <div class="grid">
    <div class="grid-item" />
    <div class="grid-item grid-item--width2 " />
    <div class="grid-item " />
    <div class="grid-item " />
    <div class="grid-item grid-item--width3" />
    <div class="grid-item" />
    <div class="grid-item" />
    <div class="grid-item " />
    <div class="grid-item grid-item--width2 " />
    <div class="grid-item" />
    <div class="grid-item " />
    <div class="grid-item" />
    <div class="grid-item grid-item--width2 " />
    <div class="grid-item grid-item--width2" />
    <div class="grid-item" />
    <div class="grid-item " />
    <div class="grid-item" />
    <div class="grid-item" />
    <div class="grid-item " />
    <div class="grid-item " />
    <div class="grid-item" />
    <div class="grid-item" />
    <div class="grid-item" />
  </div>
</main>

<style>
  canvas {
    position: fixed;
    top: 0;
  }

  main {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    min-height: 100vh;
  }

  info {
    padding: 5rem 2rem 5rem 2rem;
    display: flex;
    flex-direction: column;
  }

  @media (min-width: 960px) {
    main {
      /* max-width: none; */
      grid-template-columns: 2fr 3fr;
    }
  }

  .grid {
    background: #eee;
    width: 100%;
    padding: 5rem 0 5rem 0;
    gap: 10rem;
  }
  .grid-item {
    width: 160px;
    height: 90px;
    float: left;
    background: #ff3e00;
    border-radius: 5px;
    margin: 1rem;
  }

  .grid-item--width2 {
    width: 320px;
  }
  .grid-item--width3 {
    width: 440px;
  }
</style>
