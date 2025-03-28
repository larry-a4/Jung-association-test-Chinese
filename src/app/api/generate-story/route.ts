import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { testWords, associationWords } = await request.json();

    const prompt = `请根据以下测试词和对应的联想词创作一个富有创意和连贯性的故事。

测试词和联想词对照：
${testWords.map((word: string, index: number) => `${word} → ${associationWords[index]}`).join('\n')}

要求：
1. 故事要包含所有给定的测试词和联想词
2. 每组测试词和联想词要尽量在相近的位置出现，最好在同一句话中，或者相邻的句子中
3. 故事要有完整的情节发展
4. 故事要有起承转合
5. 故事要有一定的寓意或主题
6. 故事要自然流畅，不要生硬地堆砌词语
7. 在故事中，测试词和联想词要形成有意义的关联
请用中文写作。`;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "你是一个专业的故事创作者，善于将看似不相关的词语编织成有趣的故事，并能够深入理解词语之间的心理关联。你特别擅长将相关的词语组合在相近的位置，使故事更加连贯和生动。"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    const story = data.choices[0].message.content;

    return NextResponse.json({ story });
  } catch (error) {
    console.error('Error generating story:', error);
    return NextResponse.json(
      { error: '生成故事时发生错误' },
      { status: 500 }
    );
  }
} 