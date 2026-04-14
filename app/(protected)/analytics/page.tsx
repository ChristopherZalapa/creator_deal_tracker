import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AnalyticsChart from "@/components/AnalyticsChart";

export default async function Analytics() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	const { data: deals } = await supabase
		.from("deals")
		.select("*, creators(name)");

	const dealByStatus = [
		{
			status: "contacted",
			count: deals?.filter((deal) => deal.status === "contacted").length ?? 0,
		},
		{
			status: "negotiating",
			count: deals?.filter((deal) => deal.status === "negotiating").length ?? 0,
		},
		{
			status: "signed",
			count: deals?.filter((deal) => deal.status === "signed").length ?? 0,
		},
		{
			status: "completed",
			count: deals?.filter((deal) => deal.status === "completed").length ?? 0,
		},
		{
			status: "cancelled",
			count: deals?.filter((deal) => deal.status === "cancelled").length ?? 0,
		},
	];

	const revenueOverTime = deals?.map((deal) => ({
		date: new Date(deal.created_at).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		}),
		revenue: deal.deal_value,
	}));

	const roiPerDeal =
		deals?.map((deal) => ({
			name: deal.brand_name,
			roi:
				deal.cost > 0
					? Math.round(((deal.deal_value - deal.cost) / deal.cost) * 100)
					: 0,
		})) ?? [];

	const creatorTotals: Record<string, number> = {};

	deals?.forEach((deal) => {
		const name = deal.creators?.name ?? "Unknown";
		creatorTotals[name] = (creatorTotals[name] ?? 0) + deal.deal_value;
	});

	const topCreators = Object.entries(creatorTotals).map(([name, total]) => ({
		name,
		total,
	}));

	return (
		<AnalyticsChart
			dealsByStatus={dealByStatus}
			revenueOverTime={revenueOverTime ?? []}
			roiPerDeal={roiPerDeal}
			topCreators={topCreators}
		/>
	);
}
