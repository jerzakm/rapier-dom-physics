<script>
  import PhysicsWorld from '../PhysicsWorld'
  import { onMount, setContext } from 'svelte'

  const world = new PhysicsWorld()

  setContext('physicsWorld', world)
</script>

<slot />
