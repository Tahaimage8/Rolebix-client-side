import 'server-only'

import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


export const PLAN_PRICE_ID = {
    "seeker_Pro" : "price_1TgIlbPrq7ogYZopBCakXFrs",
    "seeker_Premium" : "price_1TgMFTPrq7ogYZop7Jgze0YH",
    "recruiter_Growth" : "price_1TgMJpPrq7ogYZopIIZSriTA",
    "recruiter_Enterprise" : "price_1TgMIWPrq7ogYZopORSdOmzK",
}