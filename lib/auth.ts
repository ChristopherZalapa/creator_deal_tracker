import { createClient } from "@/lib/supabase/server";

export async function getRole(): Promise<"admin" | "member"> {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	console.log("getRole user id:", user?.id);

	if (!user) return "member";

	const { data: profile, error } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", user.id)
		.single();

	console.log("getRole profile:", profile);
	console.log("getRole error:", error);

	return (profile?.role as "admin" | "member") ?? "member";
}
