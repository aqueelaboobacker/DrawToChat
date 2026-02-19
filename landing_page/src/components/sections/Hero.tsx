
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, PenTool } from "lucide-react";

export function Hero() {
    return (
        <section className="relative flex flex-col items-center justify-center py-24 text-center lg:py-32 overflow-hidden">
            <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>

            <div className="container px-4 md:px-6">
                <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4">
                    <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium">
                        <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                        v1.0 is now available
                    </div>
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                        Draw directly in <br className="hidden sm:inline" />
                        ChatGPT, Claude & Gemini
                    </h1>
                    <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Enhance your AI conversations with visual context. seamless integration with Excalidraw to sketch diagrams, wireframes, and ideas instantly.
                    </p>
                    <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
                        <Button size="lg" className="h-12 px-8 text-base" asChild>
                            <Link href="#">
                                Add to Chrome <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
                            <Link href="#features">
                                How it works <PenTool className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
