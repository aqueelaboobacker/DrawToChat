import { BorderBeam } from "@/components/magicui/border-beam";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Pricing() {
    return (
        <section id="pricing" className="container relative py-24 md:py-32 px-4 md:px-6 mx-auto overflow-hidden">
            {/* Radial Gradient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-50" />

            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center mb-16 relative z-10">
                <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                    Simple, transparent pricing
                </h2>
                <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                    Get full access to all features with a one-time payment. No subscriptions, no hidden fees.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 w-full max-w-4xl mx-auto mt-8">
                {/* Free Tier Card */}
                <div className="group relative rounded-xl bg-card border border-white/10 p-1 overflow-hidden w-full transition-colors hover:bg-white/[0.02]">
                    <div className="relative h-full bg-card/50 backdrop-blur-xl rounded-lg p-8 flex flex-col gap-8">
                        <div className="flex flex-col gap-2 text-center">
                            <h3 className="text-2xl font-bold text-foreground">Free Starter</h3>
                            <div className="flex items-center justify-center gap-2 mt-4 h-[60px]">
                                <span className="text-5xl font-bold tracking-tight text-white">$0</span>
                            </div>
                            <p className="text-muted-foreground mt-2">Try it out before you commit</p>
                        </div>

                        <div className="flex flex-col gap-4 flex-1 mt-4">
                            <ul className="flex flex-col gap-4">
                                {[
                                    "3 free drawings",
                                    "Direct integration with ChatGPT",
                                    "Direct integration with Claude",
                                    "Direct integration with Gemini",
                                ].map((feature) => (
                                    <li key={feature} className="flex items-center gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-muted-foreground shrink-0" />
                                        <span className="text-muted-foreground text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-6">
                            <Button variant="outline" size="lg" className="w-full text-base h-12 border-white/20 hover:bg-white/10" asChild>
                                <Link href="#">
                                    Add to Chrome - Free
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Lifetime Deal Card */}
                <div className="group relative rounded-xl bg-card border border-white/10 p-1 overflow-hidden w-full">
                    <BorderBeam
                        size={150}
                        duration={10}
                        delay={0}
                        colorFrom="#fff"
                        colorTo="transparent"
                    />
                    <div className="relative h-full bg-card/50 backdrop-blur-xl rounded-lg p-8 flex flex-col gap-8">
                        <div className="flex flex-col gap-2 text-center">
                            <h3 className="text-2xl font-bold text-foreground">Lifetime Deal</h3>
                            <div className="flex items-center justify-center gap-2 mt-4 h-[60px]">
                                <span className="text-5xl font-bold tracking-tight text-white">$9.99</span>
                                <span className="text-sm font-medium text-muted-foreground uppercase bg-white/10 px-2 py-1 rounded-md">
                                    LTD
                                </span>
                            </div>
                            <p className="text-muted-foreground mt-2">One-time payment for full access</p>
                        </div>

                        <div className="flex flex-col gap-4 flex-1 mt-4">
                            <ul className="flex flex-col gap-4">
                                {[
                                    "Unlimited drawing and diagramming",
                                    "Direct integration with ChatGPT",
                                    "Direct integration with Claude",
                                    "Direct integration with Gemini",
                                    "All future updates included",
                                ].map((feature) => (
                                    <li key={feature} className="flex items-center gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                        <span className="text-muted-foreground text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-6">
                            <Button size="lg" className="w-full text-base h-12" asChild>
                                <Link href="https://checkout.dodopayments.com/buy/pdt_0NYpmj94TWF3jzjlAgZfp?quantity=1">
                                    Get Full Access
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
