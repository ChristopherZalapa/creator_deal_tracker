import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import DealsTable from "@/components/DealsTable";

export default async function Deals({
	searchParams,
}: {
	searchParams: Promise<{ status?: string }>;
}) {
	const { status } = await searchParams;

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	let query = supabase.from("deals").select("*, creators(name)") as any;

	if (status) {
		query = query.eq("status", status);
	}

	const { data: deals } = await query;

	return (
		<div className='p-8'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-white text-2xl font-semibold'> Deals</h1>
				<Link
					href='/deals/new'
					className='bg-white text-black text-sm font-medium px-4 py-2 rounded-md hover:bg-zinc-200'
				>
					Add Deal
				</Link>
			</div>

			<div className='flex gap-2 mb-6'>
				<Link
					href='/deals'
					className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
						!status
							? "bg-white text-black"
							: "text-zinc-400 hover:text-white hover:bg-white/10"
					}`}
				>
					All
				</Link>
				<Link
					href='/deals?status=contacted'
					className={`px-3 py-1.5 rounded-md text-sm transition-colors
						${
							status === "contacted"
								? "bg-white text-black"
								: "text-zinc-400 hover:text-white hover:bg-white/10"
						}`}
				>
					Contacted
				</Link>
				<Link
					href='/deals?status=negotiating'
					className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
						status === "negotiating"
							? "bg-white text-black"
							: "text-zinc-400 hover:text-white hover:bg-white/10"
					}`}
				>
					Negotiating
				</Link>
				<Link
					href='/deals?status=signed'
					className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
						status === "signed"
							? "bg-white text-black"
							: "text-zinc-400 hover:text-white hover:bg-white/10"
					}`}
				>
					Signed
				</Link>
				<Link
					href='/deals?status=completed'
					className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
						status === "completed"
							? "bg-white text-black"
							: "text-zinc-400 hover:text-white hover:bg-white/10"
					}`}
				>
					Completed
				</Link>
				<Link
					href='/deals?status=cancelled'
					className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
						status === "cancelled"
							? "bg-white text-black"
							: "text-zinc-400 hover:text-white hover:bg-white/10"
					}`}
				>
					Cancelled
				</Link>
			</div>
			<DealsTable deals={deals ?? []} />
		</div>
	);
}
