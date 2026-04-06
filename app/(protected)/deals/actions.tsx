"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteDeal(id: string) {
	const supabase = await createClient();

	await supabase.from("deals").delete().eq("id", id);

	revalidatePath("/deals");
}

export async function updateDeal(
	id: string,
	data: {
		brand_name: string;
		deal_value: number;
		status: string;
		expected_views: number;
		actual_views: number;
		cost: number;
	},
) {
	const supabase = await createClient();

	await supabase.from("deals").update(data).eq("id", id);

	revalidatePath("/deals");
}
