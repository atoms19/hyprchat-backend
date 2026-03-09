import { pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";


export const kycStatus = pgEnum('kyc_status', ['not_applied','pending', 'approved', 'rejected'])

export const usersTable = pgTable('users',{
	id:serial("id").primaryKey(),
   name: text("name").notNull().unique(),	
	email: text("email").notNull().unique(),
	kycStatus: kycStatus("kyc_status").notNull().default('not_applied')
})

export type User = InferSelectModel<typeof usersTable>
export type NewUser = InferInsertModel<typeof usersTable>



