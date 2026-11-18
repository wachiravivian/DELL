import CoverageChecker from "./CoverageChecker";

export default function CoverageSection() {
  return (
    <section className="py-14 lg:py-16">
      <div className="container-site">
        <p className="eyebrow">Coverage</p>
        <h2 className="mb-8 mt-3 text-3xl font-bold sm:text-4xl">Is Maranet in your area?</h2>
        <CoverageChecker />
      </div>
    </section>
  );
}