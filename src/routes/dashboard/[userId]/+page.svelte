<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let submitting = $state(false);
	let selectedType = $state<'add' | 'reduce'>('add');
</script>

<svelte:head>
	<title>{data.user.name} - Debt Details</title>
</svelte:head>

<div class="user-detail">
	<a href="/dashboard" class="back-link">← Back to Dashboard</a>

	<div class="user-header">
		<div class="user-info">
			<h1>{data.user.name}</h1>
			{#if data.user.phone}
				<p class="phone">{data.user.phone}</p>
			{/if}
			<p class="member-since">Member since {data.user.created_at}</p>
		</div>
		<div class="debt-badge" class:has-debt={data.user.total_debt > 0}>
			<span class="debt-label">Total Debt</span>
			<span class="debt-amount">₹{data.user.total_debt.toLocaleString()}</span>
		</div>
	</div>

	<div class="debt-form-card">
		<h3>Record Transaction</h3>
		<form
			method="POST"
			action="?/addDebt"
			use:enhance={() => {
				submitting = true;
				return async ({ update }) => {
					submitting = false;
					await update();
				};
			}}
		>
			{#if form?.error}
				<div class="error-message">{form.error}</div>
			{/if}
			{#if form?.success}
				<div class="success-message">Transaction recorded successfully!</div>
			{/if}

			<div class="type-toggle">
				<label class="type-option" class:active={selectedType === 'add'}>
					<input type="radio" name="type" value="add" bind:group={selectedType} />
					<span>Add Debt</span>
				</label>
				<label class="type-option reduce" class:active={selectedType === 'reduce'}>
					<input type="radio" name="type" value="reduce" bind:group={selectedType} />
					<span>Reduce Debt</span>
				</label>
			</div>

			<div class="form-row">
				<div class="form-group">
					<label for="amount">Amount (₹) *</label>
					<input
						type="number"
						id="amount"
						name="amount"
						placeholder="0"
						min="1"
						step="1"
						required
					/>
				</div>
				<div class="form-group flex-2">
					<label for="description">Description</label>
					<input
						type="text"
						id="description"
						name="description"
						placeholder="e.g., Table rental, Payment received"
					/>
				</div>
				<div class="form-group form-action">
					<button type="submit" class="btn btn-primary" disabled={submitting}>
						{submitting ? 'Saving...' : 'Save'}
					</button>
				</div>
			</div>
		</form>
	</div>

	<div class="history-section">
		<h3>Transaction History</h3>
		{#if data.history.length > 0}
			<div class="table-container">
				<table>
					<thead>
						<tr>
							<th>Date</th>
							<th>Type</th>
							<th>Amount</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						{#each data.history as entry}
							<tr>
								<td class="date-cell">{entry.date}</td>
								<td>
									<span class="type-badge" class:add={entry.type === 'add'} class:reduce={entry.type === 'reduce'}>
										{entry.type === 'add' ? '+ Added' : '− Reduced'}
									</span>
								</td>
								<td class="amount-cell" class:add={entry.type === 'add'} class:reduce={entry.type === 'reduce'}>
									₹{entry.amount.toLocaleString()}
								</td>
								<td class="desc-cell">{entry.description || '—'}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="empty-history">No transactions recorded yet.</div>
		{/if}
	</div>
</div>

<style>
	.user-detail {
		max-width: 960px;
		margin: 0 auto;
		padding: 2rem 1.5rem;
	}

	.back-link {
		color: #1a5c2e;
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 500;
		display: inline-block;
		margin-bottom: 1.5rem;
	}

	.back-link:hover {
		text-decoration: underline;
	}

	.user-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 2rem;
		background: white;
		padding: 1.5rem;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.user-info h1 {
		margin: 0;
		font-size: 1.5rem;
		color: #1a5c2e;
	}

	.phone {
		margin: 0.25rem 0 0;
		color: #555;
		font-size: 0.95rem;
	}

	.member-since {
		margin: 0.25rem 0 0;
		color: #999;
		font-size: 0.8rem;
	}

	.debt-badge {
		text-align: right;
		background: #f0f7f0;
		padding: 1rem 1.5rem;
		border-radius: 10px;
	}

	.debt-badge.has-debt {
		background: #fff5f5;
	}

	.debt-label {
		display: block;
		font-size: 0.75rem;
		font-weight: 600;
		color: #888;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.debt-amount {
		font-size: 1.75rem;
		font-weight: 800;
		color: #1a5c2e;
	}

	.debt-badge.has-debt .debt-amount {
		color: #c33;
	}

	.debt-form-card {
		background: white;
		padding: 1.5rem;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		border: 2px solid #e8f5e9;
		margin-bottom: 2rem;
	}

	.debt-form-card h3 {
		margin: 0 0 1rem;
		color: #1a5c2e;
	}

	.type-toggle {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.type-option {
		flex: 1;
		padding: 0.65rem 1rem;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		text-align: center;
		cursor: pointer;
		font-weight: 600;
		font-size: 0.9rem;
		transition: all 0.2s;
		color: #666;
	}

	.type-option input {
		display: none;
	}

	.type-option.active {
		border-color: #1a5c2e;
		background: #e8f5e9;
		color: #1a5c2e;
	}

	.type-option.reduce.active {
		border-color: #2196f3;
		background: #e3f2fd;
		color: #1565c0;
	}

	.form-row {
		display: flex;
		gap: 1rem;
		align-items: flex-end;
	}

	.form-group {
		flex: 1;
	}

	.form-group.flex-2 {
		flex: 2;
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

	.btn {
		padding: 0.65rem 1.5rem;
		border: none;
		border-radius: 8px;
		font-size: 0.9rem;
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

	.btn-primary:disabled {
		opacity: 0.6;
		cursor: not-allowed;
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

	.success-message {
		background: #e8f5e9;
		color: #2e7d32;
		padding: 0.6rem 0.85rem;
		border-radius: 8px;
		margin-bottom: 1rem;
		font-size: 0.85rem;
		border: 1px solid #c8e6c9;
	}

	.history-section h3 {
		color: #1a5c2e;
		margin: 0 0 1rem;
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
		padding: 0.75rem 1rem;
		border-top: 1px solid #f0f0f0;
		font-size: 0.9rem;
	}

	.date-cell {
		color: #888;
		font-size: 0.85rem;
		white-space: nowrap;
	}

	.type-badge {
		padding: 0.2rem 0.6rem;
		border-radius: 4px;
		font-size: 0.8rem;
		font-weight: 600;
	}

	.type-badge.add {
		background: #fff5f5;
		color: #c33;
	}

	.type-badge.reduce {
		background: #e3f2fd;
		color: #1565c0;
	}

	.amount-cell {
		font-weight: 700;
	}

	.amount-cell.add {
		color: #c33;
	}

	.amount-cell.reduce {
		color: #1565c0;
	}

	.desc-cell {
		color: #666;
	}

	.empty-history {
		background: white;
		padding: 2.5rem;
		border-radius: 12px;
		text-align: center;
		color: #999;
		font-style: italic;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	@media (max-width: 640px) {
		.user-header {
			flex-direction: column;
			gap: 1rem;
		}

		.debt-badge {
			text-align: left;
			width: 100%;
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
	}
</style>
