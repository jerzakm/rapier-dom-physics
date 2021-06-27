<script>
  import { onMount, getContext } from 'svelte'
  import { divPhysicsWorldStore } from '../store'

  let element
  let registered = false
  export let dynamic = true

  onMount(() => {
    divPhysicsWorldStore.subscribe((world) => {
      if (world && !registered) {
        world.registerPhysDiv(element, { dynamic })
        registered = true
      }
    })
  })
</script>

<physDiv bind:this={element}>
  <slot />
</physDiv>

<style>
  physDiv {
    transform-origin: 0% 0%;
    display: inline-block;
    /* transition-duration: 10ms; */
  }
</style>
