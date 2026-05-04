import { getRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import PricingClient from "./PricingClient";

export default async function PricingPage() {
	const role = await getRole();
	if (role === "admin") redirect("/dashboard");

	return <PricingClient />;
}
