import KanbanBoard from "@/components/KanbanBoard";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function KanbanPage() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	const { data: deals } = await supabase
		.from("deals")
		.select("*, creators(name)");

	return (
		<div className='p-8'>
			<h1 className='text-white text-2xl font-semibold mb-8'>Kanban Board</h1>
			<KanbanBoard deals={deals ?? []} />
		</div>
	);
}
