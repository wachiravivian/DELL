import Image from "next/image";
import Link from "next/link";
import { whatsappLink } from "@/lib/site";

export default function CtaBand() {
  return (
    <section className="pb-16 lg:pb-20">
      <div className="container-site">
        <div className="flex flex-col items-center gap-8 rounded-3xl bg-olive p-8 text-white sm:p-10 lg:flex-row lg:justify-between lg:gap-12">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold sm:text-4xl">Ready to get connected?</h2>
            <p className="mt-2 text-white/90">
              Send us your details and our team will call you to arrange free installation.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/get-connected/" className="btn-sun">Get connected</Link>
              <a
                href={whatsappLink("Hello Maranet, I would like to get connected.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn border-white text-white hover:bg-white/10"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className="w-full max-w-[320px] shrink-0 animate-float overflow-hidden rounded-3xl bg-white shadow-xl motion-reduce:animate-none lg:max-w-[360px]">
            <Image
              src="/images/photos/cta-cartoon.jpg"
              alt="A smiling cartoon man at his laptop saying: Let's make this week productive together!"
              width={693}
              height={800}
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}