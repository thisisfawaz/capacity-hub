import { NextResponse } from "next/server";

export async function POST(request) {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { message: "DeepSeek API key is not configured. Please add DEEPSEEK_API_KEY to your .env file." },
      { status: 400 }
    );
  }

  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ message: "Invalid payload: messages array is required." }, { status: 400 });
    }

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "You are an expert grant assistant for CapacityHub, helping NGOs draft proposals and review eligibility." },
          ...messages
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ message: `DeepSeek API Error: ${errText}` }, { status: response.status });
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;
    return NextResponse.json({ success: true, message: reply });

  } catch (error) {
    return NextResponse.json({ message: `Server Error: ${error.message}` }, { status: 500 });
  }
}
