import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import DealsTable from "@/components/DealsTable";
import ExportButton from "@/components/ExportButton";

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

	const { data: profile } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", user!.id)
		.single();

	const query = supabase.from("deals").select("*, creators(name)");
	const { data: deals } = await (status ? query.eq("status", status) : query);

	const filters = [
		{ label: "All", href: "/deals", active: !status },
		{
			label: "Contacted",
			href: "/deals?status=contacted",
			active: status === "contacted",
		},
		{
			label: "Negotiating",
			href: "/deals?status=negotiating",
			active: status === "negotiating",
		},
		{
			label: "Signed",
			href: "/deals?status=signed",
			active: status === "signed",
		},
		{
			label: "Completed",
			href: "/deals?status=completed",
			active: status === "completed",
		},
		{
			label: "Cancelled",
			href: "/deals?status=cancelled",
			active: status === "cancelled",
		},
	];

	return (
		<div className='p-4 md:p-8'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-white text-xl md:text-2xl font-semibold'>Deals</h1>
				<div className='flex items-center gap-2 md:gap-3'>
					<ExportButton deals={deals ?? []} profile={profile?.full_name} />
					<Link
						href='/deals/new'
						className='bg-white text-black text-sm font-medium px-3 md:px-4 py-2 rounded-md hover:bg-zinc-200 transition-colors'
					>
						Add Deal
					</Link>
				</div>
			</div>

			<div className='overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-6'>
				<div className='flex gap-2 w-max md:w-auto'>
					{filters.map((filter) => (
						<Link
							key={filter.href}
							href={filter.href}
							className={`px-3 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap ${
								filter.active
									? "bg-white text-black"
									: "text-zinc-400 hover:text-white hover:bg-white/10"
							}`}
						>
							{filter.label}
						</Link>
					))}
				</div>
			</div>

			<DealsTable deals={deals ?? []} />
		</div>
	);
}
