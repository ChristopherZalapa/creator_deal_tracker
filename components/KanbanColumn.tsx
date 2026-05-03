"use client";
import { useDroppable } from "@dnd-kit/core";
import type { Deal } from "@/types";
import KanbanCard from "./KanbanCard";

export default function KanbanColumn({
	status,
	label,
	deals,
	collapsible = false,
}: {
	status: string;
	label: string;
	deals: Deal[];
	collapsible?: boolean;
}) {
	const { setNodeRef, isOver } = useDroppable({
		id: `column-${status}`,
	});

	if (collapsible) {
		return (
			<div className='border rounded-xl overflow-hidden'>
				<div className='flex items-center justify-between px-4 py-3 border-b border-white/10'>
					<span className='text-white text-sm font-medium'>{label}</span>
					<span className='text-xs text-zinc-500 bg-white/5 border border-white/10 rounded-full px-2 py-0.5'>
						{deals.length}
					</span>
				</div>

				<div
					ref={setNodeRef}
					className={`flex flex-col gap-2 px-3 py-4 min-h-[120px] transition-colors ${
						isOver
							? "bg-white/10 border border-white/25"
							: "bg-white/5 border border-transparent"
					}`}
				>
					{deals.length > 0 ? (
						deals.map((deal) => <KanbanCard key={deal.id} deal={deal} />)
					) : (
						<p className='text-zinc-600 text-xs text-center py-2'>Drop here</p>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className='flex-1 min-w-0 flex flex-col gap-3'>
			<div className='flex items-center justify-between'>
				<h2 className='text-sm font-medium text-zinc-200'>{label}</h2>
				<span className='text-xs text-zinc-500 bg-white/5 border border-white/10 rounded-full px-2 py-0.5'>
					{deals.length}
				</span>
			</div>

			<div
				ref={setNodeRef}
				className={`flex flex-col gap-2 rounded-xl p-3 min-h-[200px] border transition-colors ${
					isOver
						? "bg-white/10 border-white/25"
						: "bg-white/[0.03] border-white/10"
				}`}
			>
				{deals.length > 0 ? (
					deals.map((deal) => <KanbanCard key={deal.id} deal={deal} />)
				) : (
					<p className='text-zinc-600 text-xs text-center pt-6'>Drop here</p>
				)}
			</div>
		</div>
	);
}
