
import Link from "next/link";
import { Github } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0 px-4 md:px-6 mx-auto">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built by{" "}
                        <a
                            href="#"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium underline underline-offset-4"
                        >
                            DrawToChat
                        </a>
                        .
                    </p>
                </div>
                <div className="flex items-center gap-6">
                    <Link href="/privacy" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                        Privacy Policy
                    </Link>
                    <Link href="/support" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                        Support
                    </Link>
                    <Link href="#" className="text-muted-foreground hover:text-foreground">
                        <Github className="h-5 w-5" />
                    </Link>
                </div>
            </div>
        </footer>
    );
}
