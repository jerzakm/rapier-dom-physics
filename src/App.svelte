<script>
	export let name;
	import Physics from './Physics.svelte'
</script>



<main>
	<info>
		<h1>
		Svelte DOM Physics
		</h1>
		<h2>
			Adds awesome interaction in form of real-time physics to your DOM elements.
		</h2>
		<p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Harum libero consequatur corrupti officiis molestias dolores deleniti est saepe adipisci nostrum!</p>
		<p>More info about the project can be found <strong>HERE</strong></p>
	</info>
	<bulletpoints>
		k
	</bulletpoints>
</main>

<!-- <Physics/> -->

<style>
	main {
		padding: 1rem;
		display: grid;
		grid-template-columns: 2fr 3fr;
		gap: 2rem;
	}

	info{
		padding: 5rem 2rem 5rem 2rem;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>