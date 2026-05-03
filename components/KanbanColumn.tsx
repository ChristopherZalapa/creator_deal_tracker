"use client";
import { useDroppable } from "@dnd-kit/core";
import type { Deal } from "@/types";
import KanbanCard from "./KanbanCard";

export default function KanbanColumn({
	status,
	label,
	deals,
}: {
	status: string;
	label: string;
	deals: Deal[];
}) {
	const { setNodeRef, isOver } = useDroppable({ id: status });

	return (
		// shrink-0 prevents columns from compressing inside the flex parent
		<div className='shrink-0 w-70 flex flex-col gap-3'>
			{/* Column header */}
			<div className='flex items-center justify-between'>
				<h2 className='text-sm font-medium text-zinc-200'>{label}</h2>
				<span className='text-xs text-zinc-500 bg-white/5 border border-white/10 rounded-full px-2 py-0.5'>
					{deals.length}
				</span>
			</div>

			{/* Drop zone — highlight when a card hovers over it */}
			<div
				ref={setNodeRef}
				className={`flex flex-col gap-2 rounded-xl p-3 min-h-200 border transition-colors duration-150 ${
					isOver ? "bg-white/10 border-white/25" : "bg-white/3 border-white/10"
				}`}
			>
				{deals.length > 0 ? (
					deals.map((deal) => <KanbanCard key={deal.id} deal={deal} />)
				) : (
					<p className='text-zinc-600 text-xs text-center pt-6'>No deals</p>
				)}
			</div>
		</div>
	);
}
