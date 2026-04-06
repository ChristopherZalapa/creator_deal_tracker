import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function NewCreator() {
	const addCreator = async (formData: FormData) => {
		"use server";

		const name = formData.get("name") as string;
		const platform = formData.get("platform") as string;
		const followers = Number(formData.get("followers"));
		const email = formData.get("email") as string;
		const niche = formData.get("niche") as string;

		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		await supabase
			.from("creators")
			.insert({ name, platform, followers, email, niche, user_id: user?.id });
		redirect("/creators");
	};

	return (
		<div className='p-8 '>
			<div className='flex items-center gap-4 mb-8'>
				<Link
					href='/creators'
					className='text-zinc-400 hover:text-white transition-colors text-sm'
				>
					← Back
				</Link>
				<h1 className='text-white text-2xl font-semibold'>Add Creator</h1>
			</div>

			<div className='bg-white/5 border border-white/10 rounded-xl p-6'>
				<form action={addCreator} className='space-y-5'>
					<div className='space-y-1.5'>
						<label htmlFor='name' className='text-sm font-medium text-zinc-200'>
							Name
						</label>
						<input
							type='text'
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
							id='email'
							placeholder='creator@example.com'
							className='w-full h-9 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors mt-1'
						/>
					</div>

					<div className='flex items-center  gap-3 pt-2'>
						<button
							type='submit'
							className='h-9 rounded-md bg-white px-6 text-sm font-medium text-black hover:bg-zinc-200 transition-colors'
						>
							Add Creator
						</button>
						<Link
							href='/creators'
							className='h-9 rounded-md border border-white/10 px-6 text-sm text-zinc-400 hover:text-white transition-colors flex items-center '
						>
							Cancel
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
