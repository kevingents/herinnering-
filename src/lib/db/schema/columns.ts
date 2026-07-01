import { timestamp, uuid } from "drizzle-orm/pg-core";

/** Standard UUID primary key. */
export const primaryId = () => uuid().primaryKey().defaultRandom();

/** created_at / updated_at pair, spread into a table's column map. */
export const timestamps = () => ({
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
