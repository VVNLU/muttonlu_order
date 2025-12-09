import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";

const Footer = () => {
  const telHref = `tel:${SITE.phone.replace(/\s+/g, '')}`;

  return (
    <footer className="border-t w-full max-w-screen-md sm:mx-auto bg-white">
      <div className="mx-auto grid grid-cols-3 p-5 sm:grid-cols-1 sm:gap-3">
        <div className="space-y-1 col-span-2 min-w-0 sm:flex sm:justify-center sm:gap-10">
          <div className="flex flex-row items-center font-medium gap-2 sm:flex-col sm:gap-0">
            <span>{SITE.storeName}</span>
            <span>{SITE.taxID}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-zinc-500 sm:text-base">地址｜點擊搜尋</span>
            <Link href={SITE.GoogleMapHref} target="_blank" className="font-medium hover:underline">
              {SITE.address}
            </Link>
          </div>
          <div className="flex flex-col">
            <div className="text-sm text-zinc-500 sm:text-base">電話｜點擊撥打</div>
            <Link href={telHref} className="font-medium hover:underline">
              {SITE.phone}
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3 justify-center sm:flex-row sm:gap-2">
          <Link href={SITE.lineHref} target="_blank"  className="inline-block">
            <Image
              src={SITE.lineIcon}
              alt="LINE icon"
              width={40}
              height={40}
              priority
            />
            </Link>
          <Link href={SITE.instagramHref} target="_blank"  className="inline-block">
            <Image
              src={SITE.instagramIcon}
              alt="instagram icon"
              width={40}
              height={40}
              priority
            />
          </Link>
          <Link href={SITE.metaHref} target="_blank"  className="inline-block">
            <Image
              src={SITE.metaIcon}
              alt="meta icon"
              width={40}
              height={40}
              priority
            />
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer