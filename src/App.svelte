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

      <PhysDiv>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad iusto
          itaque, numquam fuga iste unde id voluptatum minima maxime?
          Praesentium animi corrupti eligendi ipsum tempora accusantium, commodi
          nam in atque hic recusandae omnis a dolor facilis odit culpa nemo
          adipisci ratione accusamus. Dolorum, voluptatum tenetur beatae ipsum
          quibusdam consectetur eveniet eligendi vitae quis hic, dicta ut autem
          quam distinctio veritatis velit sunt doloribus. Vero reiciendis,
          inventore quasi itaque vitae cum laboriosam nulla sint dolores ipsam
          fugiat, in repellendus cupiditate voluptates explicabo eligendi
          officia repudiandae deserunt ipsa. Animi temporibus totam commodi,
          alias ea quos, eius asperiores, assumenda sit velit repellendus
          voluptatibus.
        </p>
      </PhysDiv>
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
  <!-- <div class="grid">
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
  </div> -->
</main>

<style>
  canvas {
    position: fixed;
    top: 0;
    left: 0;
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
