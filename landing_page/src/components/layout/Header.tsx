import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

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

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                        Features
                    </Link>
                    <Link href="#pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                        Pricing
                    </Link>
                    <Button size="sm" asChild>
                        <Link href="#">Add to Chrome</Link>
                    </Button>
                </nav>

                {/* Mobile Navigation */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-white/10">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                            <nav className="flex flex-col gap-4 mt-8 px-6 pb-6">
                                <SheetClose asChild>
                                    <Link href="#features" className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground">
                                        Features
                                    </Link>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Link href="#pricing" className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground">
                                        Pricing
                                    </Link>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Button size="lg" className="w-full mt-4" asChild>
                                        <Link href="#">Add to Chrome</Link>
                                    </Button>
                                </SheetClose>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
