import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Header() {
    return (
        <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6 mx-auto">
                <div className="flex items-center gap-2">
                    <div className="relative h-8 w-8">
                        <Image
                            src="/assets/logo.png"
                            alt="DrawToChat Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="text-lg font-bold tracking-tight">DrawToChat</span>
                </div>
                <nav className="flex items-center gap-6">
                    <Link href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                        Features
                    </Link>
                    <Button size="sm" asChild>
                        <Link href="#">Add to Chrome</Link>
                    </Button>
                </nav>
            </div>
        </header>
    );
}
