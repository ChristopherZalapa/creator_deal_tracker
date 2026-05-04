import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
	apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
	const { brandName, creatorName, dealValue, status, niche, platform } =
		await req.json();

	const message = await client.messages.create({
		model: "claude-opus-4-5",
		max_tokens: 1024,
		messages: [
			{
				role: "user",
				content: `Generate a professional email from a talent manager reaching out to a creator about a brand partnership opportunity with the following details:
- Brand: ${brandName}
- Creator: ${creatorName}
- Platform: ${platform}
- Niche: ${niche}
- Deal Value: $${dealValue}
- Status: ${status}

Write the email as if you are the creator's talent manager or agency reaching out to ${creatorName} to inform them about this exciting opportunity from ${brandName}.
Include a subject line at the top formatted as "Subject: ...".
The tone should be professional but personal — you represent the creator's best interests and are bringing them a vetted opportunity.
Summarize the partnership opportunity, the deal value, and why you think it's a good fit for their ${niche} content on ${platform}.
Ask them to confirm their interest so you can move forward with ${brandName}.
Keep it under 200 words and do not use placeholders — write it as a complete ready-to-send email.
Sign off as "Your Management Team".`,
			},
		],
	});

	const text =
		message.content[0].type === "text" ? message.content[0].text : "";

	return NextResponse.json({ email: text });
}
