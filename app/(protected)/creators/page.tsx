import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import CreatorTable from "@/components/CreatorsTable";

export default async function Creators() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}
	const { data: creators } = await supabase.from("creators").select("*");

	return (
		<div className='p-8'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-white text-2xl font-semibold'>Creators</h1>
				<Link
					href={"/creators/new"}
					className='bg-white text-black text-sm font-medium px-4 py-2 rounded-md hover:bg-zinc-200 transition-colors'
				>
					Add Creator
				</Link>
			</div>
			<CreatorTable creators={creators ?? []} />
		</div>
	);
}
