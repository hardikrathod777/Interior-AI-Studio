/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useEffect } from "react";
import { Upload, Image as ImageIcon, Sparkles, RefreshCcw, Heart, Trash2, Download } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CompareSlider } from "./components/CompareSlider";
import { StyleCarousel } from "./components/StyleCarousel";
import { ChatInterface } from "./components/ChatInterface";
import { DesignStyle, generateReimaginedImage } from "./services/geminiService";
import { cn, deleteCookie, getCookie, setCookie, truncateText } from "./lib/utils";
import { PrivacyPage } from "./pages/PrivacyPage";
import { TermsPage } from "./pages/TermsPage";
import { ContactPage } from "./pages/ContactPage";

type PageType = "home" | "privacy" | "terms" | "contact";

interface SavedDesign {
  id: string;
  original: string;
  reimagined: string;
  styleName: string;
  timestamp: number;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [reimaginedImage, setReimaginedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<DesignStyle | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(true);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");

  const navigate = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Load saved designs from localStorage on mount
  useEffect(() => {
    const loadDesigns = async () => {
      try {
        setIsLoadingGallery(true);
        // Artificial delay to show loading state as requested
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const saved = localStorage.getItem("interior_ai_saved_designs");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              setSavedDesigns(parsed);
            }
          } catch (e) {
            console.error("Failed to parse saved designs", e);
          }
        }
      } catch (err) {
        console.error("Error loading designs:", err);
      } finally {
        setIsLoadingGallery(false);
      }
    };

    const storedApiKey = getCookie("geminiApiKey");
    setApiKey(storedApiKey);
    setShowApiKeyModal(!storedApiKey);

    loadDesigns();
  }, []);

  // Save designs to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("interior_ai_saved_designs", JSON.stringify(savedDesigns));
    } catch (err) {
      console.error("Error saving to localStorage:", err);
    }
  }, [savedDesigns]);

  if (currentPage === "privacy") return <PrivacyPage onNavigate={navigate} />;
  if (currentPage === "terms") return <TermsPage onNavigate={navigate} />;
  if (currentPage === "contact") return <ContactPage onNavigate={navigate} />;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setReimaginedImage(null);
        setSelectedStyle(null);
        setError(null);
      };
      reader.onerror = () => {
        setError("Failed to read file. Please try again.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStyleSelect = async (style: DesignStyle) => {
    if (!originalImage || isGenerating) return;
    if (!apiKey) {
      setError("Please add your Gemini API key before generating a design.");
      setShowApiKeyModal(true);
      return;
    }

    setSelectedStyle(style);
    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateReimaginedImage(originalImage, style.prompt);
      setReimaginedImage(result);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : String(err);
      setError(message || "Failed to reimagine your space. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveDesign = () => {
    if (!originalImage || !reimaginedImage || !selectedStyle) return;

    // Fallback for crypto.randomUUID if not in secure context
    const id = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const newDesign: SavedDesign = {
      id,
      original: originalImage,
      reimagined: reimaginedImage,
      styleName: selectedStyle.name,
      timestamp: Date.now(),
    };

    setSavedDesigns((prev) => [newDesign, ...prev]);
  };

  const deleteDesign = (id: string) => {
    setSavedDesigns((prev) => prev.filter((d) => d.id !== id));
  };

  const downloadDesign = (dataUrl: string, name: string) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${name.toLowerCase().replace(/\s+/g, "-")}-design.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-neutral-900 font-sans selection:bg-black selection:text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold tracking-tight text-lg">InteriorAI</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#gallery" className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-full hover:bg-neutral-800 transition-all shadow-sm">
              Gallery
            </a>
            <button
              onClick={() => setShowApiKeyModal(true)}
              className="px-4 py-2 bg-white text-neutral-900 text-sm font-semibold rounded-full border border-neutral-200 hover:bg-neutral-100 transition-all shadow-sm"
            >
              API Key
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {showApiKeyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
            <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">
                    {apiKey ? "Manage Gemini API Key" : "Add your Gemini API Key"}
                  </h2>
                  <p className="text-sm text-neutral-500 mt-2">
                    Your Gemini key is stored in cookies so the app can keep working across visits.
                  </p>
                </div>
                {apiKey && (
                  <button
                    onClick={() => setShowApiKeyModal(false)}
                    className="text-neutral-500 hover:text-neutral-900"
                    aria-label="Close API key modal"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="api-key" className="text-sm font-medium text-neutral-900">
                    Gemini API Key
                  </label>
                  <input
                    id="api-key"
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder={apiKey ? "Enter a new key to replace the existing one" : "Paste your Gemini API key here"}
                    className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                  />
                  <p className="text-xs text-neutral-500">
                    Don&apos;t have a key? Create one on the Gemini API dashboard.
                  </p>
                  <a
                    href="https://console.cloud.google.com/apis/credentials"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-black hover:text-neutral-700"
                  >
                    Open Gemini API dashboard
                  </a>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                  {apiKey && (
                    <button
                      onClick={() => {
                        deleteCookie("geminiApiKey");
                        setApiKey(null);
                        setApiKeyInput("");
                        setShowApiKeyModal(true);
                        setError(null);
                      }}
                      className="w-full sm:w-auto px-5 py-3 rounded-full border border-red-200 bg-red-50 text-red-700 font-semibold hover:bg-red-100 transition-all"
                    >
                      Delete API Key
                    </button>
                  )}
                  {apiKey && (
                    <button
                      onClick={() => {
                        setShowApiKeyModal(false);
                        setApiKeyInput("");
                      }}
                      className="w-full sm:w-auto px-5 py-3 rounded-full bg-neutral-100 text-neutral-800 font-semibold hover:bg-neutral-200 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (!apiKeyInput.trim()) {
                        setError("Please enter a valid Gemini API key.");
                        return;
                      }
                      setCookie("geminiApiKey", apiKeyInput.trim());
                      setApiKey(apiKeyInput.trim());
                      setApiKeyInput("");
                      setShowApiKeyModal(false);
                      setError(null);
                    }}
                    className="w-full sm:w-auto px-5 py-3 rounded-full bg-black text-white font-semibold hover:bg-neutral-800 transition-all"
                  >
                    Save API Key
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold tracking-tight mb-6"
          >
            Reimagine your space <br />
            <span className="text-neutral-400 italic font-serif">in seconds.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-neutral-500 max-w-2xl mx-auto"
          >
            Upload a photo of your room and let our AI Interior Consultant transform it into your dream style.
          </motion.p>
        </div>

        {/* Main Workspace */}
        <div className="grid grid-cols-1 gap-12">
          {/* Upload & Preview Area */}
          <section className="space-y-8">
            {!originalImage ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-neutral-200 rounded-3xl bg-neutral-50 hover:bg-neutral-100 hover:border-neutral-300 transition-all cursor-pointer overflow-hidden">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-neutral-400" />
                    </div>
                    <p className="text-sm font-semibold text-neutral-700">Click to upload room photo</p>
                    <p className="text-xs text-neutral-400 mt-1">PNG, JPG or WEBP (max. 10MB)</p>
                  </div>
                  <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                </label>
              </motion.div>
            ) : (
              <div className="space-y-8">
                {/* Comparison Tool */}
                <div className="relative">
                  <AnimatePresence mode="wait">
                    {reimaginedImage ? (
                      <motion.div
                        key="compare"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                      >
                        <CompareSlider 
                          original={originalImage} 
                          reimagined={reimaginedImage} 
                        />
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={saveDesign}
                            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-neutral-800 transition-all shadow-md group"
                          >
                            <Heart className="w-4 h-4 group-hover:fill-white transition-all" />
                            Save Design
                          </button>
                          <button
                            onClick={() => downloadDesign(reimaginedImage, selectedStyle?.name || "reimagined")}
                            className="flex items-center gap-2 px-6 py-3 bg-white border border-neutral-200 text-neutral-700 rounded-full font-semibold hover:bg-neutral-50 transition-all shadow-sm"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="preview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative aspect-video rounded-3xl overflow-hidden border border-neutral-200 bg-neutral-100"
                      >
                        <img 
                          src={originalImage} 
                          alt="Original" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {isGenerating && (
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                            <RefreshCcw className="w-10 h-10 animate-spin mb-4" />
                            <p className="font-medium">Reimagining your space...</p>
                            <p className="text-xs opacity-70 mt-1">This usually takes 10-15 seconds</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button 
                    onClick={() => {
                      setOriginalImage(null);
                      setReimaginedImage(null);
                      setSelectedStyle(null);
                    }}
                    className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all"
                  >
                    <RefreshCcw className="w-4 h-4 text-neutral-600" />
                  </button>
                </div>

                {/* Style Selection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      Choose a Style
                    </h2>
                    {selectedStyle && (
                      <span className="text-xs font-medium text-neutral-400">
                        Selected: {selectedStyle.name}
                      </span>
                    )}
                  </div>
                  <StyleCarousel 
                    selectedStyleId={selectedStyle?.id || null}
                    onSelectStyle={handleStyleSelect}
                    disabled={isGenerating}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                {truncateText(error, 120)}
              </div>
            )}
          </section>

          {/* Chat Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 px-2">
              <h2 className="text-lg font-bold">Refine with AI</h2>
              <div className="h-px flex-1 bg-neutral-100" />
            </div>
            <ChatInterface currentImage={reimaginedImage || originalImage || undefined} />
          </section>

          {/* Saved Designs Gallery */}
          <section id="gallery" className="scroll-mt-24 pt-12 border-t border-neutral-100">
            <div className="flex items-center justify-between px-2 mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Heart className="w-6 h-6 fill-black" />
                Saved Designs
              </h2>
              {!isLoadingGallery && savedDesigns.length > 0 && (
                <p className="text-sm text-neutral-400">{savedDesigns.length} items</p>
              )}
            </div>

            <AnimatePresence mode="wait">
              {isLoadingGallery ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-neutral-50 rounded-2xl aspect-video animate-pulse border border-neutral-100" />
                  ))}
                </motion.div>
              ) : savedDesigns.length > 0 ? (
                <motion.div 
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {savedDesigns.map((design) => (
                    <motion.div 
                      key={design.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group relative bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <img 
                          src={design.reimagined} 
                          alt={design.styleName} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <button 
                            onClick={() => {
                              setOriginalImage(design.original);
                              setReimaginedImage(design.reimagined);
                              setSelectedStyle({ id: "saved", name: design.styleName, description: "", prompt: "" });
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="p-2 bg-white rounded-full text-black hover:scale-110 transition-transform"
                            title="View Design"
                          >
                            <ImageIcon className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => downloadDesign(design.reimagined, design.styleName)}
                            className="p-2 bg-white rounded-full text-black hover:scale-110 transition-transform"
                            title="Download"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => deleteDesign(design.id)}
                            className="p-2 bg-white rounded-full text-red-500 hover:scale-110 transition-transform"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-sm">{design.styleName}</h3>
                          <p className="text-[10px] text-neutral-400">
                            {new Date(design.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-20 bg-neutral-50 rounded-3xl border border-dashed border-neutral-200"
                >
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <Heart className="w-6 h-6 text-neutral-300" />
                  </div>
                  <p className="text-sm font-medium text-neutral-500">No saved designs yet.</p>
                  <p className="text-xs text-neutral-400 mt-1">Your favorite reimagined spaces will appear here.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
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
            <button onClick={() => navigate("privacy")} className="hover:text-black transition-colors">Privacy</button>
            <button onClick={() => navigate("terms")} className="hover:text-black transition-colors">Terms</button>
            <button onClick={() => navigate("contact")} className="hover:text-black transition-colors">Contact</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
