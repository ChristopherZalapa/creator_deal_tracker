"use client";
import {
	DndContext,
	DragEndEvent,
	PointerSensor,
	TouchSensor,
	useSensor,
	useSensors,
	pointerWithin,
	DragOverlay,
} from "@dnd-kit/core";
import { useState, useEffect } from "react";
import type { Deal } from "@/types";
import KanbanColumn from "./KanbanColumn";
import KanbanCard from "./KanbanCard";
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

		if (overId.startsWith("column-")) {
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

	if (!mounted) return null;

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={pointerWithin}
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
						key={column.id}
						status={column.id}
						label={column.label}
						deals={deals.filter((d) => d.status === column.id)}
						collapsible
					/>
				))}
			</div>

			<div className='hidden md:flex gap-3 pb-6 w-full'>
				{columns.map((column) => (
					<KanbanColumn
						key={column.id}
						status={column.id}
						label={column.label}
						deals={deals.filter((d) => d.status === column.id)}
					/>
				))}
			</div>

			<DragOverlay>
				{activeId ? (
					<KanbanCard deal={deals.find((d) => d.id === activeId)!} />
				) : null}
			</DragOverlay>
		</DndContext>
	);
}
