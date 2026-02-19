import { BorderBeam } from "@/components/magicui/border-beam";
import { GridPattern } from "@/components/magicui/grid-pattern";
import { Bot, Zap, Layout, PenTool, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
    {
        title: "ChatGPT Integration",
        description: "Draw directly within the ChatGPT interface to provide visual context.",
        icon: Bot,
        image: "/assets/D2C_ChatGPT.png",
    },
    {
        title: "Claude Support",
        description: "Seamlessly add diagrams and wireframes to your Claude conversations.",
        icon: Zap,
        image: "/assets/D2C_Claude.png",
    },
    {
        title: "Gemini Compatible",
        description: "Works perfectly with Google's Gemini models for enhanced multimodal input.",
        icon: Layout,
        image: "/assets/D2C_Gemini.png",
    },
];

export function Features() {
    return (
        <section id="features" className="container relative py-24 md:py-32 px-4 md:px-6 mx-auto overflow-hidden">
            {/* Radial Gradient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-50" />

            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center mb-16 relative z-10">
                <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                    Supercharge your AI Chat
                </h2>
                <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                    Don't just text. Show. DrawToChat brings visual communication to your LLM workflow.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 max-w-6xl mx-auto">
                {features.map((feature, idx) => (
                    <div key={feature.title} className="group relative rounded-xl bg-card border border-white/10 p-1 overflow-hidden">
                        <BorderBeam
                            size={150}
                            duration={10}
                            delay={idx * 2}
                            colorFrom="#fff"
                            colorTo="transparent"
                        />
                        <div className="relative h-full bg-card/50 backdrop-blur-xl rounded-lg p-6 flex flex-col justify-between gap-6">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="inline-flex p-2 rounded-lg bg-white/5 ring-1 ring-white/10">
                                        <feature.icon className="h-5 w-5 text-foreground" />
                                    </div>
                                    <h3 className="font-semibold text-lg text-foreground">{feature.title}</h3>
                                </div>

                                <div className="relative w-full aspect-[422/520] rounded-md overflow-hidden border border-white/5 bg-black/20">
                                    <Image
                                        src={feature.image}
                                        alt={feature.title}
                                        fill
                                        className="object-contain"
                                    />
                                </div>

                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>


                        </div>
                    </div>
                ))}
            </div>

            {/* Grid Pattern Overlay */}
            <GridPattern
                width={40}
                height={40}
                x={-1}
                y={-1}
                className="absolute inset-0 h-full w-full opacity-[0.3] -z-20 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]"
                squares={[
                    [0, 0], [1, 1], [2, 2], [3, 1], [4, 0], [5, 2]
                ]}
            />
        </section>
    );
}
