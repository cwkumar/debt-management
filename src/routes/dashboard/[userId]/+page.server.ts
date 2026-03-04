import { error, fail } from '@sveltejs/kit';
import { getUserById, getDebtHistory, addDebtEntry } from '$lib/server/sheets';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const user = await getUserById(params.userId);
	if (!user) {
		throw error(404, 'Member not found');
	}

	const history = await getDebtHistory(params.userId);
	return { user, history };
};

export const actions: Actions = {
	addDebt: async ({ request, params }) => {
		const data = await request.formData();
		const amountStr = data.get('amount')?.toString().trim() || '';
		const type = data.get('type')?.toString() as 'add' | 'reduce';
		const description = data.get('description')?.toString().trim() || '';

		const amount = parseFloat(amountStr);
		if (!amount || amount <= 0) {
			return fail(400, { error: 'Please enter a valid amount greater than 0' });
		}

		if (!type || !['add', 'reduce'].includes(type)) {
			return fail(400, { error: 'Invalid transaction type' });
		}

		await addDebtEntry(params.userId, amount, type, description);
		return { success: true };
	}
};
