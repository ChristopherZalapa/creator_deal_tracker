import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
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
		<div className='min-h-screen bg-[#000000] flex'>
			<aside className='w-64 border-r border-white/20'>
				<h1 className='text-white'>Creator Deal Tracker</h1>

				<Link href='/dashboard' className='text-white'>
					Dashboard
				</Link>
				<Link href='/Creators' className='text-white'>
					Creators
				</Link>
				<Link href='/deals' className='text-white'>
					Deals
				</Link>
				<Link href='/kanban' className='text-white'>
					Kanban
				</Link>
				<Link href='/analytics' className='text-white'>
					Analytics
				</Link>

				<h2 className='text-white'>{profile?.full_name} </h2>
				<SignOutButton />
			</aside>
			<main className='flex-1'>{children}</main>
		</div>
	);
}
