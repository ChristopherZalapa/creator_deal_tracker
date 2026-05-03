"use client";

import {
	deleteCreator,
	updateCreator,
} from "@/app/(protected)/creators/actions";
import { useState } from "react";
import Link from "next/link";
import { Users } from "lucide-react";
import ActionButtons from "@/components/ActionButtons";
import type { Creator } from "@/types";

const EmptyState = () => (
	<div className='flex flex-col items-center gap-3 py-16'>
		<div className='w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center'>
			<Users className='w-6 h-6 text-zinc-500' />
		</div>
		<div className='text-center'>
			<p className='text-white text-sm font-medium mb-1'>No creators yet</p>
			<p className='text-zinc-500 text-sm'>
				Add your first creator to start tracking deals
			</p>
		</div>
		<Link
			href='/creators/new'
			className='mt-1 bg-white text-black text-sm font-medium px-4 py-2 rounded-md hover:bg-zinc-200 transition-colors'
		>
			Add Creator
		</Link>
	</div>
);

export default function CreatorTable({ creators }: { creators: Creator[] }) {
	const [openModal, setOpenModal] = useState(false);
	const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);

	const handleEdit = (creator: Creator) => {
		setSelectedCreator(creator);
		setOpenModal(true);
	};

	const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		await updateCreator(selectedCreator!.id, {
			name: formData.get("name") as string,
			platform: formData.get("platform") as string,
			followers: Number(formData.get("followers")),
			email: formData.get("email") as string,
			niche: formData.get("niche") as string,
		});
		setOpenModal(false);
	};

	return (
		<>
			<div className='md:hidden mt-6 flex flex-col gap-3'>
				{creators && creators.length > 0 ? (
					creators.map((creator) => (
						<div
							key={creator.id}
							className='bg-white/5 border border-white/10 rounded-xl p-4'
						>
							<div className='flex items-center justify-between mb-3'>
								<p className='text-white text-sm font-medium'>{creator.name}</p>
								<ActionButtons
									onEdit={() => handleEdit(creator)}
									onDelete={() => deleteCreator(creator.id)}
								/>
							</div>
							<div className='grid grid-cols-2 gap-y-3'>
								<div>
									<p className='text-zinc-500 text-xs mb-0.5'>Platform</p>
									<p className='text-zinc-300 text-sm capitalize'>
										{creator.platform}
									</p>
								</div>
								<div>
									<p className='text-zinc-500 text-xs mb-0.5'>Followers</p>
									<p className='text-zinc-300 text-sm'>
										{creator.followers?.toLocaleString()}
									</p>
								</div>
								<div>
									<p className='text-zinc-500 text-xs mb-0.5'>Niche</p>
									<p className='text-zinc-300 text-sm'>{creator.niche}</p>
								</div>
								<div>
									<p className='text-zinc-500 text-xs mb-0.5'>Email</p>
									<p className='text-zinc-300 text-sm truncate'>
										{creator.email}
									</p>
								</div>
							</div>
						</div>
					))
				) : (
					<div className='bg-white/5 border border-white/10 rounded-xl'>
						<EmptyState />
					</div>
				)}
			</div>

			<div className='hidden md:block bg-white/5 border border-white/10 rounded-xl p-6 mt-6 overflow-x-auto'>
				<table className='w-full min-w-160'>
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
							creators.map((creator) => (
								<tr
									key={creator.id}
									className='border-b border-white/5 hover:bg-white/5 transition-colors'
								>
									<td className='text-white text-sm py-4 pr-4'>
										{creator.name}
									</td>
									<td className='text-white text-sm py-4 pr-4 capitalize'>
										{creator.platform}
									</td>
									<td className='text-white text-sm py-4 pr-4'>
										{creator.followers?.toLocaleString()}
									</td>
									<td className='text-white text-sm py-4 pr-4'>
										{creator.niche}
									</td>
									<td className='text-white text-sm py-4 pr-4 max-w-[180px] truncate'>
										{creator.email}
									</td>
									<td className='py-4'>
										<ActionButtons
											onEdit={() => handleEdit(creator)}
											onDelete={() => deleteCreator(creator.id)}
										/>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={6}>
									<EmptyState />
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{openModal && (
				<div className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4'>
					<div className='bg-[#0d0d0d] border border-white/10 rounded-xl p-5 md:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto'>
						<div className='flex justify-between items-center mb-4'>
							<h2 className='text-white font-semibold'>Edit Creator</h2>
							<button
								type='button'
								onClick={() => setOpenModal(false)}
								className='w-8 h-8 rounded-md flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors'
							>
								✕
							</button>
						</div>
						<div className='bg-white/5 border border-white/10 rounded-xl p-4 md:p-6'>
							<form onSubmit={handleUpdate} className='space-y-5'>
								<div className='space-y-1.5'>
									<label
										htmlFor='name'
										className='text-sm font-medium text-zinc-200'
									>
										Name
									</label>
									<input
										type='text'
										defaultValue={selectedCreator?.name}
										name='name'
										id='name'
										placeholder='John Smith'
										required
										className='w-full h-9 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors mt-1'
									/>
								</div>
								<div className='space-y-1.5'>
									<label
										htmlFor='platform'
										className='text-sm font-medium text-zinc-200'
									>
										Platform
									</label>
									<div className='relative'>
										<select
											name='platform'
											defaultValue={selectedCreator?.platform}
											id='platform'
											required
											className='w-full h-9 appearance-none rounded-md border border-white/10 bg-[#0d0d0d] px-3 pr-8 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors cursor-pointer mt-1'
										>
											<option value='default' disabled>
												Select platform
											</option>
											<option value='instagram'>Instagram</option>
											<option value='youtube'>YouTube</option>
											<option value='tiktok'>TikTok</option>
											<option value='twitter'>Twitter</option>
											<option value='linkedin'>LinkedIn</option>
										</select>
										<div className='pointer-events-none absolute inset-y-0 right-2.5 flex items-center'>
											<svg
												className='w-4 h-4 text-zinc-400'
												fill='none'
												stroke='currentColor'
												strokeWidth={2}
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													d='M19 9l-7 7-7-7'
												/>
											</svg>
										</div>
									</div>
								</div>
								<div className='grid grid-cols-2 gap-4'>
									<div className='space-y-1.5'>
										<label
											htmlFor='followers'
											className='text-sm font-medium text-zinc-200'
										>
											Followers
										</label>
										<input
											type='number'
											defaultValue={selectedCreator?.followers}
											name='followers'
											id='followers'
											placeholder='10000'
											className='w-full h-9 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors mt-1'
										/>
									</div>
									<div className='space-y-1.5'>
										<label
											htmlFor='niche'
											className='text-sm font-medium text-zinc-200'
										>
											Niche
										</label>
										<input
											type='text'
											defaultValue={selectedCreator?.niche}
											name='niche'
											id='niche'
											placeholder='Tech, Fashion, Gaming...'
											className='w-full h-9 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors mt-1'
										/>
									</div>
								</div>
								<div className='space-y-1.5'>
									<label
										htmlFor='email'
										className='text-sm font-medium text-zinc-200'
									>
										Email
									</label>
									<input
										type='email'
										name='email'
										defaultValue={selectedCreator?.email}
										id='email'
										placeholder='creator@example.com'
										className='w-full h-9 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors mt-1'
									/>
								</div>
								<div className='flex items-center gap-3 pt-2'>
									<button
										type='submit'
										className='h-9 rounded-md bg-white px-6 text-sm font-medium text-black hover:bg-zinc-200 transition-colors'
									>
										Save Changes
									</button>
									<button
										type='button'
										onClick={() => setOpenModal(false)}
										className='h-9 rounded-md border border-white/10 px-6 text-sm text-zinc-400 hover:text-white transition-colors flex items-center'
									>
										Cancel
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
