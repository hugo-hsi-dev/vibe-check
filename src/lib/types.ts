import type { auth } from '$lib/server/auth';

export type Session = SessionResult['session'];
export type User = SessionResult['user'];

type SessionResult = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;
