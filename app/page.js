'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import { X, ArrowRight, Menu, Lock, Users, Eye, Play, Instagram, Youtube, Mail, Film, Star, Clapperboard, Camera } from 'lucide-react';

// Airtable Form Link
const AIRTABLE_FORM_URL = 'https://airtable.com/apphjvez7CWW1sFGK/pagJAGsHee4geTyHR/form';

const openBookingForm = () => {
  window.open(AIRTABLE_FORM_URL, '_blank');
};

// Film Images
const IMAGES = {
  coupleRed: 'https://customer-assets.emergentagent.com/job_final-inhale/artifacts/099xqrx4_IMG_7002.PNG',
  family: 'https://customer-assets.emergentagent.com/job_final-inhale/artifacts/ax3wetgg_IMG_7001.PNG',
  templeWalk: 'https://customer-assets.emergentagent.com/job_final-inhale/artifacts/vjssmwgv_IMG_7005.PNG',
  templeView: 'https://customer-assets.emergentagent.com/job_final-inhale/artifacts/slrzotpv_IMG_7004.PNG',
  eyes: 'https://customer-assets.emergentagent.com/job_final-inhale/artifacts/h86md1oc_IMG_7003.PNG',
  paperNote: 'https://customer-assets.emergentagent.com/job_final-inhale/artifacts/esw4c35y_IMG_7008.PNG',
  fatherSon: 'https://customer-assets.emergentagent.com/job_final-inhale/artifacts/y1qefch0_IMG_7007.PNG',
};

// ===== ANALYTICS HELPER =====
const trackEvent = async (event, data = {}) => {
  try {
    const sessionId = typeof window !== 'undefined'
      ? (sessionStorage.getItem('tlp_session') || (() => {
          const id = Math.random().toString(36).substr(2, 9);
          sessionStorage.setItem('tlp_session', id);
          return id;
        })())
      : null;
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, page: '/', data, sessionId }),
    });
  } catch { /* silent */ }
};

// ===== FLOATING PARTICLES =====
const FloatingParticles = () => {
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 12 + 8,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.5 + 0.1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(194, 163, 107, ${p.opacity}) 0%, transparent 70%)`,
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, p.opacity, 0], y: -250 }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
};

// ===== CUSTOM CURSOR =====
const CustomCursor = () => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0, dotX = 0, dotY = 0;
    let isHovering = false;

    const moveCursor = (e) => { mouseX = e.clientX; mouseY = e.clientY; };
    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;
      dotX += (mouseX - dotX) * 0.5;
      dotY += (mouseY - dotY) * 0.5;
      if (cursor) { cursor.style.left = `${cursorX}px`; cursor.style.top = `${cursorY}px`; }
      if (dot) { dot.style.left = `${dotX}px`; dot.style.top = `${dotY}px`; }
      requestAnimationFrame(animate);
    };
    const handleOver = (e) => {
      if (e.target.closest('a, button, [data-hover]')) {
        isHovering = true;
        cursor?.classList.add('hovering');
      }
    };
    const handleOut = (e) => {
      if (e.target.closest('a, button, [data-hover]')) {
        isHovering = false;
        cursor?.classList.remove('hovering');
      }
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout', handleOut);
    animate();
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor-main hidden md:block" style={{ transform: 'translate(-50%, -50%)' }} />
      <div ref={dotRef} className="cursor-dot hidden md:block" style={{ transform: 'translate(-50%, -50%)' }} />
    </>
  );
};

// ===== NAVIGATION =====
const Navigation = ({ onMenuClick, onRequestAccess }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5 transition-all duration-500 ${scrolled ? 'bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#C2A36B]/10' : ''}`}>
      <div className="flex justify-between items-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <span className="font-playfair text-xl font-bold text-[#C2A36B] tracking-wider">THE LAST PUFF</span>
        </motion.div>
        <div className="flex items-center gap-6">
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            onClick={openBookingForm} className="hidden md:flex items-center gap-2 text-xs tracking-[0.2em] opacity-60 hover:opacity-100 hover-line transition-opacity" data-hover>
            <Film className="w-3 h-3" /> BOOK FREE PREMIERE
          </motion.button>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            onClick={onMenuClick} data-hover>
            <Menu className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </nav>
  );
};

// ===== FULL SCREEN MENU =====
const FullScreenMenu = ({ isOpen, onClose, onRequestAccess, onScrollTo }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#0A0A0A]/98 backdrop-blur-lg z-[100] flex items-center justify-center">
        <button onClick={onClose} className="absolute top-6 right-6" data-hover><X className="w-6 h-6" /></button>
        <div className="text-center space-y-2">
          {[
            { label: 'The Story', action: () => { onScrollTo('story'); onClose(); } },
            { label: 'Gallery', action: () => { onScrollTo('gallery'); onClose(); } },
            { label: 'Cast & Crew', action: () => { onScrollTo('cast'); onClose(); } },
            { label: 'Trailer', action: () => { onScrollTo('trailer'); onClose(); } },
            { label: 'Book Free Premiere', action: () => { openBookingForm(); onClose(); } },
          ].map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}>
              <button onClick={item.action} data-hover
                className="font-playfair text-4xl md:text-6xl font-bold block w-full py-2 hover:text-[#C2A36B] transition-colors duration-300">
                {item.label}
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ===== HERO SECTION =====
const HeroSection = ({ onRequestAccess }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <section ref={ref} className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <FloatingParticles />
      <div className="vignette" />

      {/* Parallax Background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0">
        <img src={IMAGES.eyes} alt="" className="w-full h-full object-cover opacity-15 scale-110" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/60 to-[#0A0A0A]" />
      </motion.div>

      {/* Ambient Light Leaks */}
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-[#C2A36B]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-[#8B0000]/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Content */}
      <motion.div style={{ opacity, scale }} className="relative z-10 text-center px-6 max-w-5xl">
        {/* Film Label */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
          className="flex items-center justify-center gap-4 mb-10">
          <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#C2A36B]" />
          <span className="font-inter text-[10px] tracking-[0.5em] text-[#C2A36B] uppercase">A Cinematic Short Film</span>
          <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#C2A36B]" />
        </motion.div>

        {/* Main Title */}
        <div className="overflow-hidden">
          <motion.h1 initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.6, duration: 1.4, ease: [0.77, 0, 0.175, 1] }}
            className="font-playfair text-[16vw] md:text-[11vw] lg:text-[9vw] font-bold leading-[0.85] text-glow">
            THE LAST
          </motion.h1>
        </div>
        <div className="overflow-hidden">
          <motion.h1 initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.75, duration: 1.4, ease: [0.77, 0, 0.175, 1] }}
            className="font-playfair text-[16vw] md:text-[11vw] lg:text-[9vw] font-bold leading-[0.85] italic text-[#C2A36B] text-glow flicker">
            PUFF
          </motion.h1>
        </div>

        {/* Tagline */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3, duration: 1 }} className="mt-14 space-y-3">
          <p className="font-inter text-sm md:text-base opacity-40 tracking-wide">"Someone stopped smoking."</p>
          <p className="font-inter text-sm md:text-base opacity-60 tracking-wide">"Someone else didn't survive."</p>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }} className="mt-14">
          <button onClick={() => { openBookingForm(); trackEvent('cta_click', { location: 'hero' }); }} data-hover
            className="group cta-premium inline-flex items-center gap-3 px-10 py-5 border border-[#C2A36B]/50 hover:border-[#C2A36B] hover:bg-[#C2A36B]/10 transition-all duration-500 pulse-glow">
            <Film className="w-4 h-4 text-[#C2A36B]" />
            <span className="font-inter text-sm tracking-[0.2em]">BOOK FREE PREMIERE</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </motion.div>

        {/* Film Info */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
          className="mt-16 flex items-center justify-center gap-8 text-[10px] tracking-[0.3em] opacity-30">
          <span>HYDERABAD 2025</span>
          <span className="w-1 h-1 rounded-full bg-[#C2A36B]" />
          <span>SHORT FILM</span>
          <span className="w-1 h-1 rounded-full bg-[#C2A36B]" />
          <span>DRAMA</span>
        </motion.div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2">
            <span className="font-inter text-[9px] tracking-[0.3em] opacity-20">SCROLL</span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-[#C2A36B]/40 to-transparent" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

// ===== STORY SECTION =====
const StorySection = ({ number, title, content, image, reversed }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });

  return (
    <section ref={ref} className="min-h-screen flex items-center py-24 md:py-32 px-6 md:px-12 lg:px-24 relative">
      <div className="section-divider absolute top-0 left-6 right-6 md:left-12 md:right-12" />

      <div className="max-w-7xl mx-auto w-full">
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-24 items-center ${reversed ? 'lg:[direction:rtl]' : ''}`}>
          {/* Text */}
          <div className={reversed ? 'lg:[direction:ltr]' : ''}>
            <motion.div initial={{ opacity: 0, x: reversed ? 30 : -30 }} animate={isInView ? { opacity: 0.4, x: 0 } : {}} transition={{ duration: 0.8 }}
              className="flex items-center gap-3 mb-4">
              <span className="font-inter text-[10px] tracking-[0.3em]">0{number}</span>
              <span className="w-8 h-[1px] bg-[#C2A36B]/40" />
            </motion.div>

            <motion.h2 initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15, duration: 0.9 }}
              className="font-playfair text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.05]">
              {title}
            </motion.h2>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.35, duration: 0.8 }}
              className="mt-8 space-y-4">
              {content.map((line, i) => (
                <p key={i} className={`font-inter text-base md:text-lg leading-relaxed ${line.emphasis ? 'text-[#C2A36B] italic font-medium' : 'opacity-45'}`}>
                  {line.text}
                </p>
              ))}
            </motion.div>
          </div>

          {/* Cinematic Image */}
          {image && (
            <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.25, duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`relative cinematic-frame light-leak ${reversed ? 'lg:[direction:ltr]' : ''}`}>
              <img src={image} alt="" className="w-full aspect-[4/3] object-cover" />
              {/* Gold corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#C2A36B]/40 pointer-events-none z-[4]" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#C2A36B]/40 pointer-events-none z-[4]" />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

// ===== HORIZONTAL GALLERY SECTION =====
const GallerySection = () => {
  const ref = useRef(null);
  const scrollRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  const galleryImages = [
    { src: IMAGES.coupleRed, caption: 'The Beginning' },
    { src: IMAGES.fatherSon, caption: 'Silent Words' },
    { src: IMAGES.eyes, caption: 'Unspoken Truth' },
    { src: IMAGES.templeWalk, caption: 'The Journey' },
    { src: IMAGES.templeView, caption: 'Sacred Ground' },
    { src: IMAGES.family, caption: 'What Remains' },
    { src: IMAGES.paperNote, caption: 'Last Words' },
  ];

  return (
    <section ref={ref} id="gallery" className="py-24 md:py-32 relative overflow-hidden">
      <div className="section-divider absolute top-0 left-6 right-6 md:left-12 md:right-12" />

      {/* Header */}
      <div className="text-center mb-16 px-6">
        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 0.4 } : {}} transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-4 mb-6">
          <span className="w-12 h-[1px] bg-[#C2A36B]/40" />
          <Film className="w-4 h-4 text-[#C2A36B]" />
          <span className="w-12 h-[1px] bg-[#C2A36B]/40" />
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1, duration: 0.8 }}
          className="font-playfair text-4xl md:text-6xl font-bold">Moments Captured</motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 0.4 } : {}} transition={{ delay: 0.3 }}
          className="font-inter text-sm mt-4 tracking-wide">Drag to explore the visual story</motion.p>
      </div>

      {/* Horizontal Gallery */}
      <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.4, duration: 1 }}>
        <div ref={scrollRef} className="gallery-scroll flex gap-6 overflow-x-auto px-6 md:px-12 pb-6">
          {galleryImages.map((img, i) => (
            <motion.div key={i} className="gallery-item relative group"
              initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 + i * 0.1 }}>
              <div className="cinematic-frame w-[300px] md:w-[400px] aspect-[3/4] relative overflow-hidden">
                <img src={img.src} alt={img.caption} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <span className="font-inter text-[10px] tracking-[0.3em] text-[#C2A36B]">{String(i + 1).padStart(2, '0')}</span>
                  <p className="font-playfair text-xl font-bold mt-1">{img.caption}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

// ===== TRAILER / VIDEO SECTION =====
const TrailerSection = ({ onRequestAccess }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });

  return (
    <section ref={ref} id="trailer" className="py-24 md:py-32 px-6 relative overflow-hidden">
      <div className="section-divider absolute top-0 left-6 right-6 md:left-12 md:right-12" />

      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 1.2 }}
          className="relative aspect-video overflow-hidden cinematic-frame group">
          {/* Background Image */}
          <img src={IMAGES.templeView} alt="" className="w-full h-full object-cover" />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-500" />

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { openBookingForm(); trackEvent('trailer_play_click'); }}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-[#C2A36B] flex items-center justify-center bg-[#C2A36B]/10 backdrop-blur-sm pulse-glow"
              data-hover>
              <Play className="w-8 h-8 md:w-10 md:h-10 text-[#C2A36B] ml-1" />
            </motion.button>
          </div>

          {/* Label */}
          <div className="absolute bottom-8 left-8 z-10">
            <span className="font-inter text-[10px] tracking-[0.3em] text-[#C2A36B]">OFFICIAL TEASER</span>
            <p className="font-playfair text-2xl md:text-3xl font-bold mt-2">Watch the Trailer</p>
            <p className="font-inter text-xs opacity-40 mt-1">Available at premiere • Book your free seat now</p>
          </div>

          {/* Gold corner accents */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#C2A36B]/40 pointer-events-none z-[4]" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#C2A36B]/40 pointer-events-none z-[4]" />
        </motion.div>
      </div>
    </section>
  );
};

// ===== CAST & CREW SECTION =====
const CastCrewSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });

  const crew = [
    { role: 'Director', name: 'Saiteja', icon: Clapperboard },
    { role: 'Director', name: 'Sravanth', icon: Clapperboard },
    { role: 'Lead Actor', name: 'Yashu', icon: Star },
    { role: 'DOP', name: 'Pavan', icon: Camera },
  ];

  return (
    <section ref={ref} id="cast" className="py-24 md:py-32 px-6 relative">
      <div className="section-divider absolute top-0 left-6 right-6 md:left-12 md:right-12" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 0.4 } : {}} transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-4 mb-6">
            <span className="w-12 h-[1px] bg-[#C2A36B]/40" />
            <Clapperboard className="w-4 h-4 text-[#C2A36B]" />
            <span className="w-12 h-[1px] bg-[#C2A36B]/40" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1, duration: 0.8 }}
            className="font-playfair text-4xl md:text-6xl font-bold">The Minds Behind</motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 0.4 } : {}} transition={{ delay: 0.3 }}
            className="font-inter text-sm mt-4 tracking-wide">The creative forces behind the film</motion.p>
        </div>

        {/* Crew Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {crew.map((member, i) => {
            const Icon = member.icon;
            return (
              <motion.div key={member.role}
                initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }}
                className="glass-card p-6 md:p-8 text-center group" data-hover>
                <div className="w-14 h-14 mx-auto mb-4 rounded-full border border-[#C2A36B]/30 flex items-center justify-center group-hover:border-[#C2A36B] transition-colors">
                  <Icon className="w-6 h-6 text-[#C2A36B]/60 group-hover:text-[#C2A36B] transition-colors" />
                </div>
                <p className="font-inter text-[10px] tracking-[0.3em] text-[#C2A36B] mb-2">{member.role.toUpperCase()}</p>
                <p className="font-playfair text-lg font-bold opacity-50">{member.name}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ===== FINAL REVEAL SECTION =====
const FinalRevealSection = ({ onRequestAccess }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center py-32 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-8">
        <img src={IMAGES.paperNote} alt="" className="w-full h-full object-cover blur-md" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/90 to-[#0A0A0A]" />

      {/* Ambient Glows */}
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-[#C2A36B]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-[#8B0000]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-4xl">
        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 0.4 } : {}}
          className="font-inter text-[10px] tracking-[0.4em] mb-8">THE TRUTH</motion.div>

        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 1 }}
          className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1]">
          "It wasn't his last puff..."
        </motion.h2>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5, duration: 1 }}
          className="font-playfair text-3xl md:text-5xl lg:text-6xl font-bold mt-4 italic text-[#C2A36B] text-glow">
          "...it was someone else's last breath."
        </motion.p>

        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.8 }}
          className="mt-16 space-y-8">
          <p className="font-inter text-sm opacity-40">You don't know the full story.</p>
          <button onClick={() => { openBookingForm(); trackEvent('cta_click', { location: 'final_reveal' }); }} data-hover
            className="cta-premium inline-flex items-center gap-3 bg-[#C2A36B] text-[#0A0A0A] px-12 py-5 font-playfair text-lg hover:bg-[#E8D5B0] transition-all duration-300 glitch-hover">
            <Film className="w-5 h-5" /> BOOK FREE PREMIERE
          </button>
        </motion.div>
      </div>
    </section>
  );
};

// ===== FOMO / SOCIAL PROOF SECTION =====
const FOMOSection = ({ count, onRequestAccess }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let current = 0;
    const timer = setInterval(() => {
      current += count / 50;
      if (current >= count) { setDisplayCount(count); clearInterval(timer); }
      else setDisplayCount(Math.floor(current));
    }, 25);
    return () => clearInterval(timer);
  }, [count, isInView]);

  return (
    <section ref={ref} className="py-24 px-6 relative">
      <div className="gold-separator max-w-4xl mx-auto mb-16" />

      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
            className="glass-card p-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Users className="w-5 h-5 text-[#C2A36B]" />
              <span className="font-playfair text-4xl md:text-5xl font-bold text-[#C2A36B]">{displayCount.toLocaleString()}</span>
            </div>
            <p className="font-inter text-[10px] tracking-[0.2em] opacity-40">ALREADY BOOKED SEATS</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}
            className="glass-card p-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Lock className="w-5 h-5 text-[#C2A36B]" />
              <span className="font-playfair text-4xl md:text-5xl font-bold">LIMITED</span>
            </div>
            <p className="font-inter text-[10px] tracking-[0.2em] opacity-40">PRIVATE SCREENING ENTRIES</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }}
            className="glass-card p-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Eye className="w-5 h-5 text-[#C2A36B]" />
              <span className="font-playfair text-4xl md:text-5xl font-bold">EARLY</span>
            </div>
            <p className="font-inter text-[10px] tracking-[0.2em] opacity-40">VIEWERS WILL UNDERSTAND</p>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}
          className="text-center mt-12">
          <p className="font-inter text-xs opacity-30 italic">"Only early viewers will understand what really happened."</p>
        </motion.div>
      </div>

      <div className="gold-separator max-w-4xl mx-auto mt-16" />
    </section>
  );
};

// ===== FOOTER =====
const Footer = ({ onRequestAccess }) => (
  <footer className="py-20 px-6 md:px-12 relative">
    <div className="max-w-5xl mx-auto">
      {/* Top Row */}
      <div className="grid md:grid-cols-3 gap-12 mb-16">
        {/* Brand */}
        <div>
          <h3 className="font-playfair text-2xl font-bold text-[#C2A36B] mb-3">THE LAST PUFF</h3>
          <p className="font-inter text-sm opacity-30 leading-relaxed">
            A cinematic short film about addiction, love, truth, and consequences.
          </p>
        </div>

        {/* Links */}
        <div className="text-center">
          <p className="font-inter text-[10px] tracking-[0.3em] text-[#C2A36B] mb-4">QUICK LINKS</p>
          <div className="space-y-2">
            {['The Story', 'Gallery', 'Cast & Crew', 'Book Free Premiere'].map(link => (
              <button key={link} onClick={link === 'Book Free Premiere' ? openBookingForm : undefined}
                className="block w-full font-inter text-sm opacity-40 hover:opacity-100 hover:text-[#C2A36B] transition-all" data-hover>
                {link}
              </button>
            ))}
          </div>
        </div>

        {/* Social */}
        <div className="text-center md:text-right">
          <p className="font-inter text-[10px] tracking-[0.3em] text-[#C2A36B] mb-4">FOLLOW US</p>
          <div className="flex items-center justify-center md:justify-end gap-4">
            {[Instagram, Youtube, Mail].map((Icon, i) => (
              <button key={i} className="social-icon w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:border-[#C2A36B]/50" data-hover>
                <Icon className="w-4 h-4 opacity-50" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="gold-separator mb-8" />
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-inter text-[10px] opacity-20">© 2025 The Last Puff. The story remains untold.</p>
        <button onClick={openBookingForm}
          className="font-inter text-xs tracking-[0.2em] opacity-40 hover:opacity-100 hover:text-[#C2A36B] hover-line transition-all" data-hover>
          BOOK FREE PREMIERE
        </button>
        <p className="font-inter text-[10px] opacity-20">Hyderabad, India</p>
      </div>
    </div>
  </footer>
);

// ===== ACCESS MODAL =====
const AccessModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', college: '', interest: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Required';
    if (!formData.phone.trim()) newErrors.phone = 'Required';
    if (!formData.email.trim()) newErrors.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/access-requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (data.success) {
        setSubmitStatus('success');
        trackEvent('access_request_submitted', { email: formData.email });
      } else {
        setErrors({ submit: data.error });
      }
    } catch { setErrors({ submit: 'Network error. Please try again.' }); }
    finally { setIsSubmitting(false); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg" onClick={onClose}>
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative w-full max-w-md bg-[#0A0A0A] border border-[#C2A36B]/30 p-8 md:p-10 modal-content shimmer-border" onClick={e => e.stopPropagation()}>

            <button onClick={onClose} className="absolute top-4 right-4 opacity-40 hover:opacity-100 transition-opacity" data-hover>
              <X className="w-5 h-5" />
            </button>

            {submitStatus === 'success' ? (
              <div className="text-center py-10">
                <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 12 }}
                  className="w-20 h-20 border-2 border-[#C2A36B] rounded-full flex items-center justify-center mx-auto mb-8">
                  <Lock className="w-8 h-8 text-[#C2A36B]" />
                </motion.div>
                <h3 className="font-playfair text-3xl font-bold">You're On The List</h3>
                <p className="font-inter text-sm opacity-40 mt-4">The truth will be revealed soon.</p>
                <div className="gold-separator mt-8 mb-4" />
                <p className="font-inter text-[10px] tracking-[0.2em] opacity-30">CHECK YOUR EMAIL FOR UPDATES</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-[#C2A36B]" />
                  <span className="font-inter text-[10px] tracking-[0.3em] text-[#C2A36B]">PRIVATE SCREENING</span>
                </div>
                <h3 className="font-playfair text-2xl font-bold">Request Access</h3>
                <p className="font-inter text-xs opacity-30 mt-1 mb-6">Limited entries for early viewers</p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  {['name', 'phone', 'email', 'college'].map(field => (
                    <div key={field}>
                      <input type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'} name={field}
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1) + (field === 'college' ? ' (Optional)' : ' *')}
                        value={formData[field]} onChange={e => { setFormData(p => ({ ...p, [field]: e.target.value })); setErrors(p => ({ ...p, [field]: null })); }}
                        className="w-full px-4 py-3 text-sm" />
                      {errors[field] && <p className="text-red-400 text-[10px] mt-1">{errors[field]}</p>}
                    </div>
                  ))}
                  {errors.submit && <p className="text-red-400 text-xs text-center">{errors.submit}</p>}
                  <button type="submit" disabled={isSubmitting} data-hover
                    className="w-full cta-premium bg-[#C2A36B] text-[#0A0A0A] py-3.5 font-inter text-sm tracking-wider hover:bg-[#E8D5B0] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Lock className="w-4 h-4" /> GET EARLY ACCESS</>}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ===== STORY DATA =====
const STORY_SECTIONS = [
  {
    number: 1,
    title: 'HE REMEMBERS DIFFERENTLY',
    content: [
      { text: 'He says it was just a phase.' },
      { text: 'Just nights. Just friends. Just smoke.' },
      { text: 'But memory...', emphasis: true },
      { text: 'doesn\'t always tell the truth.', emphasis: true },
    ],
    image: IMAGES.coupleRed,
  },
  {
    number: 2,
    title: 'THE WARNING WAS NEVER LOUD',
    content: [
      { text: 'No shouting. No drama.' },
      { text: 'Just a man...' },
      { text: 'sitting in silence.' },
      { text: 'Waiting for something he already knew would happen.', emphasis: true },
    ],
    image: IMAGES.fatherSon,
    reversed: true,
  },
  {
    number: 3,
    title: 'SHE NEVER LEFT',
    content: [
      { text: 'She stayed.' },
      { text: 'Through the smoke. Through the silence.' },
      { text: 'Through everything that was slowly breaking.' },
      { text: 'She didn\'t complain. That was the problem.', emphasis: true },
    ],
    image: IMAGES.eyes,
  },
  {
    number: 4,
    title: 'TWO STORIES. ONE ENDING.',
    content: [
      { text: 'He says he quit. He says he changed.' },
      { text: 'But there\'s a version of this story...' },
      { text: 'where he didn\'t.', emphasis: true },
    ],
    image: IMAGES.family,
    reversed: true,
  },
  {
    number: 5,
    title: 'THIS IS ALL THAT\'S LEFT',
    content: [
      { text: 'Not photos. Not memories.' },
      { text: 'Just what remained...' },
      { text: 'after everything else was gone.', emphasis: true },
    ],
    image: IMAGES.paperNote,
  },
  {
    number: 6,
    title: 'IT DIDN\'T HAPPEN TO HIM FIRST',
    content: [
      { text: 'That\'s the part no one expects.' },
      { text: 'The smoke didn\'t take him.' },
      { text: 'It took something else.', emphasis: true },
    ],
    image: IMAGES.templeWalk,
    reversed: true,
  },
];

// ===== MAIN PAGE =====
export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [accessCount, setAccessCount] = useState(1247);

  useEffect(() => {
    // Fetch access count
    fetch('/api/access-requests/count').then(r => r.json()).then(d => d.count && setAccessCount(d.count)).catch(console.error);
    // Track page view
    trackEvent('page_view', { page: 'home' });
  }, []);

  const scrollTo = useCallback((section) => {
    const el = document.getElementById(section);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <main className="bg-[#0A0A0A] text-[#F5E6D3]">
      <CustomCursor />
      <div className="grain" />

      <Navigation onMenuClick={() => setIsMenuOpen(true)} onRequestAccess={openBookingForm} />
      <FullScreenMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onRequestAccess={openBookingForm} onScrollTo={scrollTo} />

      <HeroSection onRequestAccess={openBookingForm} />

      <div id="story">
        {STORY_SECTIONS.map((section) => (
          <StorySection key={section.number} {...section} />
        ))}
      </div>

      <GallerySection />
      <TrailerSection onRequestAccess={openBookingForm} />
      <CastCrewSection />
      <FOMOSection count={accessCount} onRequestAccess={openBookingForm} />
      <FinalRevealSection onRequestAccess={openBookingForm} />
      <Footer onRequestAccess={openBookingForm} />
    </main>
  );
}