<script>
  import { onMount } from "svelte";
  import { registerPhysDiv } from "../physicsRunner";
  import { physicsEnabled } from "../store";

  let element;

  onMount(() => {
    physicsEnabled.subscribe((value) => {
      if (value == true) {
        registerPhysDiv(element);
      }
    });
  });
</script>

<div bind:this={element}>
  <slot />
</div>
