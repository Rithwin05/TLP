'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import { X, ArrowRight, Menu, Loader2, Lock, Users, Eye, EyeOff } from 'lucide-react';

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

// CSS Animated Particles
const FloatingParticles = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#C2A36B]"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 0.6, 0], y: -200 }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
};

// Custom Cursor
const CustomCursor = () => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0, dotX = 0, dotY = 0;

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
    const handleOver = (e) => { if (e.target.closest('a, button, [data-hover]')) setIsHovering(true); };
    const handleOut = (e) => { if (e.target.closest('a, button, [data-hover]')) setIsHovering(false); };

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
      <div ref={cursorRef} className={`cursor-main hidden md:block ${isHovering ? 'hovering' : ''}`} style={{ transform: 'translate(-50%, -50%)' }} />
      <div ref={dotRef} className="cursor-dot hidden md:block" style={{ transform: 'translate(-50%, -50%)' }} />
    </>
  );
};

// Navigation
const Navigation = ({ onMenuClick, onRequestAccess }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6">
    <div className="flex justify-between items-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <span className="font-playfair text-lg font-bold text-[#C2A36B]">LTP</span>
      </motion.div>
      <div className="flex items-center gap-6">
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          onClick={onRequestAccess} className="hidden md:flex items-center gap-2 text-xs tracking-widest opacity-60 hover:opacity-100 hover-line" data-hover>
          <Lock className="w-3 h-3" /> REQUEST ACCESS
        </motion.button>
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          onClick={onMenuClick} data-hover>
          <Menu className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  </nav>
);

// Full Screen Menu
const FullScreenMenu = ({ isOpen, onClose, onRequestAccess }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#0A0A0A] z-[100] flex items-center justify-center">
        <button onClick={onClose} className="absolute top-6 right-6" data-hover><X className="w-6 h-6" /></button>
        <div className="text-center">
          {['The Story', 'Request Access'].map((item, i) => (
            <motion.div key={item} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
              <button onClick={() => { if (item === 'Request Access') onRequestAccess(); onClose(); }} data-hover
                className="font-playfair text-5xl md:text-7xl font-bold block mb-4 hover:text-[#C2A36B] transition-colors">
                {item}
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

// HERO SECTION - Mysterious & Cinematic
const HeroSection = ({ onRequestAccess }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <section ref={ref} className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Floating Particles */}
      <FloatingParticles />
      
      {/* Vignette */}
      <div className="vignette" />

      {/* Background Image - Blurred & Mysterious */}
      <div className="absolute inset-0 z-0">
        <img src={IMAGES.eyes} alt="" className="w-full h-full object-cover opacity-10 blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A]" />
      </div>

      {/* Content */}
      <motion.div style={{ opacity, scale }} className="relative z-10 text-center px-6 max-w-4xl">
        {/* Mysterious Label */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-3 mb-8">
          <span className="w-8 h-[1px] bg-[#C2A36B]" />
          <span className="font-inter text-[10px] tracking-[0.4em] text-[#C2A36B]">THIS STORY IS INCOMPLETE</span>
          <span className="w-8 h-[1px] bg-[#C2A36B]" />
        </motion.div>

        {/* Main Title */}
        <div className="overflow-hidden">
          <motion.h1 initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ delay: 0.6, duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
            className="font-playfair text-[15vw] md:text-[12vw] lg:text-[10vw] font-bold leading-[0.85] text-glow">
            THE LAST
          </motion.h1>
        </div>
        <div className="overflow-hidden">
          <motion.h1 initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ delay: 0.75, duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
            className="font-playfair text-[15vw] md:text-[12vw] lg:text-[10vw] font-bold leading-[0.85] italic text-[#C2A36B] text-glow flicker">
            PUFF
          </motion.h1>
        </div>

        {/* Mysterious Hook */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-12 space-y-2">
          <p className="font-inter text-sm md:text-base opacity-50">"Someone stopped smoking."</p>
          <p className="font-inter text-sm md:text-base opacity-70">"Someone else didn't survive."</p>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }} className="mt-12">
          <button onClick={onRequestAccess} data-hover
            className="group inline-flex items-center gap-3 px-8 py-4 border border-[#C2A36B]/50 hover:border-[#C2A36B] hover:bg-[#C2A36B]/10 transition-all duration-500 pulse-glow">
            <Lock className="w-4 h-4 text-[#C2A36B]" />
            <span className="font-inter text-sm tracking-widest">REQUEST PREMIERE ACCESS</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
            className="font-inter text-[10px] tracking-widest opacity-30">SCROLL TO UNCOVER</motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

// Story Section Component
const StorySection = ({ number, title, content, image, isBlurred = true }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  return (
    <section ref={ref} className="min-h-screen flex items-center py-24 md:py-32 px-6 md:px-12 lg:px-24 relative">
      {/* Section Divider */}
      <div className="section-divider absolute top-0 left-6 right-6 md:left-12 md:right-12" />

      <div className="max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <div>
            <motion.span initial={{ opacity: 0 }} animate={isInView ? { opacity: 0.4 } : {}}
              className="font-inter text-[10px] tracking-[0.3em]">0{number} /</motion.span>
            
            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 0.8 }}
              className="font-playfair text-3xl md:text-5xl lg:text-6xl font-bold mt-4 leading-[1.1]">
              {title}
            </motion.h2>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-8 space-y-4">
              {content.map((line, i) => (
                <p key={i} className={`font-inter text-base md:text-lg leading-relaxed ${line.emphasis ? 'text-[#C2A36B] italic' : 'opacity-50'}`}>
                  {line.text}
                </p>
              ))}
            </motion.div>
          </div>

          {/* Image - Mysterious */}
          {image && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.3, duration: 1 }}
              className="relative">
              <div className="img-mask">
                <img src={image} alt="" className={`w-full aspect-[4/3] object-cover ${isBlurred ? 'mysterious-img' : ''}`} />
              </div>
              {isBlurred && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded">
                    <span className="font-inter text-[10px] tracking-widest flex items-center gap-2">
                      <EyeOff className="w-3 h-3" /> STORY HIDDEN
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

// Final Reveal Section
const FinalRevealSection = ({ onRequestAccess }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center py-32 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-10">
        <img src={IMAGES.paperNote} alt="" className="w-full h-full object-cover blur-md" />
      </div>

      <div className="relative z-10 text-center max-w-4xl">
        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 0.4 } : {}}
          className="font-inter text-[10px] tracking-[0.3em] mb-8">THE TRUTH</motion.div>

        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 1 }}
          className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1]">
          "It wasn't his last puff..."
        </motion.h2>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5, duration: 1 }}
          className="font-playfair text-3xl md:text-5xl lg:text-6xl font-bold mt-4 italic text-[#C2A36B]">
          "...it was someone else's last breath."
        </motion.p>

        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.8 }}
          className="mt-16 space-y-6">
          <p className="font-inter text-sm opacity-50">You don't know the full story.</p>
          <button onClick={onRequestAccess} data-hover
            className="inline-flex items-center gap-3 bg-[#C2A36B] text-[#0A0A0A] px-10 py-5 font-playfair text-lg hover:bg-[#F5E6D3] transition-colors glitch-hover">
            <Lock className="w-5 h-5" /> REQUEST PREMIERE ACCESS
          </button>
        </motion.div>
      </div>
    </section>
  );
};

// FOMO Counter Section
const FOMOSection = ({ count, onRequestAccess }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let current = 0;
    const timer = setInterval(() => {
      current += count / 40;
      if (current >= count) { setDisplayCount(count); clearInterval(timer); }
      else setDisplayCount(Math.floor(current));
    }, 30);
    return () => clearInterval(timer);
  }, [count, isInView]);

  return (
    <section ref={ref} className="py-24 px-6 border-y border-[#C2A36B]/20">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {/* Counter */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-4 h-4 text-[#C2A36B]" />
              <span className="font-playfair text-4xl md:text-5xl font-bold text-[#C2A36B]">{displayCount.toLocaleString()}</span>
            </div>
            <p className="font-inter text-[10px] tracking-widest opacity-40">ALREADY REQUESTED ACCESS</p>
          </motion.div>

          {/* Limited */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-[#C2A36B]" />
              <span className="font-playfair text-4xl md:text-5xl font-bold">LIMITED</span>
            </div>
            <p className="font-inter text-[10px] tracking-widest opacity-40">PRIVATE SCREENING ENTRIES</p>
          </motion.div>

          {/* Exclusive */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-[#C2A36B]" />
              <span className="font-playfair text-4xl md:text-5xl font-bold">EARLY</span>
            </div>
            <p className="font-inter text-[10px] tracking-widest opacity-40">VIEWERS WILL UNDERSTAND</p>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}
          className="text-center mt-12">
          <p className="font-inter text-xs opacity-40 italic">"Only early viewers will understand what really happened."</p>
        </motion.div>
      </div>
    </section>
  );
};

// Footer
const Footer = ({ onRequestAccess }) => (
  <footer className="py-16 px-6 md:px-12">
    <div className="max-w-4xl mx-auto text-center">
      <p className="font-playfair text-2xl md:text-3xl font-bold mb-4">THE LAST PUFF</p>
      <p className="font-inter text-xs opacity-30 mb-8">A Short Film • Hyderabad 2025</p>
      <button onClick={onRequestAccess} className="font-inter text-xs tracking-widest opacity-50 hover:opacity-100 hover-line" data-hover>
        REQUEST ACCESS
      </button>
      <div className="mt-12 pt-8 border-t border-white/10">
        <p className="font-inter text-[10px] opacity-20">© 2025 Last The Puff. The story remains untold.</p>
      </div>
    </div>
  </footer>
);

// Modal
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
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid';
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
      if (data.success) setSubmitStatus('success');
      else setErrors({ submit: data.error });
    } catch { setErrors({ submit: 'Network error' }); }
    finally { setIsSubmitting(false); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md" onClick={onClose}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md bg-[#0A0A0A] border border-[#C2A36B]/30 p-8 md:p-10 modal-content" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-4 right-4 opacity-40 hover:opacity-100" data-hover><X className="w-5 h-5" /></button>

            {submitStatus === 'success' ? (
              <div className="text-center py-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 border border-[#C2A36B] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-6 h-6 text-[#C2A36B]" />
                </motion.div>
                <h3 className="font-playfair text-2xl font-bold">You're On The List</h3>
                <p className="font-inter text-sm opacity-40 mt-4">The truth will be revealed soon.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-[#C2A36B]" />
                  <span className="font-inter text-[10px] tracking-widest text-[#C2A36B]">PRIVATE SCREENING</span>
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
                    className="w-full bg-[#C2A36B] text-[#0A0A0A] py-3 font-inter text-sm tracking-wider hover:bg-[#F5E6D3] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
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

// Story content
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
    isBlurred: false,
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
  },
];

// Main Page
export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [accessCount, setAccessCount] = useState(1247);

  useEffect(() => {
    fetch('/api/access-requests/count').then(r => r.json()).then(d => d.count && setAccessCount(d.count)).catch(console.error);
  }, []);

  return (
    <main className="bg-[#0A0A0A] text-[#F5E6D3]">
      <CustomCursor />
      <div className="grain" />
      
      <Navigation onMenuClick={() => setIsMenuOpen(true)} onRequestAccess={() => setIsModalOpen(true)} />
      <FullScreenMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onRequestAccess={() => setIsModalOpen(true)} />
      
      <HeroSection onRequestAccess={() => setIsModalOpen(true)} />
      
      {STORY_SECTIONS.map((section) => (
        <StorySection key={section.number} {...section} />
      ))}
      
      <FOMOSection count={accessCount} onRequestAccess={() => setIsModalOpen(true)} />
      <FinalRevealSection onRequestAccess={() => setIsModalOpen(true)} />
      <Footer onRequestAccess={() => setIsModalOpen(true)} />
      
      <AccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}