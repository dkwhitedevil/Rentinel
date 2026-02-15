import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import '../index.css'
import './Landing.css'
/* Neobrutalist utility styles */
const neobrutalShadow = "6px 6px 0 var(--color-sentinel-shadow)";
const neobrutalBorder = "4px solid var(--color-sentinel-navy)";

/* Animation variants */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

function Landing() {
  return (
    <div className="min-h-screen bg-[#F0F0F0] overflow-x-hidden">
      {/* Floating decorative shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-10 w-24 h-24 border-4 border-[#002040]/10 rounded-lg"
        />
        <motion.div
          animate={{
            y: [0, 15, 0],
            x: [0, -10, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 left-5 w-16 h-16 border-4 border-[#007070]/20"
          style={{ transform: "rotate(45deg)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/3 left-10 w-3 h-3 bg-[#007070] rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 right-20 w-2 h-2 bg-[#002040] rounded-full"
        />
      </div>

      {/* 1. Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-white px-4 md:px-8 py-4 flex items-center justify-between relative"
        style={{ borderBottom: neobrutalBorder }}
      >
        <motion.span
          className="text-xl md:text-2xl font-bold text-[#002040] tracking-tight"
          whileHover={{ scale: 1.02 }}
        >
          Rentinel
        </motion.span>
        <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-[#007070] text-white font-semibold"
            style={{
              border: neobrutalBorder,
              boxShadow: neobrutalShadow,
            }}
          >
            Apply
          </Link>
        </motion.div>
      </motion.nav>

      {/* 2. Hero Section */}
      <section className="relative z-10 px-4 md:px-8 py-12 md:py-20 lg:py-28">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex-1 text-center lg:text-left"
          >
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#002040] leading-tight mb-6"
            >
              Turn Rental Silence Into{" "}
              <motion.span
                variants={fadeUp}
                className="inline-block px-3 py-1 mt-2"
                style={{
                  background: "linear-gradient(135deg, #007070 0%, #0070B0 100%)",
                  color: "white",
                  border: neobrutalBorder,
                  boxShadow: neobrutalShadow,
                }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                Proof
              </motion.span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl text-[#002040]/90 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Blockchain timestamps your rental applications. Detect landlord
              ghosting. Generate court-ready evidence. Bring transparency and
              accountability to housing.
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/apply"
                className="inline-block px-8 py-4 bg-[#007070] text-white font-semibold text-lg w-full sm:w-auto text-center"
                style={{
                  border: neobrutalBorder,
                  boxShadow: neobrutalShadow,
                }}
              >
                Apply with Rentinel
              </Link>
            </motion.div>
              <motion.a
                href="#how-it-works"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block px-8 py-4 bg-white text-[#002040] font-semibold text-lg w-full sm:w-auto text-center"
                style={{
                  border: neobrutalBorder,
                  boxShadow: neobrutalShadow,
                }}
              >
                How it works
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Hero GIF / Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex-1 max-w-lg w-full"
          >
            <div
              className="relative overflow-hidden bg-[#F0F0F0] p-8"
              style={{
                border: neobrutalBorder,
                boxShadow: neobrutalShadow,
              }}
            >
              <svg
                viewBox="0 0 400 280"
                className="w-full h-auto"
                aria-label="Blockchain security visualization"
              >
                {/* Document */}
                <motion.rect
                  x="120"
                  y="40"
                  width="160"
                  height="200"
                  rx="4"
                  fill="#FFFFFF"
                  stroke="#002040"
                  strokeWidth="4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                />
                <motion.line
                  x1="150"
                  y1="80"
                  x2="270"
                  y2="80"
                  stroke="#002040"
                  strokeWidth="3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                />
                <motion.line
                  x1="150"
                  y1="110"
                  x2="250"
                  y2="110"
                  stroke="#002040"
                  strokeWidth="2"
                  opacity="0.6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                />
                <motion.line
                  x1="150"
                  y1="140"
                  x2="260"
                  y2="140"
                  stroke="#002040"
                  strokeWidth="2"
                  opacity="0.6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                />
                {/* Blockchain chain links */}
                {[0, 1, 2, 3].map((i) => (
                  <motion.rect
                    key={i}
                    x={80 + i * 90}
                    y="180"
                    width="50"
                    height="50"
                    rx="8"
                    fill="#007070"
                    stroke="#002040"
                    strokeWidth="3"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.8 + i * 0.15 }}
                  />
                ))}
                {[0, 1, 2].map((i) => (
                  <line
                    key={i}
                    x1={130 + i * 90}
                    y1="205"
                    x2={170 + i * 90}
                    y2="205"
                    stroke="#002040"
                    strokeWidth="2"
                  />
                ))}
                {/* Shield check */}
                <motion.path
                  d="M200 100 L220 120 L260 80"
                  fill="none"
                  stroke="#007070"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0.5 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                />
                {/* Timestamp badge */}
                <motion.rect
                  x="140"
                  y="220"
                  width="120"
                  height="36"
                  rx="4"
                  fill="#0070B0"
                  stroke="#002040"
                  strokeWidth="2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                />
                <motion.text
                  x="200"
                  y="243"
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="system-ui, sans-serif"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  TIMESTAMPED
                </motion.text>
              </svg>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#002040]/90 to-transparent p-4">
                <p className="text-white text-sm font-medium">
                  Every application • Timestamped on-chain • Tamper-proof
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex justify-center mt-12"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-1"
          >
            <span className="text-[#002040]/60 text-sm">Scroll to explore</span>
            <svg
              className="w-6 h-6 text-[#002040]/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* Trust badges strip */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 py-8 px-4 overflow-hidden"
      >
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-8 md:gap-12 items-center">
          {["Blockchain Verified", "Court-Ready Evidence", "No Hidden Fees"].map((badge, i) => (
            <motion.div
              key={badge}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="text-2xl"
              >
                ✓
              </motion.span>
              <span className="font-semibold text-[#002040] text-sm md:text-base">{badge}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 3. Stats Section */}
      <section className="relative z-10 px-4 md:px-8 py-12 md:py-16 bg-white" style={{ borderTop: neobrutalBorder, borderBottom: neobrutalBorder }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          >
            {[
              { value: "10K+", label: "Applications protected" },
              { value: "99.9%", label: "Timestamp accuracy" },
              { value: "47 states", label: "Legal framework ready" },
              { value: "24/7", label: "Evidence verification" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={scaleIn}
                whileHover={{ y: -4 }}
                className="text-center p-4"
              >
                <motion.span
                  className="block text-3xl md:text-4xl font-bold text-[#007070] mb-1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  {stat.value}
                </motion.span>
                <span className="text-[#002040]/80 text-sm md:text-base">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section
        id="how-it-works"
        className="relative z-10 px-4 md:px-8 py-16 md:py-24 bg-[#F0F0F0]"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-[#002040] text-center mb-12 md:mb-16"
          >
            How Rentinel Works
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: (
                  <svg className="w-12 h-12 text-[#007070]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Tamper-Proof Applications",
                desc: "Every application gets an immutable blockchain timestamp. No one can alter when you applied.",
                gif: "https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif",
              },
              {
                icon: (
                  <svg className="w-12 h-12 text-[#007070]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                ),
                title: "Ghosting Detection",
                desc: "Track which landlords never respond. Build a record of silence that speaks for itself.",
                gif: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
              },
              {
                icon: (
                  <svg className="w-12 h-12 text-[#007070]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                title: "Court-Ready Evidence",
                desc: "Export timestamps and proof of non-response. Documentation that holds up when it matters.",
                gif: "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-white overflow-hidden transition-shadow group"
                style={{
                  border: neobrutalBorder,
                  boxShadow: neobrutalShadow,
                }}
              >
                <div className="h-40 overflow-hidden bg-[#F0F0F0]">
                  <motion.img
                    src={feature.gif}
                    alt={feature.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 md:p-8">
                  <motion.div
                    className="mb-4"
                    whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold text-[#002040] mb-3">{feature.title}</h3>
                  <p className="text-[#002040]/80 leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Process Steps */}
      <section className="relative z-10 px-4 md:px-8 py-16 md:py-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-[#002040] text-center mb-16"
        >
          Three Simple Steps
        </motion.h2>
        <div className="max-w-4xl mx-auto">
          {[
            { step: 1, title: "Submit your application", desc: "Apply through Rentinel and we timestamp it on-chain instantly." },
            { step: 2, title: "Track responses", desc: "Monitor which landlords respond—and which go silent." },
            { step: 3, title: "Export your proof", desc: "Download court-ready evidence whenever you need it." },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row items-center gap-6 mb-12 last:mb-0"
            >
              <motion.div
                className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-[#007070] text-white font-bold text-xl"
                style={{ border: neobrutalBorder, boxShadow: neobrutalShadow }}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                {item.step}
              </motion.div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-[#002040] mb-2">{item.title}</h3>
                <p className="text-[#002040]/80">{item.desc}</p>
              </div>
              {i < 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="hidden md:block"
                >
                  <motion.svg
                    animate={{ y: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-6 h-6 text-[#007070]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </motion.svg>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. Testimonials / Trust */}
      <section className="relative z-10 px-4 md:px-8 py-16 md:py-24 bg-white" style={{ borderTop: neobrutalBorder }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-[#002040] text-center mb-12"
        >
          Trusted by renters
        </motion.h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { quote: "Finally, proof that I applied. Landlord stopped ghosting when I showed the timestamp.", author: "M. Chen", role: "Boston, MA" },
            { quote: "Rentinel gave me confidence during my housing search. The evidence export saved me.", author: "J. Rodriguez", role: "Austin, TX" },
            { quote: "Transparent, simple, and it actually works. Every renter should use this.", author: "S. Williams", role: "Chicago, IL" },
          ].map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="p-6 bg-[#F0F0F0]"
              style={{ border: neobrutalBorder, boxShadow: neobrutalShadow }}
            >
              <p className="text-[#002040] mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
              <p className="font-bold text-[#007070]">{t.author}</p>
              <p className="text-sm text-[#002040]/70">{t.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 7. Impact / Final CTA Section */}
      <section className="relative z-10 px-4 md:px-8 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.01 }}
          className="max-w-3xl mx-auto text-center p-8 md:p-12 bg-white"
          style={{
            border: neobrutalBorder,
            boxShadow: neobrutalShadow,
          }}
        >
          <motion.p
            className="text-2xl md:text-3xl font-bold text-[#002040] mb-8 leading-tight"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Because silence should never hide discrimination.
          </motion.p>
          <motion.div
            id="apply"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/login"
              className="inline-block px-10 py-5 bg-[#007070] text-white font-bold text-lg"
              style={{
                border: neobrutalBorder,
                boxShadow: neobrutalShadow,
              }}
            >
              Start Your Fair Application
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 8. Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-8 px-4 md:px-8 bg-white text-center relative z-10"
        style={{ borderTop: neobrutalBorder }}
      >
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#002040]/80 text-sm md:text-base">
            © Rentinel — Making rental fairness provable.
          </p>
          <div className="flex gap-6">
            <motion.a href="#" className="text-[#007070] hover:underline" whileHover={{ x: 2 }}>Privacy</motion.a>
            <motion.a href="#" className="text-[#007070] hover:underline" whileHover={{ x: 2 }}>Terms</motion.a>
            <motion.a href="#" className="text-[#007070] hover:underline" whileHover={{ x: 2 }}>Contact</motion.a>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

export default Landing ;
