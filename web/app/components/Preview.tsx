import React, { useRef, useEffect } from "react";

interface PreviewProps {
  activeTab: "html" | "pdf";
  setActiveTab: (tab: "html" | "pdf") => void;
  generatedHtml: string;
  generatedPdfUrl: string;
  downloadContent: () => void;
}

export default function Preview({
  activeTab,
  setActiveTab,
  generatedHtml,
  generatedPdfUrl,
  downloadContent,
}: PreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (activeTab === 'html' && iframeRef.current && generatedHtml) {
      const iframeDoc = iframeRef.current.contentDocument;
      // Remove any external stylesheet links from the generated HTML
      const cleanedHtml = generatedHtml.replace(/<link[^>]*>/g, '');
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(`
          <html>
            <head>
              <style>
                body {
                  column-count: 1;
                  column-gap: .5em;
                  column-fill: balance;
                  width: 800px;
                  margin: 0;
                  padding: 10px;
                  box-sizing: border-box;
                  transform-origin: top left;
                }
              </style>
            </head>
            <body>${cleanedHtml}</body>
          </html>
        `);
        iframeDoc.close();

        // Scale the content
        const scaleContent = () => {
          const iframe = iframeRef.current;
          if (iframe) {
            const scale = iframe.clientWidth / 800;
            const iframeBody = iframe.contentDocument?.body;
            if (iframeBody) {
              iframeBody.style.transform = `scale(${scale})`;
              iframe.style.height = `${iframeBody.scrollHeight * scale}px`;
            }
          }
        };

        scaleContent();
        window.addEventListener('resize', scaleContent);
        return () => window.removeEventListener('resize', scaleContent);
      }
    }
  }, [generatedHtml, activeTab]);

  return (
    <div className="w-full md:w-1/2 p-4 md:border-l border-border flex flex-col">
      <div className="flex justify-between items-end mb-4">
        <div className="flex">
          <button
            className={`px-4 py-2 ${activeTab === 'html' ? 'bg-primary text-white' : 'bg-gray-100 text-primary'} rounded-tl-md rounded-bl-md`}
            onClick={() => setActiveTab('html')}
          >
            HTML
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'pdf' ? 'bg-primary text-white' : 'bg-gray-100 text-primary'} rounded-tr-md rounded-br-md`}
            onClick={() => setActiveTab('pdf')}
          >
            PDF
          </button>
        </div>
        <button
          onClick={downloadContent}
          className="text-primary hover:text-primary-hover transition-colors duration-200 mb-1"
          disabled={!generatedHtml && !generatedPdfUrl}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="sr-only">Download {activeTab.toUpperCase()}</span>
        </button>
      </div>
      <div className="flex-1 border border-border rounded-md overflow-hidden min-h-[300px]">
        {activeTab === 'html' && (
          generatedHtml ? (
            <iframe
              ref={iframeRef}
              className="w-full h-full min-h-[300px]"
              title="Generated HTML Content"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              HTML preview will appear here
            </div>
          )
        )}
        {activeTab === 'pdf' && (
          generatedPdfUrl ? (
            <iframe
              src={generatedPdfUrl}
              className="w-full h-full"
              title="Generated PDF Content"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              PDF preview will appear here
            </div>
          )
        )}
      </div>
    </div>
  );
}
