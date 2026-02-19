
import { Header } from "@/components/layout/Header";

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-black text-zinc-300">
            <Header />
            <div className="container mx-auto px-4 py-32 max-w-3xl">
                <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
                <div className="space-y-6 text-zinc-400">
                    <p className="text-sm">Last updated: February 18, 2026</p>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">1. Overview</h2>
                        <p>
                            DrawToChat ("we", "our", or "us") respects your privacy.
                            This Privacy Policy explains how we handle your information when you use our Chrome Extension.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">2. Data Collection & Usage</h2>
                        <p>
                            <strong>We do not collect personal data or chat history.</strong>
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-2">
                            <li>
                                <strong>Drawings:</strong> Your drawings are stored locally on your device using Chrome's <code>local.storage</code> API. We do not transmit them to any server.
                            </li>
                            <li>
                                <strong>License Keys:</strong> If you purchase a Pro license, your license key is sent to Lemon Squeezy (our payment provider) strictly for verification purposes.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">3. Third-Party Services</h2>
                        <p>
                            We use <strong>Lemon Squeezy</strong> to handle payments and license verification.
                            Please refer to <a href="https://www.lemonsqueezy.com/privacy" className="text-blue-400 hover:underline">Lemon Squeezy's Privacy Policy</a> for details on how they handle payment information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">4. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@drawtochat.com" className="text-blue-400 hover:underline">support@drawtochat.com</a>.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
