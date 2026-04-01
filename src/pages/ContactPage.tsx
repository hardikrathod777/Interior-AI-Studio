import React, { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowLeft, Mail, Clock, Send, CheckCircle, AlertCircle } from "lucide-react";

interface ContactPageProps {
  onNavigate: (page: "home" | "privacy" | "terms" | "contact") => void;
}

type FormStatus = "idle" | "sending" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  message: string;
}

const faqs = [
  {
    q: "Is InteriorAI free to use?",
    a: "Yes! InteriorAI is free to use. You just need a valid Google Gemini API key configured in the environment.",
  },
  {
    q: "Are my uploaded images stored?",
    a: "No. Your images are sent to Google Gemini for processing and are not stored permanently on our servers. Saved designs live only in your browser's local storage.",
  },
  {
    q: "What image formats are supported?",
    a: "We support PNG, JPG, and WEBP formats up to 10MB in size.",
  },
  {
    q: "How long does AI generation take?",
    a: "Design generation typically takes 10–15 seconds depending on the complexity of your room photo and the selected style.",
  },
];

export function ContactPage({ onNavigate }: ContactPageProps) {
  const [form, setForm] = useState<FormData>({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!form.message.trim()) newErrors.message = "Message is required.";
    else if (form.message.trim().length < 10)
      newErrors.message = "Message must be at least 10 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

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

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Get in Touch
          </h1>
          <p className="text-neutral-500 text-lg max-w-xl mx-auto leading-relaxed">
            We'd love to hear from you — whether it's feedback, a question, or
            just a hello.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Email Card */}
            <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center mb-4">
                <Mail className="w-5 h-5 text-neutral-700" />
              </div>
              <h3 className="font-bold text-base mb-1">Email Us</h3>
              <p className="text-neutral-500 text-sm mb-3">
                Drop us a message anytime.
              </p>
              <a
                href="mailto:rathodhardik0914@gmail.com"
                className="text-sm font-semibold text-black hover:underline"
              >
                rathodhardik0914@gmail.com
              </a>
            </div>

            {/* Response Time Card */}
            <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-5 h-5 text-neutral-700" />
              </div>
              <h3 className="font-bold text-base mb-1">Our Response Time</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                We typically respond within{" "}
                <span className="font-semibold text-neutral-700">24 hours</span>{" "}
                on business days.
              </p>
            </div>

            {/* Powered by */}
            <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-6">
              <p className="text-xs text-neutral-400 leading-relaxed">
                InteriorAI is powered by{" "}
                <span className="font-semibold text-neutral-600">
                  Hardik Rathod
                </span>
                . For API or model-related inquiries, please also refer to{" "}
                <a
                  href="https://ai.google.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-black transition-colors"
                >
                  Google AI Studio
                </a>
                .
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-3"
          >
            <div className="bg-white border border-neutral-100 rounded-3xl p-8 shadow-sm">
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Message sent successfully!
                  </h3>
                  <p className="text-neutral-500 text-sm mb-6">
                    Your message was sent successfully. We will receive it at
                    rathodhardik0914@gmail.com and reply as soon as possible.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-full hover:bg-neutral-800 transition-all"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <h2 className="text-xl font-bold mb-6">Send a Message</h2>

                  {/* Name */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-neutral-700"
                    >
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Jane Smith"
                      className={`w-full px-4 py-3 rounded-xl border text-sm bg-neutral-50 focus:bg-white focus:outline-none transition-all ${
                        errors.name
                          ? "border-red-300 focus:border-red-400"
                          : "border-neutral-200 focus:border-neutral-400"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-neutral-700"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      className={`w-full px-4 py-3 rounded-xl border text-sm bg-neutral-50 focus:bg-white focus:outline-none transition-all ${
                        errors.email
                          ? "border-red-300 focus:border-red-400"
                          : "border-neutral-200 focus:border-neutral-400"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-neutral-700"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us what's on your mind..."
                      className={`w-full px-4 py-3 rounded-xl border text-sm bg-neutral-50 focus:bg-white focus:outline-none transition-all resize-none ${
                        errors.message
                          ? "border-red-300 focus:border-red-400"
                          : "border-neutral-200 focus:border-neutral-400"
                      }`}
                    />
                    {errors.message && (
                      <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {status === "error" && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                      Something went wrong. Please try again.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-black text-white font-semibold rounded-full hover:bg-neutral-800 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === "sending" ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-20"
        >
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            <div className="h-px flex-1 bg-neutral-100" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.07 }}
                className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm"
              >
                <h3 className="font-semibold text-sm mb-2">{faq.q}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-100 py-12 mt-24 bg-neutral-50/50">
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
              className="hover:text-black transition-colors"
            >
              Terms
            </button>
            <button
              onClick={() => onNavigate("contact")}
              className="hover:text-black transition-colors font-semibold text-black"
            >
              Contact
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
