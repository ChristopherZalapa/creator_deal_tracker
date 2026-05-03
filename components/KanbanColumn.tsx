"use client";
import { useDroppable } from "@dnd-kit/core";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
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
	const [expanded, setExpanded] = useState(false);
	const { setNodeRef, isOver } = useDroppable({ id: status });

	if (collapsible) {
		return (
			<div className='bg-white/5 border border-white/10 rounded-xl overflow-hidden'>
				<button
					onClick={() => setExpanded((prev) => !prev)}
					className='w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors'
				>
					<div className='flex items-center gap-3'>
						<span className='text-white text-sm font-medium'>{label}</span>
						<span className='text-xs text-zinc-500 bg-white/5 border border-white/10 rounded-full px-2 py-0.5'>
							{deals.length}
						</span>
					</div>
					<ChevronDown
						className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
							expanded ? "rotate-180" : ""
						}`}
					/>
				</button>

				{expanded && (
					<div
						ref={setNodeRef}
						className={`flex flex-col gap-2 px-3 pb-3 transition-colors ${
							isOver ? "bg-white/10" : ""
						}`}
					>
						{deals.length > 0 ? (
							deals.map((deal) => <KanbanCard key={deal.id} deal={deal} />)
						) : (
							<p className='text-zinc-600 text-xs text-center py-4'>No deals</p>
						)}
					</div>
				)}
			</div>
		);
	}

	return (
		<div className='shrink-0 w-70 flex flex-col gap-3'>
			<div className='flex items-center justify-between'>
				<h2 className='text-sm font-medium text-zinc-200'>{label}</h2>
				<span className='text-xs text-zinc-500 bg-white/5 border border-white/10 rounded-full px-2 py-0.5'>
					{deals.length}
				</span>
			</div>
			<div
				ref={setNodeRef}
				className={`flex flex-col gap-2 rounded-xl p-3 min-h-50 border transition-colors duration-150 ${
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
