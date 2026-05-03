import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Users, Handshake, DollarSign, TrendingUp } from "lucide-react";

export default async function Dashboard() {
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

	const { count: creatorCount } = await supabase
		.from("creators")
		.select("*", { count: "exact", head: true });

	const { count: activeDealsCount } = await supabase
		.from("deals")
		.select("*", { count: "exact", head: true })
		.neq("status", "cancelled");

	const { data: deals } = await supabase
		.from("deals")
		.select("deal_value, status");

	const totalRevenue =
		deals?.reduce((acc, deal) => acc + deal.deal_value, 0) ?? 0;

	const completedDeals =
		deals?.filter((deal) => deal.status === "completed").length ?? 0;

	const totalDeals = deals?.length ?? 0;

	const conversionRate =
		totalDeals > 0 ? Math.round((completedDeals / totalDeals) * 100) : 0;

	const stats = [
		{
			label: "Total Creators",
			value: creatorCount ?? 0,
			description: "Creators in your network",
			icon: Users,
		},
		{
			label: "Active Deals",
			value: activeDealsCount ?? 0,
			description: "Deals currently in progress",
			icon: Handshake,
		},
		{
			label: "Total Revenue",
			value: `$${totalRevenue}`,
			description: "Revenue from completed deals",
			icon: DollarSign,
		},
		{
			label: "Conversion Rate",
			value: `${conversionRate}%`,
			description: "Deals successfully completed",
			icon: TrendingUp,
		},
	];

	return (
		<div className='p-4 md:p-8'>
			<h1 className='text-white text-xl md:text-2xl font-semibold mb-6 md:mb-8'>
				Welcome Back, {profile?.full_name}
			</h1>

			<div className='grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6'>
				{stats.map((stat) => (
					<div
						key={stat.label}
						className='border bg-white/5 border-white/10 rounded-xl p-5 md:p-10 min-h-40 md:min-h-70 flex flex-col justify-between'
					>
						<div className='flex items-center justify-between mb-3 md:mb-4'>
							<p className='text-zinc-400 text-sm'>{stat.label}</p>
							<div className='w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center'>
								<stat.icon className='w-4 h-4 md:w-5 md:h-5 text-zinc-400' />
							</div>
						</div>
						<h2 className='text-white text-3xl md:text-4xl font-bold mb-2'>
							{stat.value}
						</h2>
						<p className='text-zinc-500 text-sm'>{stat.description}</p>
					</div>
				))}
			</div>
		</div>
	);
}
