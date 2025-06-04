import { timestamp, integer, pgTable } from 'drizzle-orm/pg-core';

export const question = pgTable('question', {
	createdAt: timestamp('created_at')
		.$defaultFn(() => new Date())
		.notNull(),
	id: integer().primaryKey().generatedAlwaysAsIdentity()
});
