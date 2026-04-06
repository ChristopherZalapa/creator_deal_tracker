import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function NewCreator() {
	const addCreator = async (formData: FormData) => {
		"use server";

		const name = formData.get("name") as string;
		const platform = formData.get("platfom") as string;
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
		<div className='relative w-full max-'>
			<form onSubmit={addCreator}>
				<div>
					<label htmlFor='name' className='text-sm font-medium text-zinc-200'>
						Name
					</label>
				</div>
			</form>
		</div>
	);
}
