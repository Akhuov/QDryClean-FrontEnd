import { useState } from "react";
import { Copy, Check } from "lucide-react";

function CopyableCell({ value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  return (
    <div
      title="Нажмите для копирования"
      className="group flex items-center gap-2 cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        handleCopy();
      }}
    >
      <span className="font-mono text-slate-500">
        {value}
      </span>

      {/* icon */}
      <span className="opacity-0 group-hover:opacity-100 transition">
        {copied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Copy className="h-4 w-4 text-slate-400" />
        )}
      </span>
    </div>
  );
}

export default CopyableCell;