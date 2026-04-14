import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2026-03-25.dahlia" as Stripe.LatestApiVersion,
});

export async function POST(request: Request) {
	try {
		const { priceId, userId } = await request.json();
		const session = await stripe.checkout.sessions.create({
			mode: "subscription",
			line_items: [{ price: priceId, quantity: 1 }],
			success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscription=success`,
			cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
			metadata: { userId },
		});
		return NextResponse.json({ url: session.url });
	} catch (error) {
		return NextResponse.json(
			{
				error:
					error instanceof Error ? error.message : "Failed to create session",
			},
			{ status: 500 },
		);
	}
}
