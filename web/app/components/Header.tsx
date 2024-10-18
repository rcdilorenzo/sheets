import Image from "next/image";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 border-b border-border">
      <h1 className="text-primary text-2xl font-bold">Music Sheet Generator</h1>
      <div className="flex items-center gap-4">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.redeemernc.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          redeemernc.org →
        </a>
      </div>
    </header>
  );
}
