"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

const planFeatures: Record<string, string[]> = {
	Pro: [
		"Unlimited Creators",
		"Unlimited Deals",
		"Analytics Dashboard",
		"CSV Export",
		"AI Email Templates",
	],
	Agency: [
		"Everything in Pro",
		"Team Members",
		"Priority Support",
		"Custom Branding",
	],
};

const colors = [
	"bg-green-400",
	"bg-blue-400",
	"bg-purple-400",
	"bg-yellow-400",
	"bg-pink-400",
	"bg-white",
];

function Confetti() {
	const pieces = useMemo(
		() =>
			Array.from({ length: 80 }).map((_, i) => ({
				id: i,
				color: colors[i % colors.length],
				left: `${Math.random() * 100}%`,
				delay: `${Math.random() * 2}s`,
				duration: `${2 + Math.random() * 2}s`,
				size: Math.random() > 0.5 ? "w-2 h-2" : "w-1.5 h-3",
			})),
		[],
	);

	return (
		<div className='fixed inset-0 pointer-events-none z-50'>
			{pieces.map((piece) => (
				<div
					key={piece.id}
					className={`absolute ${piece.color} ${piece.size} rounded-sm opacity-0`}
					style={{
						left: piece.left,
						top: "-10px",
						animation: `confettiFall ${piece.duration} ${piece.delay} ease-in forwards`,
					}}
				/>
			))}
			<style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
		</div>
	);
}

function SuccessContent() {
	const searchParams = useSearchParams();
	const plan = searchParams.get("plan");
	const [showConfetti, setShowConfetti] = useState(false);

	const planName =
		plan === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID
			? "Pro"
			: plan === process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID
				? "Agency"
				: "Pro";

	useEffect(() => {
		setShowConfetti(true);
		const timer = setTimeout(() => setShowConfetti(false), 4000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div className='min-h-screen bg-[#000000] flex items-center justify-center p-4 relative overflow-hidden'>
			{showConfetti && <Confetti />}

			<div className='w-full max-w-md text-center'>
				<div className='w-16 h-16 rounded-full bg-green-400/10 border border-green-400/20 flex items-center justify-center mx-auto mb-6'>
					<CheckCircle className='w-8 h-8 text-green-400' />
				</div>

				<h1 className='text-white text-2xl md:text-3xl font-bold mb-2'>
					You're subscribed!
				</h1>
				<p className='text-zinc-400 text-sm mb-8'>
					Welcome to the{" "}
					<span className='text-white font-medium'>{planName}</span> plan.
					Here's what you now have access to:
				</p>

				<div className='bg-white/5 border border-white/10 rounded-xl p-6 mb-8 text-left'>
					<p className='text-zinc-400 text-xs font-medium uppercase tracking-wider mb-4'>
						{planName} Plan Includes
					</p>
					<div className='space-y-3'>
						{planFeatures[planName]?.map((feature) => (
							<div key={feature} className='flex items-center gap-3'>
								<CheckCircle className='w-4 h-4 text-green-400 shrink-0' />
								<p className='text-zinc-300 text-sm'>{feature}</p>
							</div>
						))}
					</div>
				</div>

				<Link
					href='/dashboard'
					className='w-full h-10 rounded-md bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors flex items-center justify-center'
				>
					Go to Dashboard
				</Link>
			</div>
		</div>
	);
}

export default function SuccessPage() {
	return (
		<Suspense
			fallback={
				<div className='min-h-screen bg-[#000000] flex items-center justify-center'>
					<div className='w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin' />
				</div>
			}
		>
			<SuccessContent />
		</Suspense>
	);
}
