"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteCreator(id: string) {
	const supabase = await createClient();

	await supabase.from("creators").delete().eq("id", id);

	revalidatePath("/creators");
}

export async function updateCreator(
	id: string,
	data: {
		name: string;
		platform: string;
		followers: number;
		email: string;
		niche: string;
	},
) {
	const supabase = await createClient();

	await supabase.from("creators").update(data).eq("id", id);

	revalidatePath("/creators");
}
