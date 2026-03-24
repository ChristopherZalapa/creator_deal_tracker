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
			<aside className='w-64 border-r border-white/20 flex flex-col p-4 bg-white/5'>
				<h1 className='text-white font-sans font-medium mb-3'>
					Creator Deal Tracker
				</h1>
				<nav className='space-y-2 mt-6'>
					<Link
						href='/dashboard'
						className='hover:text-white hover:bg-white/10 block rounded-md px-3 py-2 text-zinc-400 transition-colors'
					>
						Dashboard
					</Link>
					<Link
						href='/creators'
						className='hover:text-white hover:bg-white/10 block rounded-md px-3 py-2 text-zinc-400 transition-colors'
					>
						Creators
					</Link>
					<Link
						href='/deals'
						className='hover:text-white hover:bg-white/10 block rounded-md px-3 py-2 text-zinc-400 transition-colors'
					>
						Deals
					</Link>
					<Link
						href='/kanban'
						className='hover:text-white hover:bg-white/10 block rounded-md px-3 py-2 text-zinc-400 transition-colors'
					>
						Kanban
					</Link>
					<Link
						href='/analytics'
						className='hover:text-white hover:bg-white/10 block rounded-md px-3 py-2 text-zinc-400 transition-colors'
					>
						Analytics
					</Link>
				</nav>

				<div className='flex flex-col mt-auto border-t border-white/10 pt-4'>
					<div className='flex items-center gap-3 mb-3'>
						<div className='w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-sm font-medium'>
							{profile?.full_name
								?.split(" ")
								.map((n: string) => n.charAt(0).toUpperCase())
								.join("")}
						</div>
						<p className='text-zinc-400 text-sm font-medium'>
							{profile?.full_name}
						</p>
					</div>
					<SignOutButton />
				</div>
			</aside>
			<main className='flex-1'>{children}</main>
		</div>
	);
}
