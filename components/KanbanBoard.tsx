"use client";
import {
	DndContext,
	DragEndEvent,
	PointerSensor,
	TouchSensor,
	useSensor,
	useSensors,
	rectIntersection,
	DragOverlay,
} from "@dnd-kit/core";
import { useState, useEffect } from "react";
import type { Deal } from "@/types";
import KanbanColumn from "./KanbanColumn";
import { updateDealStatus } from "@/app/(protected)/deals/actions";

export default function KanbanBoard({
	deals: initialDeals,
}: {
	deals: Deal[];
}) {
	const [mounted, setMounted] = useState(false);
	const [deals, setDeals] = useState<Deal[]>(initialDeals);
	const [activeId, setActiveId] = useState<string | null>(null);

	useEffect(() => {
		const timeout = setTimeout(() => setMounted(true), 0);
		return () => clearTimeout(timeout);
	}, []);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 250,
				tolerance: 8,
			},
		}),
	);

	const columns = [
		{ id: "contacted", label: "Contacted" },
		{ id: "negotiating", label: "Negotiating" },
		{ id: "signed", label: "Signed" },
		{ id: "completed", label: "Completed" },
		{ id: "cancelled", label: "Cancelled" },
	];

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!over) return;

		const dealId = String(active.id);
		const overId = String(over.id);

		let newStatus: string | null = null;

		if (overId.startsWith("mobile-column-")) {
			newStatus = overId.replace("mobile-column-", "");
		} else if (overId.startsWith("column-")) {
			newStatus = overId.replace("column-", "");
		}

		const overDeal = deals.find((d) => d.id === overId);
		if (overDeal) {
			newStatus = overDeal.status;
		}

		if (!newStatus) return;

		setDeals((prev) =>
			prev.map((deal) =>
				deal.id === dealId ? { ...deal, status: newStatus } : deal,
			),
		);

		updateDealStatus(dealId, newStatus);
	}

	const activeDeal = deals.find((d) => d.id === activeId);

	if (!mounted) return null;

	return (
		<DndContext
			id='kanban-board'
			sensors={sensors}
			collisionDetection={rectIntersection}
			onDragStart={(event) => setActiveId(String(event.active.id))}
			onDragEnd={(event) => {
				handleDragEnd(event);
				setActiveId(null);
			}}
			onDragCancel={() => setActiveId(null)}
		>
			<div className='md:hidden flex flex-col gap-2'>
				{columns.map((column) => (
					<KanbanColumn
						key={`mobile-${column.id}`}
						status={column.id}
						label={column.label}
						deals={deals.filter((d) => d.status === column.id)}
						collapsible
						isMobile
					/>
				))}
			</div>

			<div className='hidden md:flex gap-3 pb-6 w-full'>
				{columns.map((column) => (
					<KanbanColumn
						key={`desktop-${column.id}`}
						status={column.id}
						label={column.label}
						deals={deals.filter((d) => d.status === column.id)}
					/>
				))}
			</div>

			<DragOverlay dropAnimation={null}>
				{activeDeal ? (
					<div className='rounded-xl border p-4 bg-white/10 border-white/20 shadow-xl w-[calc(100vw-64px)] md:w-[280px]'>
						<p className='text-white text-sm font-medium mb-1'>
							{activeDeal.brand_name}
						</p>
						<p className='text-zinc-400 text-xs mb-3'>
							{activeDeal.creators?.name}
						</p>
						<p className='text-zinc-300 text-sm font-semibold'>
							${activeDeal.deal_value.toLocaleString()}
						</p>
					</div>
				) : null}
			</DragOverlay>
		</DndContext>
	);
}
