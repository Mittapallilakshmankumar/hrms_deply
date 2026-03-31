import { ArrowLeft } from "lucide-react";

import { clearAuthTokens } from "./appCore";

export default function BackToHRButton() {
  const goBackToHR = () => {
    clearAuthTokens();
    window.location.assign("/");
  };

  return (
    <button
      type="button"
      onClick={goBackToHR}
      className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-blue-700 shadow-sm transition hover:bg-blue-50 hover:text-blue-800"
    >
      <ArrowLeft size={16} />
      <span>Back to HR Portal</span>
    </button>
  );
}
