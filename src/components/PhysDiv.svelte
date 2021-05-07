<script>
  import { onMount } from 'svelte'
  import { registerPhysDiv } from '../physicsRunner'
  import { physicsEnabled } from '../store'

  export let debug

  let element

  onMount(() => {
    physicsEnabled.subscribe((value) => {
      if (value == true) {
        if (debug) {
          console.log(element, element.getBoundingClientRect())
        }
        registerPhysDiv(element)
      }
    })
  })
</script>

<div bind:this={element}>
  <slot />
</div>

<style>
  div {
    transform-origin: 0% 0%;
    display: inline-block;
  }
</style>
