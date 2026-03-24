"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";
import { useState } from "react";

export default function SignOutButton() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const supabase = createClient();
	const router = useRouter();

	const handleSignOut = async (event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		setLoading(true);
		setError("");

		const { error } = await supabase.auth.signOut();

		if (error) {
			setError(error.message);
			setLoading(false);
			return;
		}

		router.push("/login");
	};

	return (
		<button
			onClick={handleSignOut}
			type='button'
			disabled={loading}
			className=' h-9 rounded-md bg-white px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-zinc-200 focus:outline-none focus:ring-1 focus:ring-white/50 flex items-center justify-center gap-2 cursor-pointer'
		>
			{loading ? (
				<>
					<svg
						className='w-4 h-4 animate-spin'
						fill='none'
						stroke='currentColor'
						strokeWidth={2}
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M21 12a9 9 0 1 1-6.219-8.56'
						/>
					</svg>
					Signing Out
				</>
			) : (
				"Sign Out"
			)}
		</button>
	);
}
