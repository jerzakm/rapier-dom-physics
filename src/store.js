import { writable } from 'svelte/store'

export const physicsEnabled = writable(false)
export const divPhysicsWorldStore = writable(undefined)
