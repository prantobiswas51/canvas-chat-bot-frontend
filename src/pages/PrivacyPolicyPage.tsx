import React from 'react';
import { Link } from 'react-router-dom';
import CanvasLogo from '@/components/common/CanvasLogo';
import { ArrowLeft } from 'lucide-react';

// Standalone public route (not behind PublicLayout's auth redirect, not
// behind RequireAuth) — needs to be reachable by anyone, logged in or not,
// e.g. Meta's App Review team when verifying the WhatsApp/Messenger
// integration's required Privacy Policy URL.
const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: '1. Introduction',
    body: (
      <>
        Canvas Art Supplies ("Canvas", "we", "us", or "our") operates an AI-assisted customer support system that
        communicates with customers over WhatsApp, Facebook Messenger, and Instagram (collectively, the
        "Service"). This Privacy Policy explains what information we collect when you message us through these
        channels, how we use it, and the choices you have.
      </>
    ),
  },
  {
    title: '2. Information We Collect',
    body: (
      <>
        When you message us, we may collect: your name and profile information as provided by the messaging
        platform (WhatsApp/Meta); your phone number or platform user ID; the content of your messages, including
        text, photos, and voice notes you send us; and order details you provide to complete a purchase, such as a
        delivery address and product selections.
      </>
    ),
  },
  {
    title: '3. How We Use Your Information',
    body: (
      <>
        We use this information to respond to your messages (via a human team member or an AI assistant), look up
        product availability and pricing, create and fulfill orders, and improve the quality of our support. Photos
        you send are reviewed to identify products, damage, or receipts you're asking about. Voice notes are
        transcribed to text so we can read and respond to them.
      </>
    ),
  },
  {
    title: '4. Third-Party Services',
    body: (
      <>
        To power AI-assisted replies, we send message content (including photos and voice-note transcripts) to
        third-party AI providers — OpenAI, Google (Gemini), and/or Anthropic (Claude), depending on which is
        active — solely to generate a response or transcript. These providers process the data under their own
        privacy and data-use terms. Messages themselves are delivered via Meta Platforms, Inc. (WhatsApp and
        Messenger), subject to Meta's own privacy policy.
      </>
    ),
  },
  {
    title: '5. Data Retention',
    body: (
      <>
        We retain conversation history and order records for as long as needed to provide support, fulfill orders,
        and meet our legal and accounting obligations. You may request deletion of your data at any time using the
        contact details below.
      </>
    ),
  },
  {
    title: '6. Data Sharing',
    body: (
      <>
        We do not sell your personal information. We share it only with the service providers described above
        (messaging platforms and AI providers) and with delivery/logistics partners as needed to fulfill an order.
      </>
    ),
  },
  {
    title: '7. Your Rights',
    body: (
      <>
        You may ask us what information we hold about you, request a correction, or request deletion, by contacting
        us using the details below. You can also stop messaging us at any time to end the conversation.
      </>
    ),
  },
  {
    title: "8. Children's Privacy",
    body: (
      <>
        The Service is not directed at children under 13, and we do not knowingly collect personal information from
        them.
      </>
    ),
  },
  {
    title: '9. Changes to This Policy',
    body: (
      <>
        We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated
        effective date.
      </>
    ),
  },
  {
    title: '10. Contact Us',
    body: (
      <>
        Questions about this policy or your data? Contact us at{' '}
        <a href="mailto:support@canvasdhaka.com" className="text-[#FF1E56] hover:underline">
          support@canvasdhaka.com
        </a>
        .
      </>
    ),
  },
];

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0F0F23] text-slate-300 font-sans">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
          <CanvasLogo size={40} />
        </div>

        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </Link>

        <h1 className="text-2xl font-black text-slate-100 tracking-tight mb-1">Privacy &amp; Policy</h1>
        <p className="text-xs text-slate-500 font-mono mb-10">Effective date: August 17, 2026</p>

        <div className="space-y-8">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="text-sm font-bold text-slate-100 mb-2">{section.title}</h2>
              <p className="text-sm leading-relaxed text-slate-400">{section.body}</p>
            </section>
          ))}
        </div>

        <footer className="mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-600 font-mono">
          &copy; {new Date().getFullYear()} Canvas Art Supplies Ltd. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
