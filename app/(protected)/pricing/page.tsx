"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export default function PricingPage() {
	const [loading, setLoading] = useState(false);

	const priceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;
	const handleSubscription = async (priceId: string) => {
		setLoading(true);

		try {
			const response = await fetch("/api/stripe/checkout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ priceId }),
			});

			const data = await response.json();
			if (data.url) {
				window.location.href = data.url;
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='p-8 flex items-center justify-center min-h-screen'>
			<div className='bg-white/5 border border-white/10 rounded-xl p-8 max-w-md w-full'>
				<h1 className='text-white text-2xl font-semibold mb-2'>Pro Plan</h1>
				<p className='text-white text-4xl font-bold mb-8'>
					$29 <span className='text-zinc-400 text-lg font-normal'>/ month</span>
				</p>

				<div className='space-y-3 mb-8'>
					{[
						"Unlimited Creators",
						"Unlimited Deals",
						"Analytics Dashboard",
						"CSV Export",
						"AI Email Templates",
					].map((feature) => (
						<div key={feature} className='flex items-center gap-2'>
							<Check className='w-4 h-4 text-green-400' />
							<p className='text-zinc-400 text-sm'>{feature}</p>
						</div>
					))}
				</div>

				<button
					onClick={() => handleSubscription(priceId!)}
					disabled={loading}
					className='w-full h-9 rounded-md bg-white px-6 text-sm font-medium text-black hover:bg-zinc-200 transition-colors disabled:opacity-50'
				>
					{loading ? "Redirecting..." : "Subscribe Now"}
				</button>
			</div>
		</div>
	);
}
