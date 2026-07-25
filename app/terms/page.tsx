import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = { title: "Terms of Service | Practice Sheet" };

export default function Terms() {
  return (
    <main>
      <Navbar />
      <section className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <p className="text-sm text-slate-500 mt-2">Last updated: [DATE]</p>

        <div className="mt-6 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 text-sm">
          <strong>Template notice:</strong> this is a generic starting draft, not legal advice.
          Have a lawyer review and customize it — especially the sections on refunds, liability,
          and children's use — before relying on it for a live product with real customers.
        </div>

        <div className="prose prose-slate mt-6 text-slate-700 space-y-5 leading-relaxed text-sm">
          <div>
            <h2 className="font-semibold text-slate-900 text-base">1. Acceptance of terms</h2>
            <p>By creating an account or using Practice Sheet ("the Service"), you agree to these Terms of Service.</p>
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 text-base">2. Accounts</h2>
            <p>You must provide accurate information when creating an account. You are responsible for keeping your password secure and for all activity under your account.</p>
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 text-base">3. Who can create an account</h2>
            <p>The Service is intended to be used by adults (teachers, parents, and other educators) on behalf of students. We do not knowingly collect personal information directly from children under 13. If you believe a child has created an account without appropriate consent, contact us and we will remove it.</p>
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 text-base">4. Free trial and subscriptions</h2>
            <p>New accounts receive a free trial period, after which continued access requires an active paid subscription (monthly or yearly, as selected). Subscriptions renew automatically until cancelled. You can cancel anytime from your account's billing portal; cancellation takes effect at the end of the current billing period.</p>
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 text-base">5. Refunds</h2>
            <p>[Define your refund policy here — e.g., "Refunds are available within 14 days of a charge upon request" or "All sales are final." This is a business decision, not a legal one, but should be stated clearly.]</p>
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 text-base">6. Acceptable use</h2>
            <p>You agree not to misuse the Service — including attempting to circumvent access controls, reselling generated content commercially without permission, or using the Service for any unlawful purpose.</p>
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 text-base">7. Content accuracy</h2>
            <p>We take care to generate accurate worksheet content and verified answer keys, but the Service is provided without warranty of any kind. Always have a qualified educator review material before formal use.</p>
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 text-base">8. Limitation of liability</h2>
            <p>To the maximum extent permitted by law, Practice Sheet is not liable for indirect, incidental, or consequential damages arising from use of the Service.</p>
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 text-base">9. Changes</h2>
            <p>We may update these terms from time to time. Continued use of the Service after changes constitutes acceptance of the new terms.</p>
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 text-base">10. Contact</h2>
            <p>Questions about these terms: see our <a href="/contact" className="underline">Contact page</a>.</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
