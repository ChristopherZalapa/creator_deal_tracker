"use client";

import { deleteDeal, updateDeal } from "@/app/(protected)/deals/actions";
import { useState } from "react";
import Link from "next/link";
import type { Deal } from "@/types";
import {
	Mail,
	MessageSquare,
	FileCheck,
	CheckCircle,
	XCircle,
	FileText,
} from "lucide-react";
import ActionButtons from "@/components/ActionButtons";

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
			return { icon: FileText, color: "text-zinc-400" };
	}
}

const EmptyState = () => (
	<div className='flex flex-col items-center gap-3 py-16'>
		<div className='w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center'>
			<FileText className='w-6 h-6 text-zinc-500' />
		</div>
		<div className='text-center'>
			<p className='text-white text-sm font-medium mb-1'>No deals yet</p>
			<p className='text-zinc-500 text-sm'>
				Add your first deal to start tracking
			</p>
		</div>
		<Link
			href='/deals/new'
			className='mt-1 bg-white text-black text-sm font-medium px-4 py-2 rounded-md hover:bg-zinc-200 transition-colors'
		>
			Add Deal
		</Link>
	</div>
);

export default function DealsTable({ deals }: { deals: Deal[] }) {
	const [openModal, setOpenModal] = useState(false);
	const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

	const handleEdit = (deal: Deal) => {
		setSelectedDeal(deal);
		setOpenModal(true);
	};

	const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		await updateDeal(selectedDeal!.id, {
			brand_name: formData.get("brand_name") as string,
			deal_value: Number(formData.get("deal_value")),
			status: formData.get("status") as string,
			expected_views: Number(formData.get("expected_views")),
			actual_views: Number(formData.get("actual_views")),
			cost: Number(formData.get("cost")),
		});
		setOpenModal(false);
	};

	return (
		<>
			<div className='md:hidden mt-6 flex flex-col gap-3'>
				{deals && deals.length > 0 ? (
					deals.map((deal) => {
						const { icon: Icon, color } = getStatusDisplay(deal.status);
						return (
							<div
								key={deal.id}
								className='bg-white/5 border border-white/10 rounded-xl p-4'
							>
								<div className='flex items-center justify-between mb-3'>
									<p className='text-white text-sm font-medium'>
										{deal.brand_name}
									</p>
									<ActionButtons
										onEdit={() => handleEdit(deal)}
										onDelete={() => deleteDeal(deal.id)}
									/>
								</div>
								<div className='grid grid-cols-2 gap-y-3'>
									<div>
										<p className='text-zinc-500 text-xs mb-0.5'>Creator</p>
										<p className='text-zinc-300 text-sm'>
											{deal.creators?.name}
										</p>
									</div>
									<div>
										<p className='text-zinc-500 text-xs mb-0.5'>Value</p>
										<p className='text-zinc-300 text-sm'>
											${deal.deal_value?.toLocaleString()}
										</p>
									</div>
									<div>
										<p className='text-zinc-500 text-xs mb-0.5'>Cost</p>
										<p className='text-zinc-300 text-sm'>
											${deal.cost?.toLocaleString()}
										</p>
									</div>
									<div>
										<p className='text-zinc-500 text-xs mb-0.5'>Status</p>
										<div className='flex items-center gap-1.5'>
											<Icon className={`w-3.5 h-3.5 ${color}`} />
											<span className={`text-sm capitalize ${color}`}>
												{deal.status}
											</span>
										</div>
									</div>
								</div>
							</div>
						);
					})
				) : (
					<div className='bg-white/5 border border-white/10 rounded-xl'>
						<EmptyState />
					</div>
				)}
			</div>

			<div className='hidden md:block bg-white/5 border border-white/10 rounded-xl p-6 mt-6 overflow-x-auto'>
				<table className='w-full min-w-[640px]'>
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
								Actions
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
											${deal.deal_value?.toLocaleString()}
										</td>
										<td className='text-white text-sm py-4 pr-4'>
											${deal.cost?.toLocaleString()}
										</td>
										<td className='py-4 pr-4'>
											<div className='flex items-center gap-2'>
												<Icon className={`w-4 h-4 ${color}`} />
												<span className={`text-sm capitalize ${color}`}>
													{deal.status}
												</span>
											</div>
										</td>
										<td className='py-4'>
											<ActionButtons
												onEdit={() => handleEdit(deal)}
												onDelete={() => deleteDeal(deal.id)}
											/>
										</td>
									</tr>
								);
							})
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
							<h2 className='text-white font-semibold'>Edit Deal</h2>
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
										htmlFor='brand_name'
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
										htmlFor='status'
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
											<option value='contacted'>Contacted</option>
											<option value='negotiating'>Negotiating</option>
											<option value='signed'>Signed</option>
											<option value='completed'>Completed</option>
											<option value='cancelled'>Cancelled</option>
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
											htmlFor='deal_value'
											className='text-sm font-medium text-zinc-200'
										>
											Deal Value
										</label>
										<input
											type='number'
											defaultValue={selectedDeal?.deal_value}
											name='deal_value'
											id='deal_value'
											placeholder='10000'
											className='w-full h-9 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors mt-1'
										/>
									</div>
									<div className='space-y-1.5'>
										<label
											htmlFor='cost'
											className='text-sm font-medium text-zinc-200'
										>
											Cost
										</label>
										<input
											type='number'
											defaultValue={selectedDeal?.cost}
											name='cost'
											id='cost'
											placeholder='5000'
											className='w-full h-9 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors mt-1'
										/>
									</div>
								</div>
								<div className='grid grid-cols-2 gap-4'>
									<div className='space-y-1.5'>
										<label
											htmlFor='expected_views'
											className='text-sm font-medium text-zinc-200'
										>
											Expected Views
										</label>
										<input
											type='number'
											defaultValue={selectedDeal?.expected_views}
											name='expected_views'
											id='expected_views'
											placeholder='100000'
											className='w-full h-9 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors mt-1'
										/>
									</div>
									<div className='space-y-1.5'>
										<label
											htmlFor='actual_views'
											className='text-sm font-medium text-zinc-200'
										>
											Actual Views
										</label>
										<input
											type='number'
											defaultValue={selectedDeal?.actual_views}
											name='actual_views'
											id='actual_views'
											placeholder='80000'
											className='w-full h-9 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors mt-1'
										/>
									</div>
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
