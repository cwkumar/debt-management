import { fail, redirect } from '@sveltejs/kit';
import { validateAdmin } from '$lib/server/sheets';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.isAuthenticated) {
		throw redirect(302, '/dashboard');
	}
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username')?.toString() || '';
		const password = data.get('password')?.toString() || '';

		if (!username || !password) {
			return fail(400, { error: 'Username and password are required', username });
		}

		const valid = await validateAdmin(username, password);
		if (!valid) {
			return fail(401, { error: 'Invalid username or password', username });
		}

		cookies.set('session', 'authenticated', {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 // 1 day
		});

		throw redirect(302, '/dashboard');
	}
};
