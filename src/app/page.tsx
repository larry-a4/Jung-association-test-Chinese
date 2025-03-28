'use client';

import { useState, useEffect } from 'react';

const allWords = [
  '头', '绿色', '水', '唱歌', '死亡', '长', '船', '支付', '窗户', '友好',
  '烹饪', '询问', '冷', '茎', '跳舞', '村庄', '湖', '生病', '骄傲', '烹饪',
  '墨水', '生气', '针', '游泳', '航行', '蓝色', '灯', '犯罪', '面包', '富有',
  '树', '刺', '怜悯', '黄色', '山', '死亡', '盐', '新', '习俗', '祈祷',
  '钱', '愚蠢', '小册子', '鄙视', '手指', '昂贵', '鸟', '跌倒', '书', '不公',
  '青蛙', '分离', '饥饿', '白色', '孩子', '照顾', '铅笔', '悲伤', '李子', '结婚',
  '房子', '亲爱的', '玻璃', '争吵', '毛皮', '大', '胡萝卜', '绘画', '部分', '老',
  '花', '打', '盒子', '野生', '家庭', '洗', '牛', '朋友', '运气', '谎言',
  '举止', '狭窄', '兄弟', '害怕', '鹳', '虚假', '焦虑', '亲吻', '新娘', '纯洁',
  '门', '选择', '干草', '满足', '嘲笑', '睡觉', '月份', '美好', '女人', '辱骂'
];

// 随机选择n个不重复的词语
function getRandomWords(words: string[], n: number): string[] {
  const shuffled = [...words].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

export default function Home() {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [responses, setResponses] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [story, setStory] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // 在组件加载时随机选择7个词语
    setSelectedWords(getRandomWords(allWords, 7));
    setCurrentWord(getRandomWords(allWords, 7)[0]);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newResponses = [...responses, userInput];
    setResponses(newResponses);
    setUserInput('');

    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
      setCurrentWord(selectedWords[currentStep + 1]);
    } else {
      setIsComplete(true);
      generateStory(newResponses);
    }
  };

  const generateStory = async (words: string[]) => {
    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          testWords: selectedWords,
          associationWords: words 
        }),
      });
      const data = await response.json();
      setStory(data.story);
    } catch (error) {
      console.error('Error generating story:', error);
      setStory('抱歉，生成故事时出现错误。');
    }
  };

  if (isComplete) {
    return (
      <main className="min-h-screen p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">测试完成！</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">测试词语：</h2>
          <div className="grid grid-cols-4 gap-2 mb-6">
            {selectedWords.map((word, index) => (
              <div key={index} className="bg-gray-100 p-2 rounded text-center">
                {word}
              </div>
            ))}
          </div>
          <h2 className="text-xl font-semibold mb-4">你的联想词：</h2>
          <div className="grid grid-cols-4 gap-2 mb-6">
            {responses.map((word, index) => (
              <div key={index} className="bg-gray-100 p-2 rounded text-center">
                {word}
              </div>
            ))}
          </div>
          <h2 className="text-xl font-semibold mb-4">基于你的联想词的故事：</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{story}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">荣格词语联想测试</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">进度：{currentStep + 1}/7</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${((currentStep + 1) / 7) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-blue-600 mb-4">{currentWord}</h2>
          <p className="text-gray-600">请说出你想到的第一个词</p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入你的联想词..."
            autoFocus
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            提交
          </button>
        </form>
      </div>
    </main>
  );
}
