"use client";

import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import type { AnalyticsChartProps } from "@/types";

const chartStyle = {
	contentStyle: {
		backgroundColor: "#0d0d0d",
		border: "1px solid rgba(255,255,255,0.1)",
		borderRadius: "8px",
		color: "#ffffff",
	},
};

export default function AnalyticsChart({
	dealsByStatus,
	revenueOverTime,
	roiPerDeal,
	topCreators,
}: AnalyticsChartProps) {
	return (
		<div className='p-4 md:p-8'>
			<h1 className='text-white text-xl md:text-2xl font-semibold mb-6 md:mb-8'>
				Analytics
			</h1>
			<div className='grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6'>
				<div className='bg-white/5 border border-white/10 rounded-xl p-4 md:p-8'>
					<p className='text-white font-semibold text-base md:text-lg mb-4 md:mb-6'>
						Deals By Status
					</p>
					<ResponsiveContainer width='100%' height={250}>
						<BarChart data={dealsByStatus}>
							<CartesianGrid
								strokeDasharray='3 3'
								stroke='rgba(255,255,255,0.05)'
							/>
							<XAxis
								dataKey='status'
								tick={{ fill: "#71717a", fontSize: 11 }}
								axisLine={{ stroke: "#27272a" }}
								tickLine={false}
							/>
							<YAxis
								tick={{ fill: "#71717a", fontSize: 11 }}
								axisLine={{ stroke: "#27272a" }}
								tickLine={false}
							/>
							<Tooltip contentStyle={chartStyle.contentStyle} />
							<Bar dataKey='count' fill='#71717a' radius={[4, 4, 0, 0]} />
						</BarChart>
					</ResponsiveContainer>
				</div>

				<div className='bg-white/5 border border-white/10 rounded-xl p-4 md:p-8'>
					<p className='text-white font-semibold text-base md:text-lg mb-4 md:mb-6'>
						Revenue Over Time
					</p>
					<ResponsiveContainer width='100%' height={250}>
						<BarChart data={revenueOverTime}>
							<CartesianGrid
								strokeDasharray='3 3'
								stroke='rgba(255,255,255,0.05)'
							/>
							<XAxis
								dataKey='date'
								tick={{ fill: "#71717a", fontSize: 11 }}
								axisLine={{ stroke: "#27272a" }}
								tickLine={false}
							/>
							<YAxis
								tick={{ fill: "#71717a", fontSize: 11 }}
								axisLine={{ stroke: "#27272a" }}
								tickLine={false}
							/>
							<Tooltip contentStyle={chartStyle.contentStyle} />
							<Bar dataKey='revenue' fill='#71717a' radius={[4, 4, 0, 0]} />
						</BarChart>
					</ResponsiveContainer>
				</div>

				<div className='bg-white/5 border border-white/10 rounded-xl p-4 md:p-8'>
					<p className='text-white font-semibold text-base md:text-lg mb-4 md:mb-6'>
						ROI Per Deal
					</p>
					<ResponsiveContainer width='100%' height={250}>
						<BarChart data={roiPerDeal}>
							<CartesianGrid
								strokeDasharray='3 3'
								stroke='rgba(255,255,255,0.05)'
							/>
							<XAxis
								dataKey='name'
								tick={{ fill: "#71717a", fontSize: 11 }}
								axisLine={{ stroke: "#27272a" }}
								tickLine={false}
							/>
							<YAxis
								tick={{ fill: "#71717a", fontSize: 11 }}
								axisLine={{ stroke: "#27272a" }}
								tickLine={false}
							/>
							<Tooltip contentStyle={chartStyle.contentStyle} />
							<Bar dataKey='roi' fill='#71717a' radius={[4, 4, 0, 0]} />
						</BarChart>
					</ResponsiveContainer>
				</div>

				<div className='bg-white/5 border border-white/10 rounded-xl p-4 md:p-8'>
					<p className='text-white font-semibold text-base md:text-lg mb-4 md:mb-6'>
						Top Creators
					</p>
					<ResponsiveContainer width='100%' height={250}>
						<BarChart data={topCreators}>
							<CartesianGrid
								strokeDasharray='3 3'
								stroke='rgba(255,255,255,0.05)'
							/>
							<XAxis
								dataKey='name'
								tick={{ fill: "#71717a", fontSize: 11 }}
								axisLine={{ stroke: "#27272a" }}
								tickLine={false}
							/>
							<YAxis
								tick={{ fill: "#71717a", fontSize: 11 }}
								axisLine={{ stroke: "#27272a" }}
								tickLine={false}
							/>
							<Tooltip contentStyle={chartStyle.contentStyle} />
							<Bar dataKey='total' fill='#71717a' radius={[4, 4, 0, 0]} />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
}
