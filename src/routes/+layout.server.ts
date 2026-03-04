import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const isLoginPage = url.pathname === '/';

	if (!locals.isAuthenticated && !isLoginPage) {
		throw redirect(302, '/');
	}

	return {
		isAuthenticated: locals.isAuthenticated
	};
};
