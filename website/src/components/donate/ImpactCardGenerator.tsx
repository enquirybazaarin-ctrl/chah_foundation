"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  Award, 
  Gift, 
  Heart, 
  Smartphone, 
  Square, 
  FileText, 
  Eye, 
  EyeOff, 
  RefreshCw,
  ExternalLink,
  Camera
} from "lucide-react";

export type CardTemplateType = "CELEBRATION" | "IMPACT" | "GRATITUDE_CERTIFICATE";
export type CardFormat = "STORY_9_16" | "FEED_1_1" | "A4_PRINT";

interface ImpactCardGeneratorProps {
  donorName?: string;
  amount?: number;
  occasion?: string;
  dedicationName?: string;
  dedicationMessage?: string;
  causeTitle?: string;
  donationNumber?: string;
  campaignUrl?: string;
}

export function ImpactCardGenerator({
  donorName = "Aarav Sharma",
  amount = 1000,
  occasion = "Birthday",
  dedicationName = "",
  dedicationMessage = "",
  causeTitle = "Child Nutrition & Healthcare",
  donationNumber = "CHAH-" + Math.floor(100000 + Math.random() * 900000),
  campaignUrl
}: ImpactCardGeneratorProps) {
  const [template, setTemplate] = useState<CardTemplateType>(
    occasion ? "CELEBRATION" : "IMPACT"
  );
  const [format, setFormat] = useState<CardFormat>("FEED_1_1");
  const [displayName, setDisplayName] = useState(donorName || "Generous Supporter");
  const [customDedication, setCustomDedication] = useState(dedicationName);
  const [showAmount, setShowAmount] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showInstagramGuide, setShowInstagramGuide] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const referenceId = `REF-${donationNumber.replace(/[^A-Z0-9]/gi, "").slice(-8).toUpperCase()}`;
  const shareUrl = campaignUrl || (typeof window !== "undefined" ? `${window.location.origin}/celebrate` : "https://chahfoundation.com/celebrate");

  // Re-draw canvas whenever properties change
  useEffect(() => {
    drawCard();
  }, [template, format, displayName, customDedication, showAmount, occasion, causeTitle]);

  const drawCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Define dimensions based on format
    let width = 1080;
    let height = 1080;

    if (format === "STORY_9_16") {
      width = 1080;
      height = 1920;
    } else if (format === "A4_PRINT") {
      width = 1200;
      height = 1700;
    }

    canvas.width = width;
    canvas.height = height;

    // 1. Draw Background
    if (template === "CELEBRATION") {
      // Warm Festive Gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#00246a");
      grad.addColorStop(0.5, "#003399");
      grad.addColorStop(1, "#0d5c3a");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Decorative Festive Glows
      ctx.save();
      ctx.fillStyle = "rgba(149, 199, 24, 0.15)";
      ctx.beginPath();
      ctx.arc(width * 0.8, height * 0.2, 350, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Border frame
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 14;
      ctx.strokeRect(40, 40, width - 80, height - 80);

      // Gold inner accent
      ctx.strokeStyle = "rgba(220, 252, 100, 0.35)";
      ctx.lineWidth = 2;
      ctx.strokeRect(55, 55, width - 110, height - 110);
    } else if (template === "IMPACT") {
      // Executive Clean Navy / Lime Modern Layout
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.3, "#f4f8ec");
      grad.addColorStop(1, "#eef6fa");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Top colored accent banner
      ctx.fillStyle = "#003399";
      ctx.fillRect(0, 0, width, 24);

      // Outer sleek border
      ctx.strokeStyle = "#003399";
      ctx.lineWidth = 12;
      ctx.strokeRect(36, 36, width - 72, height - 72);
    } else {
      // GRATITUDE CERTIFICATE (Traditional prestigious parchment look)
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#fcfbf7");
      grad.addColorStop(1, "#f5f2e8");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Classical double certificate frame
      ctx.strokeStyle = "#003399";
      ctx.lineWidth = 12;
      ctx.strokeRect(45, 45, width - 90, height - 90);

      ctx.strokeStyle = "#95c718";
      ctx.lineWidth = 3;
      ctx.strokeRect(65, 65, width - 130, height - 130);
    }

    // 2. Draw Header Brand Logo & Name
    ctx.textAlign = "center";

    const startY = format === "STORY_9_16" ? 220 : 150;

    // Foundation Name
    ctx.font = "bold 32px sans-serif";
    ctx.fillStyle = template === "CELEBRATION" ? "#95c718" : "#003399";
    ctx.fillText("CHAH FOUNDATION", width / 2, startY);

    ctx.font = "500 18px sans-serif";
    ctx.fillStyle = template === "CELEBRATION" ? "rgba(255, 255, 255, 0.7)" : "#666666";
    ctx.fillText("Committed to Hope, Humanity & Grassroots Change", width / 2, startY + 32);

    // 3. Template-Specific Body Content
    if (template === "CELEBRATION") {
      // Celebration Icon & Badge
      const badgeY = startY + 110;
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.beginPath();
      ctx.roundRect(width / 2 - 160, badgeY - 32, 320, 52, 26);
      ctx.fill();

      ctx.font = "bold 20px sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(`★ CELEBRATING WITH PURPOSE ★`, width / 2, badgeY + 2);

      // Main Heading
      const mainY = badgeY + 120;
      ctx.font = "900 48px sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(`Special ${occasion || "Milestone"} Giving`, width / 2, mainY);

      // Recipient / Donor Name
      const nameY = mainY + 100;
      ctx.font = "bold 24px sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.fillText("Honoring the Compassion of", width / 2, nameY);

      ctx.font = "900 58px sans-serif";
      ctx.fillStyle = "#95c718";
      ctx.fillText(displayName, width / 2, nameY + 70);

      // Subtext
      const textY = nameY + 160;
      ctx.font = "normal 24px sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("Chose to celebrate life's moments by gifting hope,", width / 2, textY);
      ctx.fillText(`education and nutritious meals to children across India.`, width / 2, textY + 38);

      if (customDedication) {
        ctx.font = "italic 22px sans-serif";
        ctx.fillStyle = "rgba(220, 252, 100, 0.9)";
        ctx.fillText(`Dedicated in honour of: “${customDedication}”`, width / 2, textY + 95);
      }

      if (showAmount) {
        ctx.font = "bold 32px sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(`Contribution: ₹${amount.toLocaleString("en-IN")}`, width / 2, textY + 160);
      }

    } else if (template === "IMPACT") {
      // Cause Impact Card
      const badgeY = startY + 110;
      ctx.fillStyle = "#003399";
      ctx.beginPath();
      ctx.roundRect(width / 2 - 170, badgeY - 32, 340, 50, 25);
      ctx.fill();

      ctx.font = "bold 20px sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("CHAMPION OF SOCIAL IMPACT", width / 2, badgeY + 2);

      // Main Heading
      const mainY = badgeY + 110;
      ctx.font = "900 50px sans-serif";
      ctx.fillStyle = "#003399";
      ctx.fillText("Verified Supporter", width / 2, mainY);

      // Donor Name
      const nameY = mainY + 90;
      ctx.font = "bold 22px sans-serif";
      ctx.fillStyle = "#666666";
      ctx.fillText("With Deepest Appreciation to", width / 2, nameY);

      ctx.font = "900 56px sans-serif";
      ctx.fillStyle = "#003399";
      ctx.fillText(displayName, width / 2, nameY + 70);

      // Cause Tag
      const causeY = nameY + 150;
      ctx.fillStyle = "#f0f8db";
      ctx.strokeStyle = "#95c718";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(width / 2 - 250, causeY - 30, 500, 60, 16);
      ctx.fill();
      ctx.stroke();

      ctx.font = "bold 22px sans-serif";
      ctx.fillStyle = "#275e0e";
      ctx.fillText(`Cause: ${causeTitle}`, width / 2, causeY + 8);

      // Impact description
      const descY = causeY + 90;
      ctx.font = "normal 22px sans-serif";
      ctx.fillStyle = "#444444";
      ctx.fillText("Your contribution directly fuels essential healthcare, wholesome food,", width / 2, descY);
      ctx.fillText("and quality education for underprivileged communities across India.", width / 2, descY + 36);

      if (showAmount) {
        ctx.font = "bold 32px sans-serif";
        ctx.fillStyle = "#003399";
        ctx.fillText(`Donation: ₹${amount.toLocaleString("en-IN")}`, width / 2, descY + 100);
      }

    } else {
      // GRATITUDE CERTIFICATE
      const certTitleY = startY + 120;
      ctx.font = "900 54px serif";
      ctx.fillStyle = "#003399";
      ctx.fillText("CERTIFICATE OF GRATITUDE", width / 2, certTitleY);

      ctx.font = "italic 24px serif";
      ctx.fillStyle = "#666666";
      ctx.fillText("Presented with sincere appreciation to", width / 2, certTitleY + 60);

      // Recipient Name
      const nameY = certTitleY + 140;
      ctx.font = "bold 60px serif";
      ctx.fillStyle = "#111111";
      ctx.fillText(displayName, width / 2, nameY);

      // Gold Divider line under name
      ctx.strokeStyle = "#95c718";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 200, nameY + 20);
      ctx.lineTo(width / 2 + 200, nameY + 20);
      ctx.stroke();

      // Certificate Body Text
      const bodyY = nameY + 80;
      ctx.font = "normal 23px serif";
      ctx.fillStyle = "#333333";
      ctx.fillText("In grateful recognition of your generous contribution to CHAH Foundation.", width / 2, bodyY);
      ctx.fillText("Your support empowers children with nutrition and schooling,", width / 2, bodyY + 38);
      ctx.fillText("and brings dignity and medical care to senior citizens in need.", width / 2, bodyY + 76);

      // Signatures
      const sigY = bodyY + 220;
      ctx.font = "bold 20px sans-serif";
      ctx.fillStyle = "#003399";
      ctx.fillText("CHAH Foundation", width * 0.3, sigY);
      ctx.fillText("National Outreach", width * 0.7, sigY);

      ctx.font = "normal 16px sans-serif";
      ctx.fillStyle = "#777777";
      ctx.fillText("Authorized Trustee", width * 0.3, sigY + 26);
      ctx.fillText("Program Coordinator", width * 0.7, sigY + 26);
    }

    // 4. Footer Information (Reference ID & Disclaimer)
    const footerY = height - 90;

    ctx.font = "bold 16px monospace";
    ctx.fillStyle = template === "CELEBRATION" ? "rgba(255, 255, 255, 0.6)" : "#888888";
    ctx.fillText(`${referenceId} · chahfoundation.com`, width / 2, footerY);

    ctx.font = "13px sans-serif";
    ctx.fillStyle = template === "CELEBRATION" ? "rgba(255, 255, 255, 0.45)" : "#999999";
    ctx.fillText("Personalized Digital Impact Card · Official 80G tax receipt issued via verified email.", width / 2, footerY + 24);
  };

  // Download high-resolution PNG
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDownloading(true);
    try {
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      const filename = `CHAH_${template.toLowerCase()}_${displayName.replace(/[^a-z0-9]/gi, "_")}.png`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error("Failed to download image", err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Share on WhatsApp
  const handleShareWhatsApp = () => {
    const message = `I chose to celebrate by giving back through CHAH Foundation! Join me in supporting children and families across India: ${shareUrl}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  // Native Web Share API
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Celebrate With CHAH Foundation",
          text: `I chose to celebrate by giving back through CHAH Foundation. Join me in creating lasting impact!`,
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/90 shadow-xl p-6 sm:p-8 max-w-4xl mx-auto text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-100 text-lime-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-lime-700" />
            <span>Digital Recognition &amp; Sharing</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#003399] tracking-tight">
            Your Personalised Impact Card
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Celebrate, inspire friends, and share your verified contribution across social media.
          </p>
        </div>

        {/* Template Selector Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTemplate("CELEBRATION")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              template === "CELEBRATION"
                ? "bg-[#003399] text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Celebration
          </button>
          <button
            type="button"
            onClick={() => setTemplate("IMPACT")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              template === "IMPACT"
                ? "bg-[#003399] text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Cause Impact
          </button>
          <button
            type="button"
            onClick={() => setTemplate("GRATITUDE_CERTIFICATE")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              template === "GRATITUDE_CERTIFICATE"
                ? "bg-[#003399] text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Gratitude Certificate
          </button>
        </div>
      </div>

      {/* Main Split Grid: Live Canvas Preview & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
        
        {/* Left Side: Live Canvas Visual Display */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full bg-gray-950/5 p-4 rounded-2xl flex items-center justify-center border border-gray-200/80 shadow-inner overflow-hidden">
            <canvas
              ref={canvasRef}
              className={`max-w-full h-auto rounded-xl shadow-lg border border-black/10 transition-all ${
                format === "STORY_9_16" ? "max-h-[500px]" : "max-h-[420px]"
              }`}
            />
          </div>

          {/* Format Dimensions Picker Bar */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              type="button"
              onClick={() => setFormat("FEED_1_1")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                format === "FEED_1_1"
                  ? "bg-[#003399] text-white border-[#003399]"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Square className="w-3.5 h-3.5" />
              <span>Square Feed (1:1)</span>
            </button>

            <button
              type="button"
              onClick={() => setFormat("STORY_9_16")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                format === "STORY_9_16"
                  ? "bg-[#003399] text-white border-[#003399]"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Story / WhatsApp (9:16)</span>
            </button>

            <button
              type="button"
              onClick={() => setFormat("A4_PRINT")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                format === "A4_PRINT"
                  ? "bg-[#003399] text-white border-[#003399]"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>A4 Document</span>
            </button>
          </div>
        </div>

        {/* Right Side: Customization & Export Actions */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Customization Inputs */}
          <div className="space-y-3.5 bg-gray-50 p-4 rounded-2xl border border-gray-200/70 text-xs">
            <span className="font-bold text-[#003399] uppercase tracking-wider block">
              Card Personalization
            </span>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Display Name on Card
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter name to appear on card"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-900 bg-white focus:outline-none focus:border-[#003399]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Dedication Name (Optional)
              </label>
              <input
                type="text"
                value={customDedication}
                onChange={(e) => setCustomDedication(e.target.value)}
                placeholder="e.g. In honor of grandparents"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-900 bg-white focus:outline-none focus:border-[#003399]"
              />
            </div>

            {/* Privacy Toggle: Reveal/Hide Amount (default: hidden per requirements) */}
            <div className="pt-2 border-t border-gray-200">
              <label className="flex items-center justify-between cursor-pointer select-none">
                <span className="text-gray-700 font-semibold flex items-center gap-1.5">
                  {showAmount ? <Eye className="w-3.5 h-3.5 text-lime-600" /> : <EyeOff className="w-3.5 h-3.5 text-gray-400" />}
                  <span>Display Donation Amount (₹{amount})</span>
                </span>
                <input
                  type="checkbox"
                  checked={showAmount}
                  onChange={(e) => setShowAmount(e.target.checked)}
                  className="rounded border-gray-300 text-[#003399] focus:ring-[#003399]"
                />
              </label>
              <p className="text-[11px] text-gray-400 mt-1">
                Amount is hidden by default to honor donor privacy and consent.
              </p>
            </div>
          </div>

          {/* Action Buttons: Download & Social Sharing */}
          <div className="space-y-2.5">
            {/* Download Button */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full py-3 px-4 rounded-xl bg-[#003399] hover:bg-[#002878] disabled:bg-blue-300 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download High-Res Card (PNG)</span>
            </button>

            {/* WhatsApp Share Button */}
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <Share2 className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </button>

            {/* Mobile Native Share / Copy Link Row */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleNativeShare}
                className="py-2.5 px-3 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-[#003399]" />
                <span>Share Link</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="py-2.5 px-3 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-lime-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy URL"}</span>
              </button>
            </div>

            {/* Instagram Story Guide Toggle */}
            <button
              type="button"
              onClick={() => setShowInstagramGuide(!showInstagramGuide)}
              className="w-full pt-1 text-center text-xs text-[#003399] hover:underline flex items-center justify-center gap-1 font-semibold"
            >
              <Camera className="w-3.5 h-3.5 text-pink-600" />
              <span>How to post this on Instagram Story?</span>
            </button>

            {showInstagramGuide && (
              <div className="p-3 bg-pink-50/70 border border-pink-200 rounded-xl text-xs text-gray-700 space-y-1.5 animate-fade-in text-left">
                <p className="font-bold text-pink-900">Posting to Instagram Story:</p>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-gray-600">
                  <li>Click <strong>&ldquo;Story / WhatsApp (9:16)&rdquo;</strong> above and hit <strong>Download High-Res Card</strong>.</li>
                  <li>Open Instagram on your phone and tap <strong>+ Story</strong>.</li>
                  <li>Select the downloaded image from your gallery.</li>
                  <li>Add the Link Sticker: paste your campaign URL to invite friends!</li>
                </ol>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
