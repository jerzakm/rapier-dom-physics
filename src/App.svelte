<script>
  import PhysDiv from './components/PhysDiv.svelte'
  import World from './components/World.svelte'
</script>

<main>
  <World>
    <info>
      <div>
        <div class="grid">
          <PhysDiv><div class="grid-item" /></PhysDiv>
          <PhysDiv><div class="grid-item grid-item--width2 " /></PhysDiv>
          <PhysDiv><div class="grid-item " /></PhysDiv>
          <PhysDiv><div class="grid-item " /></PhysDiv>
          <PhysDiv><div class="grid-item grid-item--width3" /></PhysDiv>
          <PhysDiv><div class="grid-item" /></PhysDiv>
          <PhysDiv><div class="grid-item" /></PhysDiv>
          <PhysDiv><div class="grid-item " /></PhysDiv>
          <PhysDiv><div class="grid-item grid-item--width2 " /></PhysDiv>
          <PhysDiv><div class="grid-item" /></PhysDiv>
          <PhysDiv><div class="grid-item " /></PhysDiv>
          <PhysDiv><div class="grid-item" /></PhysDiv>
          <PhysDiv><div class="grid-item grid-item--width2 " /></PhysDiv>
          <PhysDiv><div class="grid-item grid-item--width2" /></PhysDiv>
        </div>
        <PhysDiv>
          <h1>Svelte DOM Physics</h1>
        </PhysDiv>
        <PhysDiv>
          <h2>
            Adds awesome interaction in form of real-time physics to your DOM
            elements.
          </h2>
        </PhysDiv>
      </div>
      <div>
        <PhysDiv>
          <p>More info about the project can be found <a href=".">HERE</a></p>
        </PhysDiv>
        <PhysDiv>
          <p>
            Want to contribute, discuss implementation, performance or anything
            else?
          </p>
        </PhysDiv>
        <PhysDiv>
          <a href=".">Open an issue</a> or</PhysDiv
        >
        <PhysDiv><a href=".">Send me a message</a></PhysDiv>
      </div>
    </info>
    <div class="grid">
      <PhysDiv><div class="grid-item" /></PhysDiv>
      <PhysDiv><div class="grid-item grid-item--width2 " /></PhysDiv>
      <PhysDiv><div class="grid-item " /></PhysDiv>
      <PhysDiv><div class="grid-item " /></PhysDiv>
      <PhysDiv><div class="grid-item grid-item--width3" /></PhysDiv>
      <PhysDiv><div class="grid-item" /></PhysDiv>
      <PhysDiv><div class="grid-item" /></PhysDiv>
      <PhysDiv><div class="grid-item " /></PhysDiv>
      <PhysDiv><div class="grid-item grid-item--width2 " /></PhysDiv>
      <PhysDiv><div class="grid-item" /></PhysDiv>
      <PhysDiv><div class="grid-item " /></PhysDiv>
      <PhysDiv><div class="grid-item" /></PhysDiv>
      <PhysDiv><div class="grid-item grid-item--width2 " /></PhysDiv>
      <PhysDiv><div class="grid-item grid-item--width2" /></PhysDiv>
      <PhysDiv><div class="grid-item" /></PhysDiv>
      <PhysDiv><div class="grid-item " /></PhysDiv>
      <PhysDiv><div class="grid-item" /></PhysDiv>
      <PhysDiv><div class="grid-item" /></PhysDiv>
      <PhysDiv><div class="grid-item " /></PhysDiv>
      <PhysDiv><div class="grid-item " /></PhysDiv>
      <PhysDiv><div class="grid-item" /></PhysDiv>
      <PhysDiv><div class="grid-item" /></PhysDiv>
      <PhysDiv><div class="grid-item" /></PhysDiv>
      <PhysDiv><div class="grid-item" /></PhysDiv>
      <PhysDiv><div class="grid-item grid-item--width2 " /></PhysDiv>
      <PhysDiv><div class="grid-item " /></PhysDiv>
      <PhysDiv><div class="grid-item " /></PhysDiv>
      <PhysDiv><div class="grid-item grid-item--width3" /></PhysDiv>
      <PhysDiv><div class="grid-item" /></PhysDiv>
      <PhysDiv><div class="grid-item" /></PhysDiv>
      <PhysDiv><div class="grid-item " /></PhysDiv>
      <PhysDiv><div class="grid-item grid-item--width2 " /></PhysDiv>
      <PhysDiv><div class="grid-item" /></PhysDiv>
      <PhysDiv><div class="grid-item " /></PhysDiv>
      <PhysDiv><div class="grid-item" /></PhysDiv>
      <PhysDiv><div class="grid-item grid-item--width2 " /></PhysDiv>
      <PhysDiv><div class="grid-item grid-item--width2" /></PhysDiv>
      <PhysDiv><div class="grid-item" /></PhysDiv>
      <PhysDiv><div class="grid-item " /></PhysDiv>
      <PhysDiv><div class="grid-item" /></PhysDiv>
      <PhysDiv><div class="grid-item" /></PhysDiv>
      <PhysDiv><div class="grid-item " /></PhysDiv>
      <PhysDiv><div class="grid-item " /></PhysDiv>
      <PhysDiv><div class="grid-item" /></PhysDiv>
      <PhysDiv><div class="grid-item" /></PhysDiv>
      <PhysDiv><div class="grid-item" /></PhysDiv>
    </div>
  </World>
</main>

<style>
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
      mix-blend-mode: multiply;
    }
  }

  .grid {
    /* display: flex; */
    flex-wrap: wrap;

    background: #eee;
    width: 100%;
    align-items: baseline;
    /* padding: 5rem 0 5rem 0; */
  }
  .grid-item {
    width: 80px;
    height: 40px;
    float: left;
    background: #ff3e00;
    border-radius: 5px;
    margin: 0.3rem;
  }

  .grid-item--width2 {
    width: 90px;
  }
  .grid-item--width3 {
    width: 200px;
  }
</style>
