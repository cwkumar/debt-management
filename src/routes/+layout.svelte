<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import type { LayoutData } from './$types';

	let { children, data }: { children: any; data: LayoutData } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if data.isAuthenticated}
	<nav class="navbar">
		<div class="nav-brand">
			<span class="nav-logo">🎱</span>
			<span class="nav-title">Cue Haven</span>
		</div>
		<form method="POST" action="/api/logout">
			<button type="submit" class="btn-logout">Logout</button>
		</form>
	</nav>
{/if}

<main class:has-nav={data.isAuthenticated}>
	{@render children?.()}
</main>

<style>
	:global(body) {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		background: #f5f7f5;
		color: #333;
	}

	:global(*) {
		box-sizing: border-box;
	}

	.navbar {
		background: #1a5c2e;
		color: white;
		padding: 0 1.5rem;
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.nav-brand {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.nav-logo {
		font-size: 1.5rem;
	}

	.nav-title {
		font-weight: 700;
		font-size: 1.1rem;
	}

	.btn-logout {
		background: rgba(255, 255, 255, 0.15);
		color: white;
		border: 1px solid rgba(255, 255, 255, 0.3);
		padding: 0.5rem 1.25rem;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 500;
		transition: background 0.2s;
	}

	.btn-logout:hover {
		background: rgba(255, 255, 255, 0.25);
	}

	main {
		min-height: 100vh;
	}

	main.has-nav {
		min-height: calc(100vh - 60px);
	}
</style>
