import { motion } from "motion/react";
import { Sparkles, ArrowLeft, Shield } from "lucide-react";

interface PrivacyPageProps {
  onNavigate: (page: "home" | "privacy" | "terms" | "contact") => void;
}

const sections = [
  {
    title: "1. Information We Collect",
    content: `When you use InteriorAI, we may collect the following types of information:

• **Room Images:** Photos you upload for AI-powered redesign. These images are processed by Google Gemini's API and are not stored on our servers permanently.
• **Usage Data:** Anonymous analytics such as session duration, features used, and error logs to help us improve the service.
• **Local Storage Data:** Your saved designs are stored locally in your browser's localStorage — they never leave your device unless you explicitly download or share them.`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use the information we collect to:

• Generate AI-reimagined interior designs using Google Gemini.
• Improve the quality, performance, and features of InteriorAI.
• Diagnose technical issues and monitor service health.
• Respond to your support inquiries and feedback.

We do not sell, rent, or share your personal information with third parties for marketing purposes.`,
  },
  {
    title: "3. Third-Party Services",
    content: `InteriorAI is powered by Google Gemini, a large language and vision model. When you upload a room photo and request a redesign, the image is transmitted to Google's API under their privacy policy and terms of service.

We encourage you to review Google's Privacy Policy at https://policies.google.com/privacy for details on how they handle data submitted to their AI models.`,
  },
  {
    title: "4. Cookies & Local Storage",
    content: `InteriorAI uses browser localStorage to save your favorite designs locally on your device. We do not use tracking cookies or third-party cookies for advertising.

You can clear your saved designs at any time by deleting them within the app or clearing your browser's site data.`,
  },
  {
    title: "5. Data Security",
    content: `We implement industry-standard security measures to protect your information. All data transmitted to and from our service is encrypted using HTTPS/TLS.

However, no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee its absolute security.`,
  },
  {
    title: "6. Your Rights",
    content: `You have the right to:

• Access any personal data we hold about you.
• Request deletion of your data.
• Opt out of any optional data collection.
• Lodge a complaint with a supervisory authority if you believe your rights have been violated.

To exercise these rights, please contact us at rathodhardik0914@gmail.com.`,
  },
  {
    title: "7. Contact Us",
    content: `If you have any questions, concerns, or requests regarding this Privacy Policy, please reach out to us at:

Email: rathodhardik0914@gmail.com

We will respond to your inquiry within 5 business days.`,
  },
];

export function PrivacyPage({ onNavigate }: PrivacyPageProps) {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-neutral-900 font-sans selection:bg-black selection:text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold tracking-tight text-lg">InteriorAI</span>
          </button>
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-semibold rounded-full hover:bg-neutral-800 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="w-14 h-14 bg-neutral-100 rounded-2xl flex items-center justify-center mb-6">
            <Shield className="w-7 h-7 text-neutral-700" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-neutral-500 text-lg leading-relaxed">
            We respect your privacy and are committed to protecting any personal
            information you share with us.
          </p>
          <p className="text-sm text-neutral-400 mt-4">
            Last updated: March 30, 2026
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section, i) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="pb-10 border-b border-neutral-100 last:border-0"
            >
              <h2 className="text-xl font-bold mb-4">{section.title}</h2>
              <div className="text-neutral-600 leading-relaxed space-y-3">
                {section.content.split("\n").map((line, j) =>
                  line.trim() === "" ? null : (
                    <p key={j} className={line.startsWith("•") ? "pl-2" : ""}>
                      {line.startsWith("•") ? (
                        <>
                          <span className="text-black font-medium">•</span>
                          {line.slice(1)}
                        </>
                      ) : (
                        line
                      )}
                    </p>
                  )
                )}
              </div>
            </motion.section>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-100 py-12 mt-12 bg-neutral-50/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold tracking-tight">InteriorAI</span>
          </div>
          <p className="text-sm text-neutral-400">
            © 2026 InteriorAI. All rights reserved. Powered by Google Gemini.
          </p>
          <div className="flex gap-6 text-sm font-medium text-neutral-500">
            <button
              onClick={() => onNavigate("privacy")}
              className="hover:text-black transition-colors font-semibold text-black"
            >
              Privacy
            </button>
            <button
              onClick={() => onNavigate("terms")}
              className="hover:text-black transition-colors"
            >
              Terms
            </button>
            <button
              onClick={() => onNavigate("contact")}
              className="hover:text-black transition-colors"
            >
              Contact
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
