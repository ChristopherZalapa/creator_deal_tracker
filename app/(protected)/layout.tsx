import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";
import {
	LayoutDashboard,
	Users,
	Handshake,
	Kanban,
	BarChart2,
	CreditCard,
} from "lucide-react";

const navLinks = [
	{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/creators", label: "Creators", icon: Users },
	{ href: "/deals", label: "Deals", icon: Handshake },
	{ href: "/kanban", label: "Kanban", icon: Kanban },
	{ href: "/analytics", label: "Analytics", icon: BarChart2 },
	{ href: "/pricing", label: "Pricing", icon: CreditCard },
];

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

	const initials = profile?.full_name
		?.split(" ")
		.map((n: string) => n.charAt(0).toUpperCase())
		.join("");

	return (
		<div className='min-h-screen bg-[#000000] flex'>
			{/* ── Sidebar — hidden on mobile, visible md+ ── */}
			<aside className='hidden md:flex w-64 border-r border-white/20 flex-col p-4 bg-white/5 shrink-0'>
				<h1 className='text-white font-sans font-medium mb-3'>
					Creator Deal Tracker
				</h1>

				<nav className='space-y-2 mt-6'>
					{navLinks.map(({ href, label }) => (
						<Link
							key={href}
							href={href}
							className='hover:text-white hover:bg-white/10 block rounded-md px-3 py-2 text-zinc-400 transition-colors'
						>
							{label}
						</Link>
					))}
				</nav>

				<div className='flex flex-col mt-auto border-t border-white/10 pt-4'>
					<div className='flex items-center gap-3 mb-3'>
						<div className='w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-sm font-medium'>
							{initials}
						</div>
						<p className='text-zinc-400 text-sm font-medium'>
							{profile?.full_name}
						</p>
					</div>
					<SignOutButton />
				</div>
			</aside>

			{/* ── Main content — full width on mobile, offset on md+ ── */}
			<main className='flex-1 min-w-0 pb-20 md:pb-0'>{children}</main>

			{/* ── Bottom nav — visible on mobile only ── */}
			<nav className='fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#000000] border-t border-white/10 flex items-center justify-around px-2 py-2'>
				{navLinks.map(({ href, label, icon: Icon }) => (
					<Link
						key={href}
						href={href}
						className='flex flex-col items-center gap-1 px-3 py-1 text-zinc-500 hover:text-white transition-colors'
					>
						<Icon className='w-5 h-5' />
						<span className='text-[10px]'>{label}</span>
					</Link>
				))}
			</nav>
		</div>
	);
}
