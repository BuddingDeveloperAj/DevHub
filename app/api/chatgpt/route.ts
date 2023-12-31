import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const { query, isQuestion = true } = await request.json();

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.OPEN_API_KEY,
      },
      body: isQuestion
        ? JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are a knowledgeable assistant that provides quality information also if the answer requires any code block example make it in html format in respective language not in ```",
              },
              {
                role: "user",
                content: "Tell me " + query,
              },
            ],
          })
        : JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are a assistant that provides me short description not more than 20 words and mostly the words belogs to technology and development",
              },
              {
                role: "user",
                content: "Tell me " + query,
              },
            ],
          }),
    });

    const responeData = await response.json();
    const reply = responeData.choices[0].message.content;

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
