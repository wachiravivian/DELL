import { site } from "@/lib/site";

export default function TopBar() {
  return (
    <div className="bg-olive text-sm text-white">
      <div className="container-site flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2.5">
<span>Free installation for new connections. Router: {site.routerPrice}</span>        
  <span>Pay via M-PESA Paybill 4121737</span>      <span className="hidden sm:inline">
          Call <a href={`tel:${site.phone}`} className="font-bold hover:underline">{site.phoneDisplay}</a>
<span className="mx-1">/</span>
<a href={`tel:${site.phoneAlt}`} className="font-bold hover:underline">{site.phoneAltDisplay}</a>
        </span>
      </div>
    </div>
  );
}