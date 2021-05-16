<script>
  import PhysicsWorld from '../PhysicsWorld'
  import { setContext } from 'svelte'

  const world = new PhysicsWorld()

  setContext('physicsWorld', world)
</script>

<slot />
