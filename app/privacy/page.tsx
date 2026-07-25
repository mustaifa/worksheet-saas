import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = { title: "Privacy Policy | Practice Sheet" };

export default function Privacy() {
  return (
    <main>
      <Navbar />
      <section className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mt-2">Last updated: [DATE]</p>

        <div className="mt-6 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 text-sm">
          <strong>Template notice:</strong> this is a generic starting draft, not legal advice.
          Privacy law varies by where your users are located (e.g. GDPR in the EU, COPPA and
          state laws in the US) — have a lawyer review this before relying on it, particularly
          given the Service is used in an educational context.
        </div>

        <div className="prose prose-slate mt-6 text-slate-700 space-y-5 leading-relaxed text-sm">
          <div>
            <h2 className="font-semibold text-slate-900 text-base">What we collect</h2>
            <p>When you create an account: your name, email address, and a securely hashed password (we never store your plain-text password). When you subscribe: billing is handled entirely by Stripe — we never see or store your card details.</p>
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 text-base">Worksheet content</h2>
            <p>Worksheets are generated on the fly in your browser or on our server; we do not currently retain a history of what you've generated unless a "saved worksheets" feature is explicitly enabled and used.</p>
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 text-base">Children's privacy</h2>
            <p>Practice Sheet is designed for use by adults (teachers and parents) on behalf of students. We do not knowingly collect personal information directly from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us so we can delete it.</p>
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 text-base">How we use your information</h2>
            <p>To operate your account, process subscriptions, send trial/billing-related emails, and respond to support requests. We do not sell your personal information.</p>
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 text-base">Third-party services we use</h2>
            <p>Stripe (payments), Resend (transactional email), and our hosting/database providers. Each processes data under their own privacy policies.</p>
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 text-base">Your rights</h2>
            <p>You can request access to, correction of, or deletion of your personal data at any time by contacting us.</p>
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 text-base">Contact</h2>
            <p>Questions about this policy: see our <a href="/contact" className="underline">Contact page</a>.</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
