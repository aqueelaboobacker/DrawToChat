
import { Header } from "@/components/layout/Header";

export default function Support() {
    return (
        <main className="min-h-screen bg-black text-zinc-300">
            <Header />
            <div className="container mx-auto px-4 py-32 max-w-3xl">
                <h1 className="text-4xl font-bold text-white mb-8">Support</h1>
                <div className="space-y-6 text-zinc-400">
                    <p>
                        Need help with DrawToChat? We're here to assist you.
                    </p>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">Contact Support</h2>
                        <p>
                            For any issues, bug reports, or feature requests, please email us directly:
                        </p>
                        <p className="mt-4">
                            <a href="mailto:support@drawtochat.com" className="text-2xl font-bold text-blue-400 hover:text-blue-300">
                                support@drawtochat.com
                            </a>
                        </p>
                    </section>

                    <section className="mt-12 pt-8 border-t border-zinc-800">
                        <h2 className="text-xl font-semibold text-white mb-4">Frequently Asked Questions</h2>

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium text-white">How do I verify my license?</h3>
                                <p>Click the extension icon in the toolbar, enter your key from Lemon Squeezy, and click "Activate".</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-white">Does it work on all websites?</h3>
                                <p>Currently, DrawToChat supports ChatGPT, Claude, and Google Gemini.</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
