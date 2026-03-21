import { pgEnum, pgTable, serial, text,timestamp } from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";


export const kycStatus = pgEnum('kyc_status', ['not_applied','pending', 'approved', 'rejected'])

export const usersTable = pgTable('users',{
	id:serial("id").primaryKey(),
   name: text("name").notNull().unique(),	
	email: text("email").notNull().unique(),
	kycStatus: kycStatus("kyc_status").notNull().default('not_applied'),
   cashfreeVendorId: text("cashfree_vendor_id")
})


// required deatails for kyc 
/*
{
  "vendor_id": "vendortest40",
  "status": "ACTIVE",
  "name": "customer",
  "email": "[johndoe@cashfree.com]()",
  "phone": "9876543210",
  "verify_account": true,
  "dashboard_access": true,
  "schedule_option": 2,
  "bank": {
   "account_number": "026291800001191",
 	 "account_holder": "John Doe",
 	 "ifsc": "YESB0000262"
  },
  "kyc_details": {
    "account_type": "Proprietorship",
    "business_type": "Jewellery",
    "uidai": "655675523712",
    "gst": "29AAICP2912R1ZR",
    "cin": "L00000Aa0000AaA000000",
    "pan": "ABCPV1234D",
    "passport_number": "L6892603"
  }
*/


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


