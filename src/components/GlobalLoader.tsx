"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export function GlobalLoader() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const originalFetch = window.fetch;
    let activeRequests = 0;

    window.fetch = async (...args) => {
      activeRequests++;
      setIsLoading(true);
      try {
        const response = await originalFetch(...args);
        return response;
      } finally {
        activeRequests--;
        if (activeRequests === 0) {
          setIsLoading(false);
        }
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white p-4 rounded-xl shadow-xl flex items-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
        <span className="font-medium text-slate-700">Processing...</span>
      </div>
    </div>
  );
}
