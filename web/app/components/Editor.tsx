import React from "react";

interface EditorProps {
  chordProText: string;
  setChordProText: (text: string) => void;
  transposeAmount: number;
  setTransposeAmount: (amount: number) => void;
  generateContent: () => void;
  loadExample: () => void;
  flashMessage: string | null;
  warning: string | null;
  showWarning: boolean;
  setShowWarning: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Editor({
  chordProText,
  setChordProText,
  transposeAmount,
  setTransposeAmount,
  generateContent,
  loadExample,
  flashMessage,
  warning,
  showWarning,
  setShowWarning,
}: EditorProps) {
  return (
    <div className="w-full md:w-1/2 p-4 flex flex-col">
      <textarea
        className="flex-1 p-4 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary min-h-[200px] md:min-h-0"
        placeholder="Enter ChordPro text here..."
        value={chordProText}
        onChange={(e) => setChordProText(e.target.value)}
      />
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors duration-200"
              onClick={generateContent}
            >
              Generate
            </button>
            <button
              className="px-4 py-2 bg-gray-100 text-primary border border-primary rounded-full hover:bg-gray-200 transition-colors duration-200"
              onClick={loadExample}
            >
              Load Example
            </button>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="transpose" className="text-sm text-gray-600">Transpose:</label>
            <input
              id="transpose"
              type="number"
              value={transposeAmount}
              onChange={(e) => setTransposeAmount(Number(e.target.value))}
              className="w-16 px-2 py-1 border border-border rounded-md text-sm"
            />
          </div>
        </div>
        
        {flashMessage && (
          <div className={`text-sm mt-2 ${flashMessage.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
            {flashMessage}
          </div>
        )}

        {warning && (
          <div className="text-yellow-700 text-sm">
            <button
              onClick={() => setShowWarning(prev => !prev)}
              className="hover:underline"
            >
              {showWarning ? "Hide" : "Show"} warning
            </button>
            {showWarning && (
              <p className="mt-1">{warning}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
