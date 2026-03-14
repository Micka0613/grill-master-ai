import { useState, useEffect, useRef } from "react";

const VIANDES = [
  { name: "Côte de bœuf", emoji: "🥩", temp: 57, time: "8-10 min" },
  { name: "Brisket", emoji: "🍖", temp: 95, time: "12-14 h" },
  { name: "Ribs de porc", emoji: "🍗", temp: 88, time: "5-6 h" },
  { name: "Cuisse de poulet", emoji: "🍗", temp: 74, time: "45-55 min" },
  { name: "Saumon", emoji: "🐟", temp: 63, time: "12-15 min" },
  { name: "Burger", emoji: "🍔", temp: 71, time: "10-12 min" },
];

const TEMOIGNAGES = [
  { name: "Jacques T.", region: "Lyon", text: "Mon brisket est passé de raté à niveau compétition en un seul été. GrillMaster AI est incroyable.", stars: 5, avatar: "JT" },
  { name: "Marc R.", region: "Bordeaux", text: "Il a sauvé mon barbecue du 14 juillet. L'IA a détecté la montée de température avant moi.", stars: 5, avatar: "MR" },
  { name: "Chris B.", region: "Toulouse", text: "Je grill depuis 20 ans. Cette appli m'a quand même appris des trucs.", stars: 5, avatar: "CB" },
];

const PLANS = [
  { name: "Starter", price: 9, period: "mois", color: "#c0913a", features: ["Conseiller IA sur les viandes", "5 cuissons/mois", "Calculateur de fumée", "Support email"] },
  { name: "Pitmaster Pro", price: 19, period: "mois", color: "#e05c2a", features: ["Tout le Starter", "Cuissons illimitées", "Coaching IA en temps réel", "Optimiseur smoke ring", "Support prioritaire"], popular: true },
  { name: "Légende BBQ", price: 49, period: "mois", color: "#7b2f1a", features: ["Tout le Pro", "Mode compétition", "Générateur de rubs personnalisés", "Sessions expert 1-on-1", "Onboarding VIP"] },
];

function FlameIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C12 2 7 7 7 13a5 5 0 0010 0c0-6-5-11-5-11z" fill="#e05c2a" opacity="0.9"/>
      <path d="M12 8C12 8 9.5 11 9.5 14a2.5 2.5 0 005 0C14.5 11 12 8 12 8z" fill="#f5a623"/>
    </svg>
  );
}

function Etoiles({ n = 5 }) {
  return <span style={{ color: "#f5a623", letterSpacing: 1 }}>{"★".repeat(n)}</span>;
}

export default function App() {
  const [viande, setViande] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [email, setEmail] = useState("");
  const [envoye, setEnvoye] = useState(false);
  const [tempAnim, setTempAnim] = useState(70);
  const resultRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTempAnim(t => t < 225 ? t + 1.5 : 70);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const demanderConseil = async (v) => {
    setViande(v);
    setAiLoading(true);
    setAiResult("");
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);

    const prompt = `Tu es GrillMaster AI, un coach BBQ professionnel français. Donne un conseil de cuisson court et enthousiaste pour ${v.name} en 3-4 phrases. Inclus la température idéale à cœur (${v.temp}°C), le temps de cuisson estimé (${v.time}), un secret de pro, et une phrase de motivation finale. Réponds en français, style passionné et expert.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await res.json();
      setAiResult(data.content?.[0]?.text || "Le feu est prêt — conseil bientôt disponible !");
    } catch {
      setAiResult("Le feu est là, le conseil arrive — réessaie dans un instant.");
    }
    setAiLoading(false);
  };

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#0d0a07", color: "#f5ede0", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Sans+3:wght@300;400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .hero-title { font-family: 'Playfair Display', serif; }
        .body-font { font-family: 'Source Sans 3', sans-serif; }
        .cut-card { transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; }
        .cut-card:hover { transform: translateY(-4px) scale(1.03); box-shadow: 0 8px 32px #e05c2a44; }
        .plan-card { transition: transform 0.2s; }
        .plan-card:hover { transform: translateY(-6px); }
        .cta-btn { transition: background 0.2s, transform 0.15s, box-shadow 0.2s; }
        .cta-btn:hover { transform: scale(1.04); box-shadow: 0 6px 28px #e05c2a88; }
        .smoke { animation: riseSmoke 4s ease-in-out infinite; }
        @keyframes riseSmoke { 0%,100%{opacity:0.12;transform:translateY(0)} 50%{opacity:0.22;transform:translateY(-18px)} }
        .fade-in { animation: fadeIn 0.7s ease both; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        .pulse { animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
        ::placeholder { color: #a08060; }
        input:focus { outline: none; border-color: #e05c2a !important; }
      `}</style>

      {/* HERO */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "40px 20px 80px" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 60%, #3a1a0822 0%, #0d0a07 100%)" }} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 18 }}>
            <FlameIcon /><FlameIcon /><FlameIcon />
          </div>
          <p className="body-font" style={{ letterSpacing: "0.35em", fontSize: 11, color: "#c0913a", textTransform: "uppercase", marginBottom: 20 }}>Le Coach BBQ IA N°1 en France</p>
          <h1 className="hero-title" style={{ fontSize: "clamp(48px, 9vw, 96px)", fontWeight: 900, lineHeight: 1.0, color: "#f5ede0", marginBottom: 10 }}>
            GrillMaster<br /><span style={{ color: "#e05c2a" }}>AI</span>
          </h1>
          <p className="body-font" style={{ fontSize: "clamp(17px, 2.5vw, 22px)", color: "#c4a882", maxWidth: 560, margin: "24px auto 40px", lineHeight: 1.65, fontWeight: 300 }}>
            Fini les approximations. L'IA qui transforme chaque cuisson en chef-d'œuvre grillé.
          </p>
          <button className="cta-btn body-font"
            onClick={() => document.getElementById("demo").scrollIntoView({ behavior: "smooth" })}
            style={{ background: "#e05c2a", color: "#fff", border: "none", borderRadius: 4, padding: "18px 48px", fontSize: 17, fontWeight: 600, letterSpacing: "0.05em", cursor: "pointer", textTransform: "uppercase" }}>
            Essayer Gratuitement →
          </button>
          <p className="body-font" style={{ color: "#7a6248", fontSize: 13, marginTop: 16 }}>Sans carte bancaire · Compatible gaz, charbon et fumoir</p>
        </div>
      </section>

      {/* BARRE SOCIALE */}
      <div className="body-font" style={{ background: "#1a0e06", borderTop: "1px solid #2e1e0e", borderBottom: "1px solid #2e1e0e", padding: "16px 20px", display: "flex", justifyContent: "center", gap: "clamp(24px, 6vw, 80px)", flexWrap: "wrap", fontSize: 14, color: "#c0913a" }}>
        {["⭐ 4.9/5 de moyenne", "🔥 47 000+ cuissons coachées", "🏆 200+ équipes de compétition", "🇫🇷 Fait en France"].map(s => (
          <span key={s} style={{ whiteSpace: "nowrap" }}>{s}</span>
        ))}
      </div>

      {/* DÉMO */}
      <section id="demo" style={{ maxWidth: 860, margin: "0 auto", padding: "80px 20px" }}>
        <p className="body-font" style={{ textAlign: "center", letterSpacing: "0.3em", fontSize: 11, color: "#c0913a", textTransform: "uppercase", marginBottom: 12 }}>Démo Live IA</p>
        <h2 className="hero-title" style={{ textAlign: "center", fontSize: "clamp(30px, 5vw, 48px)", color: "#f5ede0", marginBottom: 12 }}>Choisis ta viande. Reçois tes conseils.</h2>
        <p className="body-font" style={{ textAlign: "center", color: "#9a7d60", fontSize: 16, marginBottom: 44 }}>Vraie IA, vrai produit — pas une démo factice.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 14 }}>
          {VIANDES.map(v => (
            <div key={v.name} className="cut-card" onClick={() => demanderConseil(v)}
              style={{ background: viande?.name === v.name ? "#2a1206" : "#16100a", border: `1.5px solid ${viande?.name === v.name ? "#e05c2a" : "#2e1e0e"}`, borderRadius: 8, padding: "20px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 30, marginBottom: 8 }}>{v.emoji}</div>
              <div className="body-font" style={{ fontWeight: 600, color: "#f0dcc4", fontSize: 13 }}>{v.name}</div>
              <div className="body-font" style={{ color: "#c0913a", fontSize: 11, marginTop: 4 }}>{v.temp}°C · {v.time}</div>
            </div>
          ))}
        </div>
        <div ref={resultRef} style={{ marginTop: 36, minHeight: 100 }}>
          {aiLoading && (
            <div className="pulse body-font" style={{ textAlign: "center", color: "#c0913a", fontSize: 15, padding: "40px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <FlameIcon /> L'IA chauffe le four… <FlameIcon />
            </div>
          )}
          {aiResult && !aiLoading && (
            <div className="fade-in" style={{ background: "#1a0e06", border: "1px solid #3a2010", borderRadius: 8, padding: "28px 32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <FlameIcon />
                <span className="body-font" style={{ color: "#c0913a", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" }}>GrillMaster AI conseille :</span>
              </div>
              <p className="body-font" style={{ color: "#f0dcc4", fontSize: 16, lineHeight: 1.75 }}>{aiResult}</p>
            </div>
          )}
        </div>
      </section>

      {/* FONCTIONNALITÉS */}
      <section style={{ background: "#100c07", borderTop: "1px solid #1e1208", padding: "80px 20px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p className="body-font" style={{ textAlign: "center", letterSpacing: "0.3em", fontSize: 11, color: "#c0913a", textTransform: "uppercase", marginBottom: 12 }}>Ce que tu obtiens</p>
          <h2 className="hero-title" style={{ textAlign: "center", fontSize: "clamp(28px, 4vw, 42px)", color: "#f5ede0", marginBottom: 48 }}>Conçu pour les vrais passionnés</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
            {[
              { icon: "🌡️", title: "Coaching Température", desc: "L'IA suit chaque étape et t'alerte avant que ta cuisson parte en vrille." },
              { icon: "💨", title: "Optimiseur Smoke Ring", desc: "Obtiens le smoke ring parfait grâce à notre algorithme de flux d'air." },
              { icon: "🧂", title: "Générateur de Rubs", desc: "Recettes de marinades personnalisées selon ta viande, ton bois et tes goûts." },
              { icon: "📊", title: "Historique de Cuissons", desc: "Analyse chaque session. Progresse à chaque fois. Tes données, ta maîtrise." },
            ].map(f => (
              <div key={f.title} style={{ background: "#16100a", border: "1px solid #2a1a0c", borderRadius: 8, padding: "28px 22px" }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
                <h3 className="hero-title" style={{ fontSize: 18, color: "#f0dcc4", marginBottom: 10 }}>{f.title}</h3>
                <p className="body-font" style={{ color: "#9a7d60", fontSize: 14, lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "80px 20px" }}>
        <p className="body-font" style={{ textAlign: "center", letterSpacing: "0.3em", fontSize: 11, color: "#c0913a", textTransform: "uppercase", marginBottom: 12 }}>Ils témoignent</p>
        <h2 className="hero-title" style={{ textAlign: "center", fontSize: "clamp(28px, 4vw, 42px)", color: "#f5ede0", marginBottom: 48 }}>Du jardin au podium</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 22 }}>
          {TEMOIGNAGES.map(t => (
            <div key={t.name} style={{ background: "#16100a", border: "1px solid #2a1a0c", borderRadius: 8, padding: "26px 22px" }}>
              <Etoiles n={t.stars} />
              <p className="body-font" style={{ color: "#c4a882", fontSize: 14, lineHeight: 1.7, margin: "14px 0 20px", fontStyle: "italic" }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#e05c2a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="body-font" style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{t.avatar}</span>
                </div>
                <div>
                  <div className="body-font" style={{ fontWeight: 600, fontSize: 13, color: "#f0dcc4" }}>{t.name}</div>
                  <div className="body-font" style={{ fontSize: 12, color: "#7a6248" }}>{t.region}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TARIFS */}
      <section id="tarifs" style={{ background: "#100c07", borderTop: "1px solid #1e1208", padding: "80px 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p className="body-font" style={{ textAlign: "center", letterSpacing: "0.3em", fontSize: 11, color: "#c0913a", textTransform: "uppercase", marginBottom: 12 }}>Tarifs</p>
          <h2 className="hero-title" style={{ textAlign: "center", fontSize: "clamp(28px, 4vw, 42px)", color: "#f5ede0", marginBottom: 48 }}>Choisis ton niveau</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 22 }}>
            {PLANS.map(plan => (
              <div key={plan.name} className="plan-card" style={{ background: "#16100a", border: `2px solid ${plan.popular ? plan.color : "#2a1a0c"}`, borderRadius: 8, padding: "32px 26px", position: "relative" }}>
                {plan.popular && <div className="body-font" style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: plan.color, color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 16px", borderRadius: 20, whiteSpace: "nowrap" }}>Le Plus Populaire</div>}
                <h3 className="hero-title" style={{ fontSize: 22, color: "#f0dcc4", marginBottom: 6 }}>{plan.name}</h3>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 22 }}>
                  <span className="hero-title" style={{ fontSize: 42, color: plan.color, lineHeight: 1 }}>{plan.price}€</span>
                  <span className="body-font" style={{ color: "#7a6248", fontSize: 14, marginBottom: 6 }}>/{plan.period}</span>
                </div>
                <ul style={{ listStyle: "none", marginBottom: 28 }}>
                  {plan.features.map(f => (
                    <li key={f} className="body-font" style={{ color: "#c4a882", fontSize: 14, padding: "6px 0", borderBottom: "1px solid #1e1208", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: plan.color }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button className="cta-btn body-font"
                  style={{ width: "100%", background: plan.popular ? plan.color : "transparent", color: plan.popular ? "#fff" : plan.color, border: `1.5px solid ${plan.color}`, borderRadius: 4, padding: "13px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", textTransform: "uppercase" }}>
                  Commencer
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAPTURE EMAIL */}
      <section style={{ maxWidth: 600, margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
        <FlameIcon />
        <h2 className="hero-title" style={{ fontSize: "clamp(26px, 4vw, 38px)", color: "#f5ede0", margin: "16px 0 12px" }}>14 jours gratuits</h2>
        <p className="body-font" style={{ color: "#9a7d60", fontSize: 15, marginBottom: 32 }}>Rejoins 47 000+ passionnés. Zéro spam. Que du feu.</p>
        {envoye ? (
          <div className="fade-in body-font" style={{ color: "#c0913a", fontSize: 18 }}>🔥 C'est parti ! Vérifie ta boîte mail.</div>
        ) : (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <input className="body-font" type="email" placeholder="ton@email.com" value={email} onChange={e => setEmail(e.target.value)}
              style={{ flex: "1 1 220px", background: "#16100a", border: "1.5px solid #2e1e0e", borderRadius: 4, padding: "14px 18px", color: "#f5ede0", fontSize: 15 }} />
            <button className="cta-btn body-font" onClick={() => email && setEnvoye(true)}
              style={{ background: "#e05c2a", color: "#fff", border: "none", borderRadius: 4, padding: "14px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer", textTransform: "uppercase" }}>
              Essai Gratuit
            </button>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0a0704", borderTop: "1px solid #1a0e06", padding: "28px 20px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <FlameIcon />
          <span className="hero-title" style={{ fontSize: 18, color: "#c0913a" }}>GrillMaster AI</span>
        </div>
        <p className="body-font" style={{ color: "#4a3020", fontSize: 12 }}>© 2026 GrillMaster AI · Confidentialité · CGU · Fait avec 🔥 en France</p>
      </footer>
    </div>
  );
}
