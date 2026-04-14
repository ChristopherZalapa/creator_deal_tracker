export type Creator = {
	id: string;
	name: string;
	platform: string;
	followers: number;
	email: string;
	niche: string;
};

export type Deal = {
	id: string;
	brand_name: string;
	deal_value: number;
	status: string;
	expected_views: number;
	actual_views: number;
	cost: number;
	creator_id: string;
	creators: {
		name: string;
	} | null;
};

export type AnalyticsChartProps = {
	dealsByStatus: { status: string; count: number }[];
	revenueOverTime: { date: string; revenue: number }[];
	roiPerDeal: { name: string; roi: number }[];
	topCreators: { name: string; total: number }[];
};
