"use client";

import { useState } from "react";
import InvestModal from "../../components/InvestModal";

export default function InvestorAthletesPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Available Athletes</h1>

      <div className="rounded-xl border p-6 max-w-md">
        <h2 className="text-lg font-semibold">Sample Athlete</h2>
        <p className="mt-1 text-sm opacity-70">Football • Tehran • TALIVA Score 84</p>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 rounded-lg bg-green-500 px-6 py-3 text-white"
        >
          Invest (Demo)
        </button>
      </div>

      <InvestModal
        open={open}
        onClose={() => setOpen(false)}
        lang="en"
        athleteName="Sample Athlete"
      />
    </div>
  );
}