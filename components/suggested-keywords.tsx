"use client";

const keywords = [
  { id: 1, text: "Reactionary" },
  { id: 2, text: "Summary" },
  { id: 3, text: "AI" },
  { id: 4, text: "Plagiarism" },
  { id: 5, text: "WPF" },
  { id: 6, text: "PDF" },
  { id: 7, text: "RX" }
];

export function SuggestedKeywords() {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-400">Suggested Keywords</h3>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword) => (
          <button
            key={keyword.id}
            className="px-4 py-1.5 rounded-full border border-gray-700 bg-[#222] text-sm text-gray-300 hover:bg-[#333] transition-colors"
          >
            {keyword.text}
          </button>
        ))}
      </div>
    </div>
  );
} 