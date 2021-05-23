<script>
  import { onMount, getContext } from 'svelte'
  import { divPhysicsWorldStore } from '../store'

  let element
  let registered = false

  const physicsWorld = getContext('physicsWorld')

  onMount(() => {
    // physicsWorld.registerPhysDiv(element)
    divPhysicsWorldStore.subscribe((world) => {
      if (world && !registered) {
        world.registerPhysDiv(element)
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
  }
</style>
