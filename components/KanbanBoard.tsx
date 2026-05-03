"use client";
import {
	DndContext,
	DragEndEvent,
	PointerSensor,
	TouchSensor,
	useSensor,
	useSensors,
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
	const [isDragging, setIsDragging] = useState(false);
	const [deals, setDeals] = useState<Deal[]>(initialDeals);

	useEffect(() => {
		const timeout = setTimeout(() => setMounted(true), 0);
		return () => clearTimeout(timeout);
	}, []);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
		useSensor(TouchSensor, {
			activationConstraint: { delay: 250, tolerance: 5 },
		}),
	);

	const columns = [
		{ id: "contacted", label: "Contacted" },
		{ id: "negotiating", label: "Negotiating" },
		{ id: "signed", label: "Signed" },
		{ id: "completed", label: "Completed" },
		{ id: "cancelled", label: "Cancelled" },
	];

	function handleDragStart() {
		setIsDragging(true);
	}

	function handleDragEnd(event: DragEndEvent) {
		setIsDragging(false);
		const { active, over } = event;
		if (!over) return;
		const dealId = String(active.id);
		const newStatus = String(over.id);
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
			id='kanban-board'
			sensors={sensors}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			{/* Mobile */}
			<div
				className='md:hidden flex flex-col gap-2'
				style={{ touchAction: isDragging ? "none" : "auto" }}
			>
				{columns.map((column) => (
					<KanbanColumn
						key={column.id}
						status={column.id}
						label={column.label}
						deals={deals.filter((deal) => deal.status === column.id)}
						collapsible
					/>
				))}
			</div>

			{/* Desktop */}
			<div className='hidden md:flex gap-3 pb-6 overflow-x-hidden w-full'>
				{columns.map((column) => (
					<KanbanColumn
						key={column.id}
						status={column.id}
						label={column.label}
						deals={deals.filter((deal) => deal.status === column.id)}
					/>
				))}
			</div>
		</DndContext>
	);
}
