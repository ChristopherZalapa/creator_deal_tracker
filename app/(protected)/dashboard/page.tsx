import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	const { data: profile } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", user!.id)
		.single();

	return (
		<div className='p-8'>
			<h1 className='text-white text-2xl font-semibold mb-8'>
				Welcome Back, {profile?.full_name}
			</h1>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
				<div className='border bg-white/5 border-white/10 rounded-xl p-6'>
					<p className='text-zinc-400 text-sm mb-2'>Total Creators</p>
					<h2 className='text-white text-2xl font-bold'>24</h2>
				</div>

				<div className='border bg-white/5 border-white/10 rounded-xl p-6'>
					<p className='text-zinc-400 text-sm mb-2'>Active Deals</p>
					<h2 className='text-white text-2xl font-bold'>24</h2>
				</div>

				<div className='border bg-white/5 border-white/10 rounded-xl p-6'>
					<p className='text-zinc-400 text-sm mb-2'>Total Revenue</p>
					<h2 className='text-white text-2xl font-bold'>24</h2>
				</div>

				<div className='border bg-white/5 border-white/10 rounded-xl p-6'>
					<p className='text-zinc-400 text-sm mb-2'>Conversion Rate</p>
					<h2 className='text-white text-2xl font-bold'>24</h2>
				</div>
			</div>
		</div>
	);
}
