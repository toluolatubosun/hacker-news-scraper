import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

function Logo({ className = "" }: { className?: string }) {
    return (
        <Link href="/" className={cn("font-bold text-primary text-2xl", className)}>
            <Image src="/images/logo.svg" alt="ResonateAI" width={334} height={113} className="w-36 h-12" />
        </Link>
    );
}

export default Logo;
