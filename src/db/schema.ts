import { pgEnum, pgTable, serial, text,timestamp } from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";


export const kycStatus = pgEnum('kyc_status', ['not_applied','pending', 'approved', 'rejected'])

export const usersTable = pgTable('users',{
	id:serial("id").primaryKey(),
   name: text("name").notNull().unique(),	
	email: text("email").notNull().unique(),
	kycStatus: kycStatus("kyc_status").notNull().default('not_applied')
})

export const donationsTable = pgTable('donations',{
   id:serial("id").primaryKey(),
   amount: text("amount").notNull(),
   message: text("message"),
	ordersId: text("order_id").notNull().unique(),
	streamerName: text("streamer_name").notNull(),
	donatorName: text("donator_name").notNull(),
	donatorPhone: text("donator_phone").notNull(),
	timestamp: timestamp("timestamp").notNull().defaultNow()
});

export type User = InferSelectModel<typeof usersTable>
export type NewUser = InferInsertModel<typeof usersTable>

export type Donation = InferSelectModel<typeof donationsTable>
export type NewDonation = InferInsertModel<typeof donationsTable>


