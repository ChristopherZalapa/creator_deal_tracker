"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function PricingPage() {
	const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
	const router = useRouter();

	const plans = [
		{
			name: "Free",
			price: "$0",
			priceId: null,
			features: ["3 Creators", "5 Deals", "Basic Dashboard"],
		},
		{
			name: "Pro",
			price: "$29",
			priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
			features: [
				"Unlimited Creators",
				"Unlimited Deals",
				"Analytics Dashboard",
				"CSV Export",
				"AI Email Templates",
			],
		},
		{
			name: "Agency",
			price: "$99",
			priceId: process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID,
			features: [
				"Everything in Pro",
				"Team Members",
				"Priority Support",
				"Custom Branding",
			],
		},
	];

	const handleSubscription = async (priceId: string, planName: string) => {
		setLoadingPlan(planName);
		try {
			const supabase = createClient();
			const {
				data: { user },
			} = await supabase.auth.getUser();

			const response = await fetch("/api/stripe/checkout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ priceId, userId: user?.id }),
			});

			const data = await response.json();
			if (data.url) {
				window.location.href = data.url;
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoadingPlan(null);
		}
	};

	return (
		<div className='p-8 flex items-center justify-center min-h-screen'>
			<div className='w-full max-w-5xl'>
				<h1 className='text-white text-2xl font-semibold mb-8 text-center'>
					Pricing
				</h1>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch'>
					{plans.map((plan) => (
						<div
							key={plan.name}
							className='bg-white/5 border border-white/10 rounded-xl p-8 flex flex-col'
						>
							<div className='flex-1'>
								<h2 className='text-white font-semibold text-lg mb-2'>
									{plan.name}
								</h2>
								<p className='text-white text-4xl font-bold mb-6'>
									{plan.price}{" "}
									<span className='text-zinc-400 text-lg font-normal'>
										/ month
									</span>
								</p>

								<div className='space-y-3 mb-8'>
									{plan.features.map((feature) => (
										<div key={feature} className='flex items-center gap-2'>
											<Check className='w-4 h-4 text-green-400 shrink-0' />
											<p className='text-zinc-400 text-sm'>{feature}</p>
										</div>
									))}
								</div>
							</div>

							<button
								disabled={loadingPlan === plan.name}
								onClick={() =>
									plan.priceId
										? handleSubscription(plan.priceId, plan.name)
										: router.push("/signup")
								}
								className={`w-full h-9 rounded-md text-sm font-medium transition-colors ${
									plan.priceId
										? "bg-white text-black hover:bg-zinc-200 disabled:opacity-50"
										: "border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
								}`}
							>
								{loadingPlan === plan.name
									? "Redirecting..."
									: plan.priceId
										? "Subscribe Now"
										: "Get Started"}
							</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
