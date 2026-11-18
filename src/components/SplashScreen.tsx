import LogoMark from "./LogoMark";

export default function SplashScreen() {
  return (
    <div
      aria-hidden
      className="splash fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-cream"
    >
      <LogoMark animated className="w-40 sm:w-52" />
      <p className="font-display text-xl font-bold text-olive">The People’s net</p>
      <div className="h-1.5 w-40 overflow-hidden rounded-full bg-sand">
        <div className="splash-bar h-full rounded-full bg-sun" />
      </div>
    </div>
  );
}