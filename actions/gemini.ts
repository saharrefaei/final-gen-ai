"use server";

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function runGeminiAi(message: string) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
  };

  const chatSession = model.startChat({
    generationConfig,
    // safetySettings: Adjust safety settings
    // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [
      {
        role: "user",
        parts: [
          {
            text: "You are a helpful assistant for an image generator website. If user is askgin about the image generation features, you answer them in maximum 50 character long reply. All you need to know is: This app is free to use at the start and can generate images using ai for free. Users can download freely generated iages. They must be logged in.",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Free AI image generation, download your creations! \nLogin required. \n",
          },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(message);
  const response = result.response;

  console.log(response.text());
  return response.text();
}
