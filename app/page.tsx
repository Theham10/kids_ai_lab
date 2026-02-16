"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import StoryMagic from "../components/StoryMagic";
import MagicCanvas from "../components/MagicCanvas";
import MagicMotion from "../components/MagicMotion";
import Auth, { UserProfile } from "../components/Auth";
import HeroCenter from "../components/HeroCenter";
import AIDisclosure from "../components/AIDisclosure";
import Settings from "../components/Settings";
import AIChat from "../components/AIChat";
import AdminDashboard from "../components/AdminDashboard";

export default function Home() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [view, setView] = useState<"dashboard" | "story" | "draw" | "hero" | "motion" | "settings" | "chat" | "admin">("dashboard");
  const [gallery, setGallery] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showAIDisclosure, setShowAIDisclosure] = useState(false);

  useEffect(() => {
    // Session Recovery
    const savedUser = localStorage.getItem("magic_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        // Refresh data from Supabase for production consistency
        if (parsed.id && !parsed.id.startsWith('admin')) {
          supabase
            .from('magic_users')
            .select('*')
            .eq('id', parsed.id)
            .single()
            .then(({ data }) => {
              if (data) {
                const updated = { ...data, characterName: data.character_name };
                setUser(updated);
                localStorage.setItem("magic_user", JSON.stringify(updated));
              }
            });
        }
      } catch (e) {
        console.error("Session recovery failed", e);
      }
    }

    const savedGallery = localStorage.getItem("magic_gallery");
    if (savedGallery) {
      setGallery(JSON.parse(savedGallery));
    }
    setMounted(true);

    // Show AI Disclosure on first run
    const hasSeenDisclosure = localStorage.getItem("magic_ai_disclosure_seen");
    if (!hasSeenDisclosure) {
      setShowAIDisclosure(true);
    }
  }, []);

  useEffect(() => {
    if (gallery.length > 0) {
      localStorage.setItem("magic_gallery", JSON.stringify(gallery));
    }
  }, [gallery]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("magic_user", JSON.stringify(user));
    }
  }, [user]);

  if (!mounted) return null;

  if (!user) {
    return (
      <main>
        {showAIDisclosure ? (
          <AIDisclosure
            onClose={() => {
              setShowAIDisclosure(false);
              localStorage.setItem("magic_ai_disclosure_seen", "true");
            }}
          />
        ) : (
          <Auth onLogin={(newUser) => setUser(newUser)} />
        )}
      </main>
    );
  }

  const handleBack = () => setView("dashboard");
  const addToGallery = (img: string) => setGallery(prev => [img, ...prev]);

  const decrementCredits = async () => {
    if (user && user.credits > 0 && user.tier !== "Pro") {
      const newCredits = user.credits - 1;
      const newUser = { ...user, credits: newCredits };
      setUser(newUser);
      localStorage.setItem("magic_user", JSON.stringify(newUser));

      // Persist to Supabase
      if (user.id && !user.id.startsWith('admin')) {
        const { error } = await supabase
          .from('magic_users')
          .update({ credits: newCredits })
          .eq('id', user.id);

        if (error) console.error("Failed to sync credits", error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("magic_user");
    setUser(null);
  };

  const renderView = () => {
    switch (view) {
      case "story": return <StoryMagic onBack={handleBack} user={user} onDecrementCredits={decrementCredits} />;
      case "draw": return <MagicCanvas onBack={handleBack} user={user} onSaveToGallery={addToGallery} gallery={gallery} onDecrementCredits={decrementCredits} />;
      case "motion": return <MagicMotion onBack={handleBack} user={user} gallery={gallery} />;
      case "hero": return <HeroCenter onBack={handleBack} user={user} />;
      case "settings": return <Settings onBack={handleBack} user={user} onUpdateUser={(updated) => setUser(updated)} />;
      case "chat": return <AIChat onBack={handleBack} user={user} />;
      case "admin": return <AdminDashboard onBack={handleBack} />;
      default: return (
        <>
          <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
            {user?.name && ["스텔라", "stella", "admin"].includes(user.name.toLowerCase()) && (
              <button
                onClick={() => setView("admin")}
                style={{ position: "fixed", top: "10px", right: "10px", zIndex: 100, background: "black", color: "white", padding: "5px 10px", borderRadius: "5px", fontSize: "0.7rem" }}
              >
                ADMIN DASHBOARD
              </button>
            )}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              style={{ display: "flex", alignItems: "center", gap: "15px" }}
            >
              <img src="/mascot.png" alt="Mascot" style={{ width: "60px", height: "60px", borderRadius: "12px" }} />
              <div>
                <h3 style={{ margin: 0, fontSize: "1.5rem", color: "#2d3436" }}>반가워, {user.name}!</h3>
                <div style={{
                  fontSize: "0.85rem",
                  background: "linear-gradient(45deg, #FF9F43, #FF8C42)",
                  padding: "6px 15px",
                  borderRadius: "20px",
                  color: "white",
                  fontWeight: "bold",
                  boxShadow: "0 4px 15px rgba(255, 140, 66, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  position: "relative",
                  overflow: "hidden"
                }}
                  className={user.tier === "Pro" ? "animate-shiny" : ""}
                >
                  <span style={{ position: "relative", zIndex: 1 }}>💎 마법 에너지: {user.tier === "Pro" ? "무제한" : user.credits}</span>
                </div>
              </div>
            </motion.div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="button" style={{
                  fontSize: "0.95rem",
                  padding: "0.6rem 1.5rem",
                  background: "linear-gradient(45deg, #A29BFE, #6C5CE7)",
                  color: "white",
                  border: "none",
                  boxShadow: "0 4px 15px rgba(108, 92, 231, 0.3)"
                }} onClick={() => setView("settings")}>⚙️ 설정</motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="button" style={{
                  fontSize: "0.95rem",
                  padding: "0.6rem 1.5rem",
                  background: "white",
                  color: "#666",
                  border: "2px solid #eee"
                }} onClick={handleLogout}>Logout</motion.button>
            </div>
          </nav >

          <header style={{ textAlign: "center", marginBottom: "5rem" }}>
            <motion.h1
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                fontSize: "4.5rem",
                marginBottom: "1rem",
                color: "#6C5CE7",
                fontFamily: "Fredoka, sans-serif",
                textShadow: "0 10px 20px rgba(108, 92, 231, 0.2)"
              }}
              className="animate-float"
            >
              Hero Magic Lab 🚀
            </motion.h1>
            <p style={{ fontSize: "1.6rem", color: "#636e72" }}>
              무한한 공간, 저 너머로! {user.name}와 {user.characterName}의 상상을 그려줄게. ✨
            </p>
          </header>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15 }
              }
            }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "3rem"
            }}
          >
            {[
              { id: "story", icon: "📖", title: "스토리 마법", desc: "나만의 동화책 만들기.", color: "#FF8C42" },
              { id: "draw", icon: "🎨", title: "매직 캔버스", desc: "상상하는 무엇이든 그려봐!", color: "#FF6B9D" },
              { id: "chat", icon: "💬", title: "AI 친구와 대화하기", desc: "AI 친구와 함께 수다떨기!", color: "#9B59B6" },
              { id: "motion", icon: "🎬", title: "매직 모션", desc: "내 그림이 움직여요!", color: "#4D96FF", pro: true },
              { id: "hero", icon: "🦄", title: "히어로 센터", desc: "나의 정보와 마법 기록!", color: "#6BCB77" }
            ].map((item) => (
              <motion.div
                key={item.id}
                variants={{
                  hidden: { y: 30, opacity: 0 },
                  visible: { y: 0, opacity: 1 }
                }}
                whileHover={{ y: -15, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="card"
                style={{
                  borderBottom: `12px solid ${item.color}`,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "2.5rem",
                  position: "relative",
                  overflow: "hidden"
                }}
                onClick={() => setView(item.id as any)}
              >
                <div>
                  <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>{item.icon}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <h3 style={{ fontSize: "1.8rem" }}>{item.title}</h3>
                    {item.id === "motion" && <span style={{ fontSize: "0.75rem", background: "#000", color: "#fff", padding: "4px 8px", borderRadius: "6px" }}>MAGIC</span>}
                  </div>
                  <p style={{ color: "#7f8c8d", fontSize: "1.1rem", marginTop: "0.8rem" }}>{item.desc}</p>
                </div>
                <button
                  className="button"
                  style={{
                    background: item.color,
                    color: "white",
                    width: "100%",
                    marginTop: "2.5rem",
                    justifyContent: "center",
                    fontSize: "1.2rem",
                    padding: "1.2rem"
                  }}
                >
                  들어가기 →
                </button>
              </motion.div>
            ))}
          </motion.div>

          <footer style={{ marginTop: "8rem", textAlign: "center", opacity: 0.4 }}>
            <p>무한한 공간, 저 너머로! {user.name}의 마법 연구소 ✨</p>
          </footer>
        </>
      );
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={view}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        <main>{renderView()}</main>
      </motion.div>
    </AnimatePresence>
  );
}
