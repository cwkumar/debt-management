import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const session = event.cookies.get('session');
	event.locals.isAuthenticated = session === 'authenticated';
	return resolve(event);
};
