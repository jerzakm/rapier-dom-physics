<script>
  import { onMount, getContext } from 'svelte'
  import { registerPhysDiv } from '../physicsRunner'
  import { physicsEnabled } from '../store'

  let element

  const w = getContext('physicsWorld')
  console.log(w)

  onMount(() => {
    physicsEnabled.subscribe((value) => {
      if (value == true) {
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
