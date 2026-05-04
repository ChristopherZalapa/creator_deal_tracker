"use client";

import { useState } from "react";
import { Copy, RefreshCw, X, Check } from "lucide-react";
import type { Deal } from "@/types";

export default function EmailModal({
	deal,
	creatorNiche,
	creatorPlatform,
	onClose,
}: {
	deal: Deal;
	creatorNiche: string;
	creatorPlatform: string;
	onClose: () => void;
}) {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [copied, setCopied] = useState(false);

	const generateEmail = async () => {
		setLoading(true);
		try {
			const response = await fetch("/api/ai/email", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					brandName: deal.brand_name,
					creatorName: deal.creators?.name,
					dealValue: deal.deal_value,
					status: deal.status,
					niche: creatorNiche,
					platform: creatorPlatform,
				}),
			});
			const data = await response.json();
			setEmail(data.email);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleCopy = async () => {
		await navigator.clipboard.writeText(email);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4'>
			<div className='bg-[#0d0d0d] border border-white/10 rounded-xl p-5 md:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
				<div className='flex justify-between items-center mb-4'>
					<div>
						<h2 className='text-white font-semibold'>AI Email Template</h2>
						<p className='text-zinc-500 text-xs mt-0.5'>
							{deal.brand_name} → {deal.creators?.name}
						</p>
					</div>
					<button
						onClick={onClose}
						className='w-8 h-8 rounded-md flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors'
					>
						<X className='w-4 h-4' />
					</button>
				</div>

				{!email && !loading && (
					<div className='flex flex-col items-center gap-3 py-12'>
						<p className='text-zinc-400 text-sm text-center'>
							Generate a personalized outreach email for this deal
						</p>
						<button
							onClick={generateEmail}
							className='bg-white text-black text-sm font-medium px-6 py-2 rounded-md hover:bg-zinc-200 transition-colors'
						>
							Generate Email
						</button>
					</div>
				)}

				{loading && (
					<div className='flex flex-col items-center gap-3 py-12'>
						<div className='w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin' />
						<p className='text-zinc-400 text-sm'>Generating email...</p>
					</div>
				)}

				{email && !loading && (
					<>
						<div className='bg-white/5 border border-white/10 rounded-xl p-4 mb-4'>
							<pre className='text-zinc-300 text-sm whitespace-pre-wrap font-sans leading-relaxed'>
								{email}
							</pre>
						</div>
						<div className='flex items-center gap-2'>
							<button
								onClick={handleCopy}
								className='flex items-center gap-2 h-9 rounded-md bg-white px-4 text-sm font-medium text-black hover:bg-zinc-200 transition-colors'
							>
								{copied ? (
									<Check className='w-3.5 h-3.5' />
								) : (
									<Copy className='w-3.5 h-3.5' />
								)}
								{copied ? "Copied" : "Copy"}
							</button>
							<button
								onClick={generateEmail}
								className='flex items-center gap-2 h-9 rounded-md border border-white/10 px-4 text-sm text-zinc-400 hover:text-white transition-colors'
							>
								<RefreshCw className='w-3.5 h-3.5' />
								Regenerate
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
