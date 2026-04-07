"use client";

import { deleteDeal, updateDeal } from "@/app/(protected)/deals/actions";
import { useState } from "react";
import Link from "next/link";
import {
	Mail,
	MessageSquare,
	FileCheck,
	CheckCircle,
	XCircle,
	FileText,
} from "lucide-react";

type Deal = {
	id: string;
	brand_name: string;
	deal_value: number;
	status: string;
	expected_views: number;
	actual_views: number;
	cost: number;
	creator_id: string;
	creators: {
		name: string;
	} | null;
};

function getStatusDisplay(status: string) {
	switch (status) {
		case "contacted":
			return { icon: Mail, color: "text-blue-400" };
		case "negotiating":
			return { icon: MessageSquare, color: "text-yellow-400" };
		case "signed":
			return { icon: FileCheck, color: "text-purple-400" };
		case "completed":
			return { icon: CheckCircle, color: "text-green-400" };
		case "cancelled":
			return { icon: XCircle, color: "text-red-400" };
		default:
			return { icon: Mail, color: "text-zinc-400" };
	}
}

export default function DealsTable({ deals }: { deals: Deal[] }) {
	const [openModal, setOpenModal] = useState(true);
	const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

	const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);

		await updateDeal(selectedDeal!.id, {
			brand_name: formData.get("brand_name") as string,
			deal_value: Number(formData.get("deal_value")) as number,
			status: formData.get("status") as string,
			expected_views: Number(formData.get("expected_views")) as number,
			actual_views: Number(formData.get("actual_views")) as number,
			cost: Number(formData.get("cost")) as number,
		});

		setOpenModal(false);
	};

	return (
		<>
			<div className='bg-white/5 border border-white/10 rounded-xl p-6 mt-6'>
				<table className='w-full'>
					<thead>
						<tr className='border-b border-white/10'>
							<th className='text-left text-zinc-400 text-sm font-medium pb-3'>
								Brand
							</th>
							<th className='text-left text-zinc-400 text-sm font-medium pb-3'>
								Creator
							</th>
							<th className='text-left text-zinc-400 text-sm font-medium pb-3'>
								Value
							</th>
							<th className='text-left text-zinc-400 text-sm font-medium pb-3'>
								Cost
							</th>
							<th className='text-left text-zinc-400 text-sm font-medium pb-3'>
								Status
							</th>
							<th className='text-left text-zinc-400 text-sm font-medium pb-3'>
								Action
							</th>
						</tr>
					</thead>
					<tbody>
						{deals && deals.length > 0 ? (
							deals.map((deal) => {
								const { icon: Icon, color } = getStatusDisplay(deal.status);
								return (
									<tr
										key={deal.id}
										className='border-b border-white/5 hover:bg-white/5 transition-colors'
									>
										<td className='text-white text-sm py-4 pr-4'>
											{deal.brand_name}
										</td>
										<td className='text-white text-sm py-4 pr-4'>
											{deal.creators?.name}
										</td>
										<td className='text-white text-sm py-4 pr-4'>
											{deal.deal_value}
										</td>
										<td className='text-white text-sm py-4 pr-4'>
											{deal.cost}
										</td>
										<td className='text-white text-sm py-4 pr-4'>
											<div className='flex items-center gap-2'>
												<Icon className={`w-4 h-4 ${color}`} />
												<span className={`text-sm ${color}`}>
													{deal.status}
												</span>
											</div>
										</td>
										<td className='flex items-center gap-2'>
											<button
												onClick={() => deleteDeal(deal.id)}
												className='text-red-400 hover:text-red-300 text-sm transition-colors'
											>
												Delete
											</button>
											<button
												onClick={() => {
													setSelectedDeal(deal);
													setOpenModal(true);
												}}
												className='text-zinc-400 hover:text-white text-sm transition-colors'
											>
												Edit
											</button>
										</td>
									</tr>
								);
							})
						) : (
							<tr>
								<td colSpan={6} className='py-16 text-center'>
									<div className='flex flex-col items-center gap-3'>
										<div className='w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center'>
											<FileText className='w-5 h-5 text-zinc-500' />
										</div>
										<p className='text-white text-sm font-medium'>
											No deals yet
										</p>
										<p className='text-zinc-500 text-sm'>
											Add your first deal to start tracking
										</p>
										<Link
											href='/deals/new'
											className='mt-2 bg-white text-black text-sm font-medium px-4 py-2 rounded-md hover:bg-zinc-200 transition-colors'
										>
											Add Deal
										</Link>
									</div>
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			{openModal && (
				<div className='relative h-screen overflow-hidden'>
					<div className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center'>
						<div className='bg-[#0d0d0d] border border-white/10 rounded-xl p-6 w-full max-w-md'>
							<div className='flex justify-between items-center mb-4'>
								<h2 className='text-white font-semibold'>Edit Deal</h2>

								<button
									type='button'
									className='text-zinc-400 hover:text-white transition-colors'
									onClick={() => setOpenModal(false)}
								>
									x
								</button>
							</div>
							<div className='bg-white/5 border border-white/10 rounded-xl p-6'>
								<form onSubmit={handleUpdate} className='space-y-5'>
									<div className='space-y-1.5'>
										<label
											htmlFor='name'
											className='text-sm font-medium text-zinc-200'
										>
											Brand Name
										</label>
										<input
											type='text'
											defaultValue={selectedDeal?.brand_name}
											name='brand_name'
											id='brand_name'
											required
											placeholder='Nike'
											className='w-full h-9 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors mt-1'
										/>
									</div>
									<div className='space-y-1.5'>
										<label
											htmlFor='name'
											className='text-sm font-medium text-zinc-200'
										>
											Brand Name
										</label>
										<input
											type='text'
											defaultValue={selectedDeal?.brand_name}
											name='brand_name'
											id='brand_name'
											required
											placeholder='Nike'
											className='w-full h-9 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors mt-1'
										/>
									</div>
									<div className='space-y-1.5'>
										<label
											htmlFor='platform'
											className='text-sm font-medium text-zinc-200'
										>
											Status
										</label>
										<div className='relative'>
											<select
												name='status'
												defaultValue={selectedDeal?.status}
												id='status'
												required
												className='w-full h-9 appearance-none rounded-md border border-white/10 bg-[#0d0d0d] px-3 pr-8 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors cursor-pointer mt-1'
											>
												<option value={"default"} disabled>
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
									<div className='space-y-1.5'>
										<label
											htmlFor='name'
											className='text-sm font-medium text-zinc-200'
										>
											Brand Name
										</label>
										<input
											type='text'
											defaultValue={selectedDeal?.brand_name}
											name='brand_name'
											id='brand_name'
											required
											placeholder='Nike'
											className='w-full h-9 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors mt-1'
										/>
									</div>
									<div className='space-y-1.5'>
										<label
											htmlFor='name'
											className='text-sm font-medium text-zinc-200'
										>
											Brand Name
										</label>
										<input
											type='text'
											defaultValue={selectedDeal?.brand_name}
											name='brand_name'
											id='brand_name'
											required
											placeholder='Nike'
											className='w-full h-9 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors mt-1'
										/>
									</div>
									<div className='space-y-1.5'>
										<label
											htmlFor='name'
											className='text-sm font-medium text-zinc-200'
										>
											Brand Name
										</label>
										<input
											type='text'
											defaultValue={selectedDeal?.brand_name}
											name='brand_name'
											id='brand_name'
											required
											placeholder='Nike'
											className='w-full h-9 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors mt-1'
										/>
									</div>
									<div className='flex justify-between gap-3 pt-2'>
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
				</div>
			)}
		</>
	);
}
