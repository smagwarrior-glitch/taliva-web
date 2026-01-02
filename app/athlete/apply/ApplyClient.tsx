"use client";

import { useSearchParams } from "next/navigation";

export default function ApplyClient() {
  const searchParams = useSearchParams();
  const athleteId = searchParams.get("athlete");

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Apply</h1>

      <p className="text-white/70">
        Athlete ID: {athleteId ?? "not provided"}
      </p>

      {/* ادامه فرم یا لاجیک اینجا */}
    </div>
  );
}