import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { words } = await request.json();

    const prompt = `请根据以下20个词语创作一个富有创意和连贯性的故事。这些词语是：${words.join('、')}。
    要求：
    1. 故事要包含所有给定的词语
    2. 故事要有完整的情节发展
    3. 故事要有起承转合
    4. 故事要有一定的寓意或主题
    5. 故事要自然流畅，不要生硬地堆砌词语
    请用中文写作。`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "你是一个专业的故事创作者，善于将看似不相关的词语编织成有趣的故事。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const story = completion.choices[0].message.content;

    return NextResponse.json({ story });
  } catch (error) {
    console.error('Error generating story:', error);
    return NextResponse.json(
      { error: '生成故事时发生错误' },
      { status: 500 }
    );
  }
} 