"use client";
import { useState } from "react";
import Header from "./components/Header";
import Editor from "./components/Editor";
import Preview from "./components/Preview";
import Footer from "./components/Footer";

export default function Home() {
  const [chordProText, setChordProText] = useState("");
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState("");
  const [activeTab, setActiveTab] = useState<"html" | "pdf">("html");
  const [warning, setWarning] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const [transposeAmount, setTransposeAmount] = useState(0);

  const generateContent = async () => {
    try {
      setFlashMessage(null);
      setWarning(null); // Clear warning
      setShowWarning(false);

      // Generate HTML
      const htmlResponse = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: chordProText, transpose: transposeAmount, type: "html" }),
      });

      if (htmlResponse.status === 429) {
        setFlashMessage("Rate limit exceeded. Please try again later.");
        setShowWarning(false);
        return;
      }

      const htmlResult = await htmlResponse.json();
      setGeneratedHtml(htmlResult.html);
      if (htmlResult.error) {
        setWarning(htmlResult.error);
        setShowWarning(true);
      } else {
        setWarning(null);
        setShowWarning(false);
      }

      // Generate PDF
      const pdfResponse = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: chordProText, transpose: transposeAmount, type: "pdf" }),
      });

      if (pdfResponse.status === 429) {
        setFlashMessage("Rate limit exceeded. Please try again later.");
        return;
      }

      const pdfBlob = await pdfResponse.blob();
      const pdfUrl = window.URL.createObjectURL(pdfBlob);
      setGeneratedPdfUrl(pdfUrl);
    } catch (error) {
      console.error("Error generating content:", error);
      setFlashMessage("An error occurred while generating content.");
      setWarning(null); // Clear warning in case of error
      setShowWarning(false);
    }
  };

  const loadExample = () => {
    setWarning(null); // Clear warning
    setShowWarning(false);
    fetch('https://raw.githubusercontent.com/rcdilorenzo/sheets/refs/heads/main/tests/data/we-three-kings.chordpro')
      .then(response => response.text())
      .then(data => {
        setChordProText(data);
        setFlashMessage("Example loaded successfully!");
        setTimeout(() => setFlashMessage(null), 3000); // Clear message after 3 seconds
      })
      .catch(error => {
        console.error('Error loading example ChordPro:', error);
        setFlashMessage("Failed to load example. Please try again.");
      });
  };

  const extractTitle = (chordProContent: string): string => {
    const titleMatch = chordProContent.match(/^\s*{title:\s*(.+?)\s*}/m);
    return titleMatch ? titleMatch[1].trim() : 'sheet';
  };

  const downloadContent = () => {
    const fileName = extractTitle(chordProText);
    if (activeTab === 'html' && generatedHtml) {
      const blob = new Blob([generatedHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.html`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (activeTab === 'pdf' && generatedPdfUrl) {
      const a = document.createElement('a');
      a.href = generatedPdfUrl;
      a.download = `${fileName}.pdf`;
      a.click();
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)]">
      <Header />
      
      <main className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <Editor
          chordProText={chordProText}
          setChordProText={setChordProText}
          transposeAmount={transposeAmount}
          setTransposeAmount={setTransposeAmount}
          generateContent={generateContent}
          loadExample={loadExample}
          flashMessage={flashMessage}
          warning={warning}
          showWarning={showWarning}
          setShowWarning={setShowWarning}
        />
        <Preview
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          generatedHtml={generatedHtml}
          generatedPdfUrl={generatedPdfUrl}
          downloadContent={downloadContent}
        />
      </main>
      <Footer />
    </div>
  );
}
