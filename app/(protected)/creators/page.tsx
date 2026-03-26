import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

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
			<div className='bg-white/5 border border-white/10 rounded-xl p-6 mt-6'>
				<table className='w-full'>
					<thead>
						<tr className='border-b border-white/10'>
							<th className='text-left text-zinc-400 text-sm font-medium pb-3'>
								Name
							</th>
							<th className='text-left text-zinc-400 text-sm font-medium pb-3'>
								Platform
							</th>
							<th className='text-left text-zinc-400 text-sm font-medium pb-3'>
								Followers
							</th>
							<th className='text-left text-zinc-400 text-sm font-medium pb-3'>
								Niche
							</th>
							<th className='text-left text-zinc-400 text-sm font-medium pb-3'>
								Email
							</th>
							<th className='text-left text-zinc-400 text-sm font-medium pb-3'>
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{creators && creators.length > 0 ? (
							creators?.map((creator) => (
								<tr
									key={creator.id}
									className='border-b border-white/5 hover:bg-white/5 transition-colors'
								>
									<td className='text-white text-sm py-4 pr-4'>
										{creator.name}
									</td>
									<td className='text-white text-sm py-4 pr-4'>
										{creator.platform}
									</td>
									<td className='text-white text-sm py-4 pr-4'>
										{creator.followers}
									</td>
									<td className='text-white text-sm py-4 pr-4'>
										{creator.niche}
									</td>
									<td className='text-white text-sm py-4 pr-4'>
										{creator.email}
									</td>
									<td className='py-4'>
										<div className='flex items-center gap-2'>
											<button className='text-red-400 hover:text-red-300 text-sm transition-colors'>
												Delete
											</button>
											<button className='text-zinc-400 hover:text-white text-sm transition-colors'>
												Edit
											</button>
										</div>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={6} className='py-16 text-center'>
									<div className='flex flex-col items-center gap-3'>
										<div className='w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center'>
											<svg
												className='w-5 h-5 text-zinc-500'
												fill='none'
												stroke='currentColor'
												strokeWidth={1.5}
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													d='M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z'
												/>
											</svg>
										</div>
										<p className='text-white text-sm font-medium'>
											No creators yet
										</p>
										<p className='text-zinc-500 text-sm'>
											Add your first creator to start tracking deals
										</p>
										<Link
											href='/creators/new'
											className='mt-2 bg-white text-black text-sm font-medium px-4 py-2 rounded-md hover:bg-zinc-200 transition-colors'
										>
											Add Creator
										</Link>
									</div>
								</td>
							</tr>
						)}
						)
					</tbody>
				</table>
			</div>
		</div>
	);
}
