import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function NewDeal() {
	const supabase = await createClient();
	const { data: creators } = await supabase.from("creators").select("id, name");

	const addDeal = async (formData: FormData) => {
		"use server";

		const brand_name = formData.get("brand_name") as string;
		const deal_value = Number(formData.get("deal_value"));
		const status = formData.get("status") as string;
		const expected_views = Number(formData.get("expected_views"));
		const actual_views = Number(formData.get("actual_views"));
		const cost = Number(formData.get("cost"));
		const creator_id = formData.get("creator_id") as string;

		const supabase = await createClient();
		await supabase.from("deals").insert({
			brand_name,
			deal_value,
			actual_views,
			status,
			expected_views,
			cost,
			creator_id,
		});
		redirect("/deals");
	};

	return (
		<div className='p-8 max-w-2xl'>
			<div className='flex items-center gap-4 mb-8'>
				<Link
					href='/deals'
					className='text-zinc-400 hover:text-white transition-colors text-sm'
				>
					← Back
				</Link>
				<h1 className='text-white text-2xl font-semibold'>Add Deal</h1>
			</div>

			<div className='bg-white/5 border border-white/10 rounded-xl p-6'>
				<form action={addDeal} className='space-y-5'>
					<div className='space-y-1.5'>
						<label
							htmlFor='creator_id'
							className='text-sm font-medium text-zinc-200'
						>
							Creator
						</label>
						<div className='relative'>
							<select
								name='creator_id'
								id='creator_id'
								required
								className='w-full h-9 appearance-none rounded-md border border-white/10 bg-[#0d0d0d] px-3 pr-8 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors cursor-pointer mt-1'
							>
								<option value=''>Select creator</option>
								{creators?.map((creator) => (
									<option key={creator.id} value={creator.id}>
										{creator.name}
									</option>
								))}
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
							htmlFor='brand_name'
							className='text-sm font-medium text-zinc-200'
						>
							Brand Name
						</label>
						<input
							type='text'
							name='brand_name'
							id='brand_name'
							placeholder='Nike'
							required
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
								name='deal_value'
								id='deal_value'
								placeholder='10000'
								required
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
								name='cost'
								id='cost'
								placeholder='5000'
								required
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
								name='expected_views'
								id='expected_views'
								placeholder='100000'
								required
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
								name='actual_views'
								id='actual_views'
								placeholder='80000'
								required
								className='w-full h-9 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors mt-1'
							/>
						</div>
					</div>

					<div className='flex items-center gap-3 pt-2'>
						<button
							type='submit'
							className='h-9 rounded-md bg-white px-6 text-sm font-medium text-black hover:bg-zinc-200 transition-colors'
						>
							Add Deal
						</button>
						<Link
							href='/deals'
							className='h-9 rounded-md border border-white/10 px-6 text-sm text-zinc-400 hover:text-white transition-colors flex items-center'
						>
							Cancel
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
