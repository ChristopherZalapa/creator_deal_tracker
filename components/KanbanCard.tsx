"use client";
import { useDraggable } from "@dnd-kit/core";
import type { Deal } from "@/types";

export default function KanbanCard({ deal }: { deal: Deal }) {
	const { attributes, listeners, setNodeRef, transform, isDragging } =
		useDraggable({ id: deal.id });

	return (
		<div
			ref={setNodeRef}
			style={{
				...(transform
					? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
					: {}),
				touchAction: "none",
			}}
			{...listeners}
			{...attributes}
			className={`
        rounded-xl border p-4 select-none
        cursor-grab active:cursor-grabbing
        transition-all duration-150
        ${
					isDragging
						? "opacity-50 shadow-xl border-white/20 bg-white/10"
						: "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
				}
      `}
		>
			<p className='text-white text-sm font-medium mb-1'>{deal.brand_name}</p>
			<p className='text-zinc-400 text-xs mb-3'>{deal.creators?.name}</p>
			<p className='text-zinc-300 text-sm font-semibold'>
				${deal.deal_value.toLocaleString()}
			</p>
		</div>
	);
}
