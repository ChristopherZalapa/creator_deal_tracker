import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";
import { getRole } from "@/lib/auth";
import {
	LayoutDashboard,
	Users,
	Handshake,
	Kanban,
	BarChart2,
	CreditCard,
} from "lucide-react";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) redirect("/login");

	const { data: profile } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", user.id)
		.single();

	const role = await getRole();
	const isAdmin = role === "admin";

	const initials = profile?.full_name
		?.split(" ")
		.map((n: string) => n.charAt(0).toUpperCase())
		.join("");

	const navLinks = [
		{
			href: "/dashboard",
			label: "Dashboard",
			icon: LayoutDashboard,
			adminOnly: false,
		},
		{ href: "/creators", label: "Creators", icon: Users, adminOnly: false },
		{ href: "/deals", label: "Deals", icon: Handshake, adminOnly: false },
		{ href: "/kanban", label: "Kanban", icon: Kanban, adminOnly: false },
		{
			href: "/analytics",
			label: "Analytics",
			icon: BarChart2,
			adminOnly: true,
		},
		{ href: "/pricing", label: "Pricing", icon: CreditCard, adminOnly: false },
	];

	const visibleLinks = navLinks.filter((link) => !link.adminOnly || isAdmin);

	return (
		<div className='min-h-screen bg-[#000000] flex'>
			<aside className='hidden md:flex w-64 border-r border-white/20 flex-col p-4 bg-white/5 shrink-0'>
				<div className='flex items-center gap-2 mb-3'>
					<h1 className='text-white font-sans font-medium'>
						Creator Deal Tracker
					</h1>
				</div>

				{isAdmin && (
					<span className='text-xs text-zinc-500 bg-white/5 border border-white/10 rounded-full px-2 py-0.5 w-fit mb-3'>
						Admin
					</span>
				)}

				<nav className='space-y-2 mt-6'>
					{visibleLinks.map(({ href, label }) => (
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
						<div className='flex flex-col'>
							<p className='text-zinc-400 text-sm font-medium'>
								{profile?.full_name}
							</p>
							<p className='text-zinc-600 text-xs capitalize'>{role}</p>
						</div>
					</div>
					<SignOutButton />
				</div>
			</aside>

			<div className='flex-1 min-w-0 flex flex-col'>
				{/* Mobile top bar */}
				<div className='md:hidden flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#000000]'>
					<div className='flex items-center gap-2'>
						<div className='w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-medium'>
							{initials}
						</div>
						<div className='flex flex-col'>
							<p className='text-white text-xs font-medium'>
								{profile?.full_name}
							</p>
							{isAdmin && (
								<span className='text-zinc-500 text-[10px] capitalize'>
									{role}
								</span>
							)}
						</div>
					</div>
					<SignOutButton />
				</div>

				<main className='flex-1 min-w-0 pb-20 md:pb-0'>{children}</main>
			</div>

			<nav className='fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#000000] border-t border-white/10 flex items-center justify-around px-2 py-2'>
				{visibleLinks.map(({ href, label, icon: Icon }) => (
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
