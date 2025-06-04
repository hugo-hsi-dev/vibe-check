import type { LayoutServerLoadEvent } from './$types';

export function load({ locals }: LayoutServerLoadEvent) {
	return { user: locals.user };
}
