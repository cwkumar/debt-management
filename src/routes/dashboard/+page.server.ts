import { fail } from '@sveltejs/kit';
import { getUsers, addUser } from '$lib/server/sheets';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const users = await getUsers();
	return { users };
};

export const actions: Actions = {
	addUser: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name')?.toString().trim() || '';
		const phone = data.get('phone')?.toString().trim() || '';

		if (!name) {
			return fail(400, { error: 'Name is required', name, phone });
		}

		await addUser(name, phone);
		return { success: true };
	}
};
