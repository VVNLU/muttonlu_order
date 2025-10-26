import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";

const Footer = () => {
  const telHref = `tel:${SITE.phone.replace(/\s+/g, '')}`;

  return (
    <footer className="border-t w-full">
      <div className="mx-auto grid grid-cols-3 px-2 py-4">
        <div className="space-y-1 col-span-2 min-w-0">
          <div className="font-medium">{SITE.storeName}</div>
          <div className="text-sm text-zinc-500">地址｜點擊搜尋</div>
          <Link href={SITE.GoogleMapHref} target="_blank" className="font-medium hover:underline">
            {SITE.address}
          </Link>
          <div className="text-sm text-zinc-500">電話｜點擊撥打</div>
          <Link href={telHref} className="font-medium hover:underline">
            {SITE.phone}
          </Link>
        </div>
        <div className="flex flex-col items-end gap-3 justify-center sm:flex-row sm:items-center sm:justify-end sm:gap-2">
          <Link href={SITE.lineHref} target="_blank"  className="inline-block">
            <Image
              src={SITE.lineIcon}
              alt="LINE icon"
              width={40}
              height={40}
              className="sm:w-15 sm:h-15"
              priority
            />
            </Link>
          <Link href={SITE.instagramHref} target="_blank"  className="inline-block">
            <Image
              src={SITE.instagramIcon}
              alt="instagram icon"
              width={40}
              height={40}
              className="sm:w-15 sm:h-15"
              priority
            />
          </Link>
          <Link href={SITE.metaHref} target="_blank"  className="inline-block">
            <Image
              src={SITE.metaIcon}
              alt="meta icon"
              width={40}
              height={40}
              className="sm:w-15 sm:h-15"
              priority
            />
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer