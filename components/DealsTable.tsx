"use client";

import { deleteDeal, updateDeal } from "@/app/(protected)/deals/actions";
import { useState } from "react";
import Link from "next/link";

type Deal = {
	id: string;
	brand_name: string;
	deal_value: number;
	status: string;
	expected_views: number;
	actual_views: number;
	cost: number;
	creator_id: string;
	creators: {
		name: string;
	} | null;
};

export default function DealsTable({ deals }: { deals: Deal[] }) {
	const [openModal, setOpenModal] = useState(false);
	const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
}
