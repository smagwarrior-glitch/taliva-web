import { Suspense } from "react";
import SuccessClient from "./SuccessClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto p-8">
          Loading...
        </div>
      }
    >
      <SuccessClient />
    </Suspense>
  );
}