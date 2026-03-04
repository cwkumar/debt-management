<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Login - Cue Haven Debt Manager</title>
</svelte:head>

<div class="login-container">
	<div class="login-card">
		<div class="login-header">
			<div class="logo">🎱</div>
			<h1>Cue Haven</h1>
			<p>Debt Management System</p>
		</div>

		<form
			method="POST"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					loading = false;
					await update();
				};
			}}
		>
			{#if form?.error}
				<div class="error-message">{form.error}</div>
			{/if}

			<div class="form-group">
				<label for="username">Username</label>
				<input
					type="text"
					id="username"
					name="username"
					value={form?.username ?? ''}
					placeholder="Enter username"
					required
				/>
			</div>

			<div class="form-group">
				<label for="password">Password</label>
				<input type="password" id="password" name="password" placeholder="Enter password" required />
			</div>

			<button type="submit" class="btn btn-primary" disabled={loading}>
				{loading ? 'Signing in...' : 'Sign In'}
			</button>
		</form>
	</div>
</div>

<style>
	.login-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #0a2e14 0%, #1a5c2e 50%, #0d3b18 100%);
	}

	.login-card {
		background: #fff;
		border-radius: 16px;
		padding: 2.5rem;
		width: 100%;
		max-width: 400px;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
	}

	.login-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.logo {
		font-size: 3rem;
		margin-bottom: 0.5rem;
	}

	.login-header h1 {
		margin: 0;
		font-size: 1.5rem;
		color: #1a5c2e;
	}

	.login-header p {
		margin: 0.25rem 0 0;
		color: #666;
		font-size: 0.9rem;
	}

	.error-message {
		background: #fee;
		color: #c33;
		padding: 0.75rem 1rem;
		border-radius: 8px;
		margin-bottom: 1rem;
		font-size: 0.875rem;
		border: 1px solid #fcc;
	}

	.form-group {
		margin-bottom: 1.25rem;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.4rem;
		font-weight: 600;
		color: #333;
		font-size: 0.875rem;
	}

	.form-group input {
		width: 100%;
		padding: 0.75rem 1rem;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		font-size: 1rem;
		transition: border-color 0.2s;
		box-sizing: border-box;
	}

	.form-group input:focus {
		outline: none;
		border-color: #1a5c2e;
	}

	.btn {
		width: 100%;
		padding: 0.85rem;
		border: none;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
	}

	.btn-primary {
		background: #1a5c2e;
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		background: #0d3b18;
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>
