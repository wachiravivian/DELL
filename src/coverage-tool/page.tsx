import type { Metadata } from "next";
import CoverageTool from "@/components/CoverageTool";

export const metadata: Metadata = {
  title: "Coverage zone tool",
  robots: { index: false, follow: false },
};

export default function CoverageToolPage() {
  return (
    <main className="container-site py-8">
      <h1 className="text-3xl font-bold">Coverage zone tool</h1>
      <p className="mb-6 mt-1 text-bark-muted">For staff only. Place each fibre zone on the map, then copy the result.</p>
      <CoverageTool />
    </main>
  );
}