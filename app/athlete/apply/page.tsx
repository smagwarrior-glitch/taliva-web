import { Suspense } from "react";
import ApplyClient from "./ApplyClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto p-8">
          Loading...
        </div>
      }
    >
      <ApplyClient />
    </Suspense>
  );
}