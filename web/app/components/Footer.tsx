import React from "react";

export default function Footer() {
  return (
    <footer className="mt-auto py-3 text-center text-sm text-gray-500 border-t border-border p-4">
      <div className="flex justify-between items-center space-x-4">
        <a
          href="https://github.com/rcdilorenzo/sheets"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors duration-200"
        >
          Made with ♥ using Python, Next.js, ChordPro, Chrome, and Claude 3.5 Sonnet
        </a>
        <a
          href="https://www.paypal.com/donate/?business=ZLCRZSPTPZZUN&no_recurring=0&item_name=Thanks+for+building+useful+tools+for+me%21&currency_code=USD"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors duration-200"
        >
          Donate $2
        </a>
      </div>
    </footer>
  );
}
