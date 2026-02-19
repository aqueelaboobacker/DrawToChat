
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export function Showcase() {
    return (
        <section className="container py-12 md:py-24 lg:py-32 px-4 md:px-6 mx-auto bg-muted/20">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        Power of Excalidraw <br /> inside your Chat
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Don't just tell AI what you want—show it. Our extension brings a full-featured whiteboard directly into your conversation.
                    </p>
                    <ul className="grid gap-3">
                        {[
                            "Full Excalidraw toolset",
                            "Instant image insertion",
                            "Edit and update drawings",
                            "Local storage privacy",
                        ].map((item) => (
                            <li key={item} className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="relative mx-auto w-full max-w-[800px] overflow-hidden rounded-xl border bg-background shadow-2xl lg:order-last">
                    <Image
                        src="/assets/excali_modal_screenshot.png"
                        alt="Excalidraw Modal Integration"
                        width={800}
                        height={600}
                        className="w-full h-auto"
                    />
                </div>
            </div>
        </section>
    );
}
