<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let search = $state('');
	let showAddForm = $state(false);
	let adding = $state(false);

	let filteredUsers = $derived(
		data.users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()))
	);

	let totalDebt = $derived(data.users.reduce((sum, u) => sum + u.total_debt, 0));

	$effect(() => {
		if (form?.success) {
			showAddForm = false;
		}
	});
</script>

<svelte:head>
	<title>Dashboard - Cue Haven Debt Manager</title>
</svelte:head>

<div class="dashboard">
	<div class="dashboard-header">
		<div>
			<h1>Dashboard</h1>
			<p class="subtitle">{data.users.length} members &middot; Total debt: ₹{totalDebt.toLocaleString()}</p>
		</div>
		<button class="btn btn-primary" onclick={() => (showAddForm = !showAddForm)}>
			{showAddForm ? 'Cancel' : '+ Add Member'}
		</button>
	</div>

	{#if showAddForm}
		<div class="add-form-card">
			<h3>Add New Member</h3>
			<form
				method="POST"
				action="?/addUser"
				use:enhance={() => {
					adding = true;
					return async ({ update }) => {
						adding = false;
						await update();
					};
				}}
			>
				{#if form?.error}
					<div class="error-message">{form.error}</div>
				{/if}
				<div class="form-row">
					<div class="form-group">
						<label for="name">Name *</label>
						<input
							type="text"
							id="name"
							name="name"
							placeholder="Member name"
							value={form?.name ?? ''}
							required
						/>
					</div>
					<div class="form-group">
						<label for="phone">Phone</label>
						<input
							type="text"
							id="phone"
							name="phone"
							placeholder="Phone number"
							value={form?.phone ?? ''}
						/>
					</div>
					<div class="form-group form-action">
						<button type="submit" class="btn btn-primary" disabled={adding}>
							{adding ? 'Adding...' : 'Add Member'}
						</button>
					</div>
				</div>
			</form>
		</div>
	{/if}

	<div class="search-bar">
		<input type="text" placeholder="Search members..." bind:value={search} />
	</div>

	<div class="table-container">
		<table>
			<thead>
				<tr>
					<th>Name</th>
					<th>Phone</th>
					<th>Total Debt</th>
					<th>Added On</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each filteredUsers as user}
					<tr>
						<td class="name-cell">{user.name}</td>
						<td>{user.phone || '—'}</td>
						<td class="debt-cell" class:has-debt={user.total_debt > 0}>
							₹{user.total_debt.toLocaleString()}
						</td>
						<td class="date-cell">{user.created_at}</td>
						<td>
							<a href="/dashboard/{user.id}" class="btn btn-sm">View</a>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="5" class="empty-state">
							{search ? 'No members found' : 'No members yet. Add your first member!'}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	.dashboard {
		max-width: 960px;
		margin: 0 auto;
		padding: 2rem 1.5rem;
	}

	.dashboard-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1.5rem;
	}

	.dashboard-header h1 {
		margin: 0;
		font-size: 1.75rem;
		color: #1a5c2e;
	}

	.subtitle {
		margin: 0.25rem 0 0;
		color: #666;
		font-size: 0.9rem;
	}

	.btn {
		padding: 0.6rem 1.25rem;
		border: none;
		border-radius: 8px;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
		text-decoration: none;
		display: inline-block;
	}

	.btn-primary {
		background: #1a5c2e;
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		background: #0d3b18;
	}

	.btn-primary:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-sm {
		padding: 0.35rem 0.85rem;
		background: #e8f5e9;
		color: #1a5c2e;
		font-size: 0.8rem;
		border-radius: 6px;
	}

	.btn-sm:hover {
		background: #c8e6c9;
	}

	.add-form-card {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		border: 2px solid #e8f5e9;
	}

	.add-form-card h3 {
		margin: 0 0 1rem;
		color: #1a5c2e;
	}

	.form-row {
		display: flex;
		gap: 1rem;
		align-items: flex-end;
	}

	.form-group {
		flex: 1;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.35rem;
		font-weight: 600;
		font-size: 0.8rem;
		color: #555;
	}

	.form-group input {
		width: 100%;
		padding: 0.65rem 0.85rem;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		font-size: 0.9rem;
		box-sizing: border-box;
	}

	.form-group input:focus {
		outline: none;
		border-color: #1a5c2e;
	}

	.form-action {
		flex: 0 0 auto;
	}

	.error-message {
		background: #fee;
		color: #c33;
		padding: 0.6rem 0.85rem;
		border-radius: 8px;
		margin-bottom: 1rem;
		font-size: 0.85rem;
		border: 1px solid #fcc;
	}

	.search-bar {
		margin-bottom: 1rem;
	}

	.search-bar input {
		width: 100%;
		padding: 0.75rem 1rem;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		font-size: 0.95rem;
		background: white;
		box-sizing: border-box;
	}

	.search-bar input:focus {
		outline: none;
		border-color: #1a5c2e;
	}

	.table-container {
		background: white;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th {
		background: #f0f7f0;
		padding: 0.85rem 1rem;
		text-align: left;
		font-size: 0.8rem;
		font-weight: 700;
		color: #555;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	td {
		padding: 0.85rem 1rem;
		border-top: 1px solid #f0f0f0;
		font-size: 0.9rem;
	}

	tr:hover td {
		background: #fafffe;
	}

	.name-cell {
		font-weight: 600;
		color: #222;
	}

	.debt-cell {
		font-weight: 700;
		color: #666;
	}

	.debt-cell.has-debt {
		color: #c33;
	}

	.date-cell {
		color: #888;
		font-size: 0.85rem;
	}

	.empty-state {
		text-align: center;
		padding: 2.5rem 1rem !important;
		color: #999;
		font-style: italic;
	}

	@media (max-width: 640px) {
		.dashboard-header {
			flex-direction: column;
			gap: 1rem;
		}

		.form-row {
			flex-direction: column;
		}

		.form-action {
			width: 100%;
		}

		.form-action .btn {
			width: 100%;
		}

		th:nth-child(4),
		td:nth-child(4) {
			display: none;
		}
	}
</style>
