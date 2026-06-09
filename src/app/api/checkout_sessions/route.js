import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { PLAN_PRICE_ID, stripe } from "@/lib/stripe";
import { getUserSession } from "@/lib/core/session";

export async function POST(request) {
  try {
    const headersList = await headers();
  
    const origin =headersList.get("origin") || process.env.NEXT_PUBLIC_APP_URL;


    const formdata = await request.formData()
    const planId = formdata.get("plan_id")
    const user = await getUserSession()
    const priceId = PLAN_PRICE_ID[planId]

    if (!origin) {
      return NextResponse.json(
        { error: "Missing app origin URL" },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: user?.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe checkout session URL not found" },
        { status: 500 }
      );
    }

    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    return NextResponse.json(
      {
        error: err?.message || "Something went wrong",
      },
      {
        status: err?.statusCode || 500,
      }
    );
  }
}