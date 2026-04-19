import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
		apiVersion: "2026-03-25.dahlia" as Stripe.LatestApiVersion,
	});

	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_ROLE_KEY!,
	);

	const body = await request.text();
	const signature = request.headers.get("stripe-signature");

	if (!signature) {
		return NextResponse.json({ error: "No signature" }, { status: 400 });
	}

	try {
		const event = stripe.webhooks.constructEvent(
			body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET!,
		);

		if (event.type === "checkout.session.completed") {
			const session = event.data.object;

			const { error } = await supabase.from("subscriptions").insert({
				user_id: session.metadata?.userId,
				stripe_customer_id: session.customer as string,
				stripe_subscription_id: session.subscription as string,
				plan: "pro",
				status: "active",
			});

			if (error) {
				console.error("Supabase error:", error);
			}
		}

		return NextResponse.json({ received: true });
	} catch (error) {
		return NextResponse.json(
			{
				error: error instanceof Error ? error.message : "Webhook failed",
			},
			{ status: 400 },
		);
	}
}
