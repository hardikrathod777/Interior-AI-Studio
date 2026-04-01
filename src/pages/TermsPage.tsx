import { motion } from "motion/react";
import { Sparkles, ArrowLeft, ScrollText } from "lucide-react";

interface TermsPageProps {
  onNavigate: (page: "home" | "privacy" | "terms" | "contact") => void;
}

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using InteriorAI ("the Service"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use the Service.

These terms apply to all visitors, users, and others who access or use the Service.`,
  },
  {
    title: "2. Use of Service",
    content: `You may use InteriorAI for personal, non-commercial interior design inspiration purposes. By using the Service, you agree to:

• Upload only images you own or have rights to use.
• Not use the Service for any unlawful, harmful, or offensive purpose.
• Not attempt to reverse-engineer, hack, or interfere with the Service.
• Not use automated scripts or bots to access or interact with the Service.
• Comply with all applicable local, national, and international laws.`,
  },
  {
    title: "3. Intellectual Property",
    content: `The InteriorAI brand, logo, and all original content on this platform are the intellectual property of InteriorAI and its licensors.

AI-generated designs created from your uploaded images: You retain ownership of your original uploaded photos. The AI-generated outputs are provided for your personal use. InteriorAI does not claim ownership over your original images.

You may not reproduce, distribute, or create derivative works based on the InteriorAI platform itself without our express written permission.`,
  },
  {
    title: "4. Disclaimer of Warranties",
    content: `The Service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.

InteriorAI does not warrant that:
• The Service will be uninterrupted or error-free.
• AI-generated designs will meet your specific expectations or requirements.
• Results will be accurate, complete, or suitable for any particular use case.`,
  },
  {
    title: "5. Limitation of Liability",
    content: `To the fullest extent permitted by law, InteriorAI shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Service.

This includes but is not limited to loss of data, loss of profits, or any other economic disadvantage, even if InteriorAI has been advised of the possibility of such damages.`,
  },
  {
    title: "6. Changes to Terms",
    content: `We reserve the right to modify these Terms of Service at any time. We will provide notice of significant changes by updating the "Last updated" date at the top of this page.

Your continued use of the Service after any changes constitutes your acceptance of the new terms. We encourage you to review this page periodically.`,
  },
  {
    title: "7. Governing Law",
    content: `These Terms shall be governed by and construed in accordance with applicable law, without regard to its conflict of law provisions.

Any disputes arising under these Terms shall be resolved through binding arbitration or in the courts of competent jurisdiction.

If you have any questions about these Terms, please contact us at rathodhardik0914@gmail.com.`,
  },
];

export function TermsPage({ onNavigate }: TermsPageProps) {
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
            <ScrollText className="w-7 h-7 text-neutral-700" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-neutral-500 text-lg leading-relaxed">
            Please read these terms carefully before using InteriorAI. By using
            our service, you agree to these terms.
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
            © 2026 InteriorAI. All rights reserved. Powered by Hardik Rathod.
          </p>
          <div className="flex gap-6 text-sm font-medium text-neutral-500">
            <button
              onClick={() => onNavigate("privacy")}
              className="hover:text-black transition-colors"
            >
              Privacy
            </button>
            <button
              onClick={() => onNavigate("terms")}
              className="hover:text-black transition-colors font-semibold text-black"
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
