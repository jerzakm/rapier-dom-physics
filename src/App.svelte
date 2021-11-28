<script lang="ts">
</script>

<main class="hero min-h-screen bg-base-200 p-10">
  <div class="text-center grid grid-cols-3 gap-10">
    <div>
      <h1 class="mb-5 text-5xl font-bold">
        DOM Physics with Svelte and Rapier.rs
      </h1>
      <p>
        <span>Simple proof of concept for a fun user interaction.</span>
        <span
          >We pretend that elements of the webpage are rectangles in a 2D
          physics world.</span
        >
      </p>
      <p><span>Press the button and let the magic happen.</span></p>

      <button class="btn btn-primary mt-5">Let's get physical</button>

      <div class="flex flex-wrap justify-center">
        <h1 class="w-full">Powered by:</h1>
        <div class="avatar">
          <div class="mb-8 w-24 h-24">
            <a href="https://github.com/dimforge/rapier"
              ><img src="/img/rapier.svg" alt="Rapier " /></a
            >
          </div>
        </div>
        <div class="avatar">
          <div class="mb-8  w-24 h-24">
            <a href="https://svelte.dev"
              ><img src="/img/svelte.png" alt="Svelte" /></a
            >
          </div>
        </div>
        <div class="avatar">
          <div class="mb-8  w-24 h-24">
            <a href="https://www.typescriptlang.org/"
              ><img src="/img/typescript.png" alt="Typescript" /></a
            >
          </div>
        </div>
      </div>
    </div>
    <div />
    <div class="grid grid-cols-2 gap-5">
      <div class="card text-center shadow-2xl">
        <div class="card-body">
          <h2 class="card-title">Gravity</h2>
          <p>
            <input type="range" max="100" value="40" class="range" />
            <input
              type="range"
              max="100"
              value="50"
              class="range range-primary"
            />
            <input
              type="range"
              max="100"
              value="60"
              class="range range-secondary"
            />
            <input
              type="range"
              max="100"
              value="70"
              class="range range-accent"
            />
          </p>
          <div class="justify-center card-actions" />
        </div>
      </div>

      <div class="card shadow-2xl lg:card-side bg-primary text-primary-content">
        <div class="card-body">
          <p>Rerum reiciendis beatae tenetur excepturi aut pariatur est eos.</p>
          <div class="justify-end card-actions">
            <button class="btn btn-primary">
              More info

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block w-6 h-6 ml-2 stroke-current"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div
        class="card shadow-2xl lg:card-side bg-secondary text-secondary-content"
      >
        <div class="card-body">
          <div class="justify-end card-actions">
            <button class="btn btn-secondary btn-square">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block w-6 h-6 stroke-current"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p>Rerum reiciendis beatae tenetur excepturi aut pariatur est eos.</p>
        </div>
      </div>
      <div
        class="card text-center shadow-2xl lg:card-side bg-accent text-accent-content"
      >
        <div class="card-body">
          <p>Rerum reiciendis beatae tenetur excepturi aut pariatur est eos.</p>
          <div class="justify-center card-actions">
            <button class="btn btn-accent">Start now</button>
            <button class="btn btn-accent">More info</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  .avatar {
    margin-right: 1rem;
  }
</style>
