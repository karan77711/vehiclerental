import React, { useState, useRef, useEffect } from "react";
import { useGarage } from "../context/GarageContext";

export default function AiChatAssistant({ onOpenBudgetModal, onOpenBookModal }) {
  const { fleet, selectVehicle } = useGarage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Namaste! I am your AutoSphere AI Vehicle & Trip Assistant. Ask me anything about real cars & bikes in India, terrain suitability (Ladakh, Goa, Western Ghats), mileage, or trip budget planning!",
      quickPrompts: [
        "🏔️ Best vehicle for Ladakh / Spiti?",
        "🏖️ Car for 5 friends to Goa on budget?",
        "⛽ Highest mileage cars & bikes in India?",
        "🏍️ Best bike for solo highway tour?",
        "🛡️ What is the security deposit & FASTag policy?"
      ]
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // AI response engine with rich knowledge of Indian geography and vehicles
  const generateAiAnswer = (query) => {
    const q = query.toLowerCase();

    // 1. Ladakh, Spiti, Manali, Mountain, 4x4
    if (q.includes("ladakh") || q.includes("spiti") || q.includes("manali") || q.includes("mountain") || q.includes("offroad") || q.includes("4x4") || q.includes("snow") || q.includes("leh")) {
      const thar = fleet.find((v) => v.name.includes("thar")) || fleet[0];
      const himalayan = fleet.find((v) => v.name.includes("himalayan")) || fleet[12];
      return {
        text: `For Ladakh, Spiti Valley, and high-altitude Himalayan passes (like Khardung La, Rohtang, or Kunzum Pass), you need high ground clearance (210mm+) and true all-terrain capability:\n\n• For Cars/SUVs: **${thar.displayName}** (₹${thar.priceNum}/day) is the gold standard with 226mm clearance, 4WD Low-range transfer case, and 650mm water-wading depth.\n• For Motorcycles: **${himalayan.displayName}** (₹${himalayan.priceNum}/day) with 21-inch front spoke wheel, Showa long-travel suspension, and Sherpa liquid-cooled motor is the undisputed choice of overland riders.\n\n⚠️ Road Tip: Atal Tunnel is open year-round, but always carry high-altitude tire pressure gauge and warm layer riding gear.`,
        recommendedVehicles: [thar, himalayan]
      };
    }

    // 2. Goa, Beach, Coastal, Group road trip
    if (q.includes("goa") || q.includes("beach") || q.includes("friends") || q.includes("group") || q.includes("coastal")) {
      const safari = fleet.find((v) => v.name.includes("safari")) || fleet[4];
      const swift = fleet.find((v) => v.name.includes("swift")) || fleet[9];
      const harrier = fleet.find((v) => v.name.includes("harrier")) || fleet[7];
      return {
        text: `For a Goa road trip with friends:\n\n• **For 5-7 Friends:** **${safari.displayName}** (₹${safari.priceNum}/day) features second-row ventilated captain seats, expansive luggage space for bags, and JBL 10-speaker audio for highway tunes. Split between 6 friends, it's only ~₹916/person/day!\n• **For Budget Travelers:** **${swift.displayName}** (₹${swift.priceNum}/day) delivers an outstanding 22.4 km/l fuel economy, saving heavily on fuel along the Mumbai-Goa NH-66.\n\n🛣️ Route Intel: Fastag automated tolls are accepted throughout. Estimated toll from Mumbai to Goa is ~₹850.`,
        recommendedVehicles: [safari, harrier, swift]
      };
    }

    // 3. Mileage, Fuel economy, Cheapest running cost
    if (q.includes("mileage") || q.includes("economy") || q.includes("fuel") || q.includes("average") || q.includes("km/l") || q.includes("cheapest")) {
      const mt15 = fleet.find((v) => v.name.includes("mt15") || v.name.includes("mt-15")) || fleet[19];
      const hycross = fleet.find((v) => v.name.includes("hycross")) || fleet[6];
      const swift = fleet.find((v) => v.name.includes("swift")) || fleet[9];
      const nexonEv = fleet.find((v) => v.name.includes("nexon")) || fleet[10];
      return {
        text: `Here are our top fuel-efficiency champions across India:\n\n1. 🥇 **${mt15.displayName}**: 56.8 km/l (ARAI Super Mileage) — Rent at ₹1,400/day. You can ride 550+ km on just ₹1,000 petrol!\n2. 🥈 **${hycross.displayName}**: 23.2 km/l — Strong Hybrid 7-seater luxury MPV. Self-charging EV mode provides silent highway cruising.\n3. 🥉 **${swift.displayName}**: 22.4 km/l — Z-Series DualJet engine, ideal for city traffic and budget road trips at ₹2,400/day.\n4. ⚡ **${nexonEv.displayName}**: 465 km Range — Running cost is only ~₹1.30 per km with DC Fast Charging compatibility.`,
        recommendedVehicles: [mt15, hycross, swift, nexonEv]
      };
    }

    // 4. Bikes, Superbikes, Solo touring
    if (q.includes("bike") || q.includes("superbike") || q.includes("motorcycle") || q.includes("hayabusa") || q.includes("ninja") || q.includes("enfield") || q.includes("ktm")) {
      const himalayan = fleet.find((v) => v.name.includes("himalayan")) || fleet[12];
      const ninja = fleet.find((v) => v.name.includes("ninja")) || fleet[15];
      const classic = fleet.find((v) => v.name.includes("classic")) || fleet[13];
      const hayabusa = fleet.find((v) => v.name.includes("hayabusa")) || fleet[16];
      return {
        text: `Our Indian motorcycle fleet spans adventure tourers to track superbikes:\n\n• **Adventure / Touring:** ${himalayan.displayName} (₹${himalayan.priceNum}/day) & KTM 390 Adventure Rally (₹2,600/day).\n• **Timeless Cruiser:** ${classic.displayName} (₹${classic.priceNum}/day) for relaxed highway and coastal thump.\n• **Hypersport Superbikes:** ${ninja.displayName} (203 HP track weapon at ₹${ninja.priceNum}/day) and ${hayabusa.displayName} (1340cc legend at ₹${hayabusa.priceNum}/day).\n\n🛵 Toll Exemption Note: All 2-wheelers are 100% exempt from toll charges across NHAI Indian national highways!`,
        recommendedVehicles: [himalayan, classic, ninja, hayabusa]
      };
    }

    // 5. Deposit, FASTag, Permits, Documents, Policy
    if (q.includes("deposit") || q.includes("fastag") || q.includes("permit") || q.includes("document") || q.includes("policy") || q.includes("insurance") || q.includes("refund")) {
      return {
        text: `Here is everything you need to know about our Indian rental policy:\n\n• **Security Deposit:** 100% refundable upon vehicle handover. Inspected automatically via AI telemetry and refunded to your bank account/UPI within 2 hours.\n• **FASTag Included:** All cars are equipped with active ICICI/HDFC Bank FASTag RFID tags. Toll fees are settled transparently from your trip wallet.\n• **All India Tourist Permit (AITP):** Every fleet vehicle carries a commercial All India Permit, allowing seamless travel across state borders without interstate road tax delays.\n• **Documents Required:** Original Indian Driving License (or International Driving Permit), Aadhaar / Passport for identity verification. Minimum renter age is 21 (25 for 1000cc+ superbikes).\n• **24/7 Pan-India Roadside Assistance:** Included complimentary with every rental.`,
        recommendedVehicles: []
      };
    }

    // 6. Bangalore, Coorg, Ooty, Mysore, Western Ghats
    if (q.includes("coorg") || q.includes("ooty") || q.includes("bangalore") || q.includes("mysore") || q.includes("karnataka") || q.includes("ghat")) {
      const scorpio = fleet.find((v) => v.name.includes("scorpio")) || fleet[2];
      const ktm = fleet.find((v) => v.name.includes("ktm")) || fleet[14];
      const creta = fleet.find((v) => v.name.includes("creta")) || fleet[8];
      return {
        text: `For Bangalore to Coorg or Ooty road trips (approx 260-290 km):\n\n• The Bangalore-Mysore expressway gives a fast 90-minute start, followed by winding ghat sections.\n• **Best Family SUV:** **${scorpio.displayName}** (₹${scorpio.priceNum}/day) handles hairpin bends and steep coffee estate trails with ease.\n• **Best Compact SUV:** **${creta.displayName}** (₹${creta.priceNum}/day) offers great mileage (18.4 km/l) and panoramic sunroof for misty mountain views.\n• **Best Motorcycle:** **${ktm.displayName}** (₹${ktm.priceNum}/day) with WP Apex adjustable suspension corners sharp curves with precision.`,
        recommendedVehicles: [scorpio, creta, ktm]
      };
    }

    // General fallback
    const topMatch = fleet.find((v) => q.includes(v.brand.toLowerCase()) || q.includes(v.model.toLowerCase())) || fleet[0];
    return {
      text: `Based on your request, I recommend **${topMatch.displayName}** (₹${topMatch.priceNum}/day). It features a certified ${topMatch.specs?.engine}, ${targetMileage(topMatch)}, and ${topMatch.groundClearance} ground clearance suited for Indian road conditions.\n\nYou can also launch our **AI Trip & Budget Planner** to get exact fuel and toll estimations for your route!`,
      recommendedVehicles: [topMatch]
    };
  };

  const targetMileage = (v) => v.fuelEconomy || "15.0 km/l";

  const handleSend = (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: query
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    setTimeout(() => {
      const aiResult = generateAiAnswer(query);
      const aiMsg = {
        id: Date.now() + 1,
        sender: "ai",
        text: aiResult.text,
        recommendedVehicles: aiResult.recommendedVehicles
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleSelectVehicleForStudio = (v) => {
    selectVehicle(v.id);
  };

  const handleBookVehicleDirect = (v) => {
    if (onOpenBookModal) {
      onOpenBookModal(v);
    }
  };

  const renderFormattedText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} style={{ color: "#38bdf8", fontWeight: 700 }}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* SLEEK FLOATING AI PILL (Bottom-Right, Matches Reference UI) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="floating-ai-copilot-pill"
          title="AutoSphere AI Vehicle & Trip Assistant"
        >
          <span className="pill-bolt-icon">⚡</span>
          <span className="pill-label-text">Ask AutoSphere AI</span>
          <span className="pill-pulse-dot"></span>
        </button>
      )}

      {/* SLEEK FLOATING CHAT PANEL */}
      {isOpen && (
        <div className="ai-chat-window-box select-none">
          {/* Header */}
          <div className="ai-chat-header">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #00f0ff 0%, #2563eb 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#000000",
                  fontWeight: 900,
                  fontSize: "12px",
                  boxShadow: "0 2px 8px rgba(0, 240, 255, 0.4)"
                }}
              >
                ⚡
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span className="ai-chat-title">AutoSphere AI Concierge</span>
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: "#10b981",
                      boxShadow: "0 0 6px #10b981"
                    }}
                  ></span>
                </div>
                <span className="ai-chat-subtitle">Indian Fleet & Route Intelligence</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <button
                type="button"
                onClick={() => {
                  if (onOpenBudgetModal) onOpenBudgetModal();
                }}
                className="studio-angle-btn"
                style={{ color: "#00f0ff", borderColor: "rgba(0, 240, 255, 0.35)" }}
                title="Open Budget Engine"
              >
                📊 Budget
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="studio-angle-btn"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="ai-chat-messages-body scrollbar-thin">
            {messages.map((m) => {
              const isUser = m.sender === "user";
              return (
                <div
                  key={m.id}
                  className={`ai-msg-row ${isUser ? "user" : "ai"}`}
                >
                  <div className={isUser ? "ai-user-bubble" : "ai-bot-bubble"}>
                    <div style={{ whiteSpace: "pre-line" }}>
                      {renderFormattedText(m.text)}
                    </div>

                    {/* Quick Prompts under AI greetings */}
                    {m.quickPrompts && (
                      <div
                        style={{
                          marginTop: "12px",
                          paddingTop: "10px",
                          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px"
                        }}
                      >
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 800,
                            color: "#00f0ff",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            fontFamily: "monospace"
                          }}
                        >
                          SUGGESTED QUESTIONS:
                        </span>
                        {m.quickPrompts.map((prompt, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSend(prompt)}
                            className="ai-prompt-chip-btn"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Recommended Vehicle Mini Cards inside Chat */}
                    {m.recommendedVehicles && m.recommendedVehicles.length > 0 && (
                      <div
                        style={{
                          marginTop: "12px",
                          paddingTop: "10px",
                          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px"
                        }}
                      >
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 800,
                            color: "#00f0ff",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            fontFamily: "monospace"
                          }}
                        >
                          MATCHED FLEET MODELS:
                        </span>
                        {m.recommendedVehicles.slice(0, 2).map((v) => (
                          <div key={v.id} className="ai-recommended-card">
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <span
                                  style={{
                                    fontSize: "9.5px",
                                    fontFamily: "monospace",
                                    color: "#00f0ff",
                                    fontWeight: 800,
                                    padding: "1px 5px",
                                    borderRadius: "4px",
                                    background: "#162035"
                                  }}
                                >
                                  {v.type}
                                </span>
                                <span
                                  style={{
                                    fontWeight: 750,
                                    color: "#ffffff",
                                    fontSize: "11.5px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap"
                                  }}
                                >
                                  {v.displayName || `${v.brand} ${v.model}`}
                                </span>
                              </div>
                              <span
                                style={{
                                  fontSize: "10.5px",
                                  color: "#94a3b8",
                                  display: "block",
                                  fontFamily: "monospace",
                                  marginTop: "2px"
                                }}
                              >
                                {v.pricePerDay} • {v.fuelEconomy}
                              </span>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                              <button
                                type="button"
                                onClick={() => handleSelectVehicleForStudio(v)}
                                className="btn-card-inspect"
                                style={{ padding: "4px 8px", fontSize: "10px" }}
                                title="View in 3D"
                              >
                                3D Studio
                              </button>
                              <button
                                type="button"
                                onClick={() => handleBookVehicleDirect(v)}
                                className="btn-card-rent"
                                style={{ padding: "4px 10px", fontSize: "10px" }}
                              >
                                Rent
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  paddingLeft: "8px",
                  color: "#00f0ff",
                  fontSize: "11px",
                  fontFamily: "monospace"
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#00f0ff",
                    display: "inline-block",
                    animation: "pulse 1s infinite"
                  }}
                ></span>
                <span>AutoSphere AI is analyzing Indian fleet & route...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="ai-chat-input-bar">
            <input
              type="text"
              placeholder="Ask any question about cars, bikes, routes..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="ai-chat-input-field"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              className="btn-card-rent"
              style={{
                width: "38px",
                height: "38px",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px"
              }}
              title="Send message"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
