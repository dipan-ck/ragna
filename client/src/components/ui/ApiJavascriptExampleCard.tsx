'use client';

import React from 'react';
import { Copy } from 'lucide-react';

const exampleCode = `const response = await fetch("https://api.aibuilder.com/v1/projects/2/chat", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    message: "Hello, how can you help me?",
    stream: false
  })
});

const data = await response.json();
console.log(data);`;

const ApiJavascriptExampleCard: React.FC = () => {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(exampleCode);
  };

  return (
    <div className="bg-[#0a0a0a] border mt-6 border-[#2a2a2a] rounded-xl p-4 w-full text-white">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base font-semibold">JavaScript</h3>
        <button
          onClick={handleCopy}
          className="flex items-center text-sm text-gray-400 hover:bg-[#1a1a1a]  px-2 py-2 rounded-md"
        >
          <Copy className="w-4 h-4 mr-1" />

        </button>
      </div>

      <pre className="text-sm whitespace-pre-wrap overflow-x-auto bg-[#121212] border border-[#2a2a2a] rounded-lg p-4">
{exampleCode}
      </pre>
    </div>
  );
};

export default ApiJavascriptExampleCard;
