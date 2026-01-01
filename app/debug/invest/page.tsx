import InvestCTA from "../../components/InvestCTA";

export default function DebugInvestPage() {
  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="text-2xl font-extrabold text-white">Debug Invest Modal</h1>
      <p className="mt-2 text-white/70">
        If the modal opens here, your components are fine. Then we فقط باید وصلش کنیم به صفحه Athlete.
      </p>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="text-white/80">Athlete:</div>
        <div className="mt-1 text-lg font-bold text-white">Sample Athlete</div>

        <InvestCTA lang="en" athleteName="Sample Athlete" />
      </div>
    </main>
  );
}