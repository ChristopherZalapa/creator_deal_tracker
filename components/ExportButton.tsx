"use client";

import type { Deal } from "@/types";

export default function ExportButton({
	deals,
	profile,
}: {
	deals: Deal[];
	profile?: string;
}) {
	const handleExport = () => {
		const headers =
			"Brand,Creator,Value,Cost,Status,Expected Views,Actual Views";

		const rows = deals.map(
			(deal) =>
				`${deal.brand_name},${deal.creators?.name},${deal.deal_value},${deal.cost},${deal.status},${deal.expected_views},${deal.actual_views}`,
		);

		const csvContent = [headers, ...rows].join("\n");

		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		const fileName = profile?.replace(/\s+/g, "_") ?? "Deals";
		link.download = `${fileName}_Deals.csv`;
		link.click();
		URL.revokeObjectURL(url);
	};

	return (
		<button
			type='button'
			onClick={handleExport}
			className='h-9 rounded-md border border-white/10 bg-white/5 px-4 text-sm text-zinc-400 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2'
		>
			<svg
				className='w-4 h-4'
				fill='none'
				stroke='currentColor'
				strokeWidth={2}
				viewBox='0 0 24 24'
			>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
				/>
			</svg>
			Export CSV
		</button>
	);
}
