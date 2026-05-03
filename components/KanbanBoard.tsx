"use client";
import {
	DndContext,
	DragEndEvent,
	PointerSensor,
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
	// Local copy of deals — this is what drives the UI
	const [deals, setDeals] = useState<Deal[]>(initialDeals);

	useEffect(() => {
		const timeout = setTimeout(() => setMounted(true), 0);
		return () => clearTimeout(timeout);
	}, []);

	// Activation constraint — drag only starts after moving 8px
	// This eliminates the twitchy feel and accidental drags on mobile
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 8 },
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
		const newStatus = String(over.id);

		// 1. Update UI immediately — no waiting for the server
		setDeals((prev) =>
			prev.map((deal) =>
				deal.id === dealId ? { ...deal, status: newStatus } : deal,
			),
		);

		// 2. Persist to database in the background
		updateDealStatus(dealId, newStatus);
	}

	if (!mounted) return null;

	return (
		<DndContext id='kanban-board' sensors={sensors} onDragEnd={handleDragEnd}>
			<div className='-mx-4 md:mx-0'>
				<div className='flex gap-4 overflow-x-auto px-4 md:px-0 pb-6 scroll-smooth'>
					{columns.map((column) => (
						<KanbanColumn
							key={column.id}
							status={column.id}
							label={column.label}
							deals={deals.filter((deal) => deal.status === column.id)}
						/>
					))}
				</div>
			</div>
		</DndContext>
	);
}
