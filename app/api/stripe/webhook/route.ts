import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
		apiVersion: "2026-03-25.dahlia" as Stripe.LatestApiVersion,
	});

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

			const supabase = await createClient();
			await supabase.from("subscriptions").insert({
				user_id: session.metadata?.userId,
				stripe_customer_id: session.customer as string,
				stripe_subscription_id: session.subscription as string,
				plan: "pro",
				status: "active",
			});
		}

		return new Response("Success", { status: 200 });
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
