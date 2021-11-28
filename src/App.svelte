<script lang="ts">
  import Content from "./Content.svelte";
  import PhysicsWorker from "web-worker:./PhysicsWorker.ts";

  const worker = new PhysicsWorker();
  worker.postMessage("Hello World!");
</script>

<Content />
