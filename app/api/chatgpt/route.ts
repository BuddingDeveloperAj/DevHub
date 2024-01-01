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
                  "You are a knowledgeable assistant that provides quality information",
              },
              {
                role: "user",
                content: `As a knowledgeable assistant, provide accurate information about ${query}. If you require a code example, ensure it's strictly wrapped like below and paste the code in "YOUR CODE HERE":

                <pre class='language-markup'>
                  <code>
                    YOUR CODE HERE
                  </code>
                </pre>
                To specify the language for the code block, use the following classes:
                JavaScript: class='language-javascript'
                CSS: class='language-css'
                PHP: class='language-php'
                Ruby: class='language-ruby'
                Python: class='language-python'
                Java: class='language-java'
                C: class='language-c'
                C#: class='language-csharp'
                C++: class='language-cpp'`,
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
    console.log(responeData);
    const reply = responeData.choices[0].message.content;

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
