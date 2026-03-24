'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { X, ArrowRight, ArrowUpRight, Menu, Loader2, Play } from 'lucide-react';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ALL FILM IMAGES - Updated with new images, removed fire/pyre
const IMAGES = {
  heroSmoke: 'https://customer-assets.emergentagent.com/job_final-inhale/artifacts/ldlaoe9x_Herosection.jpg',
  coupleRed: 'https://customer-assets.emergentagent.com/job_final-inhale/artifacts/099xqrx4_IMG_7002.PNG',
  family: 'https://customer-assets.emergentagent.com/job_final-inhale/artifacts/ax3wetgg_IMG_7001.PNG',
  templeWalk: 'https://customer-assets.emergentagent.com/job_final-inhale/artifacts/vjssmwgv_IMG_7005.PNG',
  templeView: 'https://customer-assets.emergentagent.com/job_final-inhale/artifacts/slrzotpv_IMG_7004.PNG',
  eyes: 'https://customer-assets.emergentagent.com/job_final-inhale/artifacts/h86md1oc_IMG_7003.PNG',
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
      cursorX += (mouseX - cursorX) * 0.12;
      cursorY += (mouseY - cursorY) * 0.12;
      dotX += (mouseX - dotX) * 0.6;
      dotY += (mouseY - dotY) * 0.6;
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
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <span className="font-playfair text-xl font-bold text-white text-shadow">Last The Puff</span>
      </motion.div>
      <div className="flex items-center gap-8">
        <motion.button initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          onClick={onRequestAccess} className="hidden md:block font-inter text-sm text-white hover-line" data-hover>
          Request Access
        </motion.button>
        <motion.button initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          onClick={onMenuClick} className="text-white" data-hover>
          <Menu className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  </nav>
);

// Full Screen Menu
const FullScreenMenu = ({ isOpen, onClose, onRequestAccess }) => {
  const items = [
    { label: 'The Story', href: '#story' },
    { label: 'Characters', href: '#characters' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Request Access', action: onRequestAccess },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ clipPath: 'circle(0% at calc(100% - 48px) 48px)' }}
          animate={{ clipPath: 'circle(150% at calc(100% - 48px) 48px)' }}
          exit={{ clipPath: 'circle(0% at calc(100% - 48px) 48px)' }}
          transition={{ duration: 1, ease: [0.77, 0, 0.175, 1] }}
          className="fixed inset-0 bg-[#0D0D0D] z-[100] flex items-center px-6 md:px-24"
        >
          <button onClick={onClose} className="absolute top-6 right-6 md:right-12 text-white" data-hover>
            <X className="w-8 h-8" />
          </button>
          
          <div className="w-full max-w-5xl">
            {items.map((item, i) => (
              <motion.div key={item.label} initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="mb-2">
                {item.action ? (
                  <button onClick={() => { item.action(); onClose(); }} data-hover
                    className="font-playfair text-[12vw] md:text-[10vw] font-bold leading-none text-white hover:text-[#C2A36B] transition-colors duration-500 flex items-center gap-4 group">
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ) : (
                  <a href={item.href} onClick={onClose} data-hover
                    className="font-playfair text-[12vw] md:text-[10vw] font-bold leading-none text-white hover:text-[#C2A36B] transition-colors duration-500 flex items-center gap-4 group">
                    <span>{item.label}</span>
                    <ArrowRight className="w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className="absolute bottom-8 left-6 md:left-24 text-white/40 font-inter text-sm">
            A Short Film • Hyderabad 2025
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// HERO SECTION - Cinematic with 3D effects
const HeroSection = ({ onRequestAccess }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const blur = useTransform(scrollYProgress, [0, 1], [0, 10]);

  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouse = (e) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  const rotateX = (mousePos.y - 0.5) * 10;
  const rotateY = (mousePos.x - 0.5) * 10;

  return (
    <section ref={containerRef} className="h-[200vh] relative">
      <div className="sticky top-0 h-screen overflow-hidden perspective-container">
        {/* Hero Background - Smoke Title Image */}
        <motion.div style={{ scale }} className="absolute inset-0">
          <motion.div
            className="w-full h-full smoke-animation pulse-glow"
            style={{ filter: `blur(${blur}px)` }}
          >
            <img src={IMAGES.heroSmoke} alt="The Last Puff" className="w-full h-full object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
        </motion.div>

        {/* 3D Floating Images */}
        <motion.div style={{ opacity, y }} className="absolute inset-0 preserve-3d"
          animate={{ rotateX: rotateX * 0.5, rotateY: rotateY * 0.5 }}
          transition={{ type: 'spring', stiffness: 100, damping: 30 }}>
          
          {/* Floating Image 1 - Top Left */}
          <motion.div
            initial={{ opacity: 0, x: -100, rotateZ: -10 }}
            animate={{ opacity: 1, x: 0, rotateZ: -6 }}
            transition={{ delay: 1, duration: 1.2 }}
            className="absolute top-[15%] left-[5%] w-[25vw] max-w-[300px] float-animation card-3d hidden lg:block"
            style={{ transform: `translateZ(50px)` }}
          >
            <div className="img-zoom border-4 border-white/20">
              <img src={IMAGES.coupleRed} alt="The Beginning" className="w-full aspect-[4/3] object-cover" />
            </div>
          </motion.div>

          {/* Floating Image 2 - Top Right */}
          <motion.div
            initial={{ opacity: 0, x: 100, rotateZ: 10 }}
            animate={{ opacity: 1, x: 0, rotateZ: 8 }}
            transition={{ delay: 1.2, duration: 1.2 }}
            className="absolute top-[10%] right-[5%] w-[20vw] max-w-[250px] float-animation-reverse card-3d hidden lg:block"
            style={{ transform: `translateZ(80px)` }}
          >
            <div className="img-zoom border-4 border-white/20 rounded-full overflow-hidden">
              <img src={IMAGES.eyes} alt="Her Eyes" className="w-full aspect-square object-cover" />
            </div>
          </motion.div>

          {/* Floating Image 3 - Bottom Right */}
          <motion.div
            initial={{ opacity: 0, y: 100, rotateZ: 5 }}
            animate={{ opacity: 1, y: 0, rotateZ: 3 }}
            transition={{ delay: 1.4, duration: 1.2 }}
            className="absolute bottom-[20%] right-[8%] w-[22vw] max-w-[280px] float-animation card-3d hidden lg:block"
            style={{ transform: `translateZ(60px)` }}
          >
            <div className="img-zoom border-4 border-white/20">
              <img src={IMAGES.family} alt="Happy Days" className="w-full aspect-[4/3] object-cover" />
            </div>
          </motion.div>
        </motion.div>

        {/* Content Overlay */}
        <motion.div style={{ opacity }} className="absolute inset-0 flex flex-col justify-end pb-24 px-6 md:px-12 lg:px-24">
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="font-playfair text-xl md:text-2xl italic text-white/70 mb-4 text-shadow"
          >
            "A story they never wanted you to see"
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.8 }}
            className="font-inter text-sm text-white/50 max-w-md mb-8"
          >
            Some habits don't kill you instantly... They kill the people around you first.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9, duration: 0.8 }}
          >
            <button onClick={onRequestAccess} data-hover
              className="magnetic-btn group flex items-center gap-4 bg-white/10 backdrop-blur-sm border border-white/30 px-8 py-4 hover:bg-white hover:text-black transition-all duration-500">
              <Play className="w-5 h-5" />
              <span className="font-playfair text-lg">Request Premiere Access</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>

          {/* Premiere Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
            className="mt-12 flex items-center gap-8"
          >
            <div className="w-20 h-20 border-2 border-[#C2A36B] rounded-full flex items-center justify-center rotate-animation">
              <span className="font-playfair text-[10px] text-[#C2A36B] text-center leading-tight">PREMIERE<br/>2025</span>
            </div>
            <div className="text-white/40 font-inter text-xs tracking-widest">
              HYDERABAD • EXCLUSIVE • LIMITED ACCESS
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
            className="font-inter text-xs tracking-widest text-white/40">
            SCROLL TO EXPLORE
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Story Section with 3D Cards
const StorySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} id="story" className="py-32 md:py-48 px-6 md:px-12 lg:px-24 cream-section overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <motion.span
              initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
              className="font-inter text-xs tracking-[0.3em] uppercase opacity-50">
              The Beginning
            </motion.span>
            
            <motion.h2
              initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3, duration: 0.8 }}
              className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold mt-4 leading-[0.9]">
              He Thought<br/><span className="italic text-[#8B0000]">He Was Free</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 }}
              className="mt-12 font-inter text-lg leading-relaxed opacity-70 max-w-lg">
              Nights filled with laughter. Bottles passed like memories. Smoke shared like friendship. 
              He called it freedom. It was just the beginning.
            </motion.p>
          </div>

          {/* 3D Image Stack */}
          <div className="relative h-[60vh] perspective-container">
            <motion.div
              initial={{ opacity: 0, x: 100, rotateY: -20 }} animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
              transition={{ delay: 0.4, duration: 1 }}
              className="absolute top-0 right-0 w-[80%] card-3d">
              <div className="img-zoom shadow-2xl">
                <img src={IMAGES.coupleRed} alt="" className="w-full aspect-[4/3] object-cover" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -50, rotateY: 20 }} animate={isInView ? { opacity: 1, x: 0, rotateY: 5 } : {}}
              transition={{ delay: 0.6, duration: 1 }}
              className="absolute bottom-0 left-0 w-[70%] card-3d" style={{ transform: 'rotate(-3deg)' }}>
              <div className="img-zoom shadow-2xl border-8 border-white">
                <img src={IMAGES.family} alt="" className="w-full aspect-[4/3] object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Characters Section
const CharactersSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const characters = [
    { name: 'HER', role: 'The One Who Stayed', image: IMAGES.eyes },
    { name: 'THEM', role: 'What Could Have Been', image: IMAGES.family },
    { name: 'THE JOURNEY', role: 'Their Path Together', image: IMAGES.templeWalk },
  ];

  return (
    <section ref={ref} id="characters" className="py-32 px-6 md:px-12 lg:px-24 bg-[#0D0D0D]">
      <div className="max-w-7xl mx-auto">
        <motion.span initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
          className="font-inter text-xs tracking-[0.3em] uppercase text-white/40">
          The Characters
        </motion.span>
        
        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}
          className="font-playfair text-5xl md:text-7xl font-bold text-white mt-4 mb-20">
          Their Story
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {characters.map((char, i) => (
            <motion.div key={char.name}
              initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.15 }}
              className="group" data-hover>
              <div className="img-zoom aspect-[3/4] mb-6 overflow-hidden border-glow">
                <img src={char.image} alt={char.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              </div>
              <h3 className="font-playfair text-3xl font-bold text-white group-hover:text-[#C2A36B] transition-colors">{char.name}</h3>
              <p className="font-inter text-sm text-white/40 mt-2">{char.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Gallery Section - New with all images
const GallerySection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);

  const images = [IMAGES.coupleRed, IMAGES.family, IMAGES.templeWalk, IMAGES.templeView, IMAGES.eyes];

  return (
    <section ref={ref} id="gallery" className="py-32 overflow-hidden cream-section">
      <div className="px-6 md:px-12 lg:px-24 mb-12">
        <span className="font-inter text-xs tracking-[0.3em] uppercase opacity-50">Gallery</span>
        <h2 className="font-playfair text-5xl md:text-7xl font-bold mt-4">Moments</h2>
      </div>

      <motion.div style={{ x }} className="flex gap-8 pl-6 md:pl-24">
        {images.map((img, i) => (
          <motion.div key={i} whileHover={{ scale: 1.05 }} transition={{ duration: 0.5 }}
            className="flex-shrink-0 w-[60vw] md:w-[40vw] card-3d" data-hover>
            <div className="img-zoom">
              <img src={img} alt="" className="w-full aspect-[16/10] object-cover" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

// Quote Section
const QuoteSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center px-6 bg-[#0D0D0D] relative overflow-hidden">
      <motion.div initial={{ scale: 1.2, opacity: 0 }} animate={isInView ? { scale: 1, opacity: 0.15 } : {}}
        transition={{ duration: 2 }} className="absolute inset-0">
        <img src={IMAGES.templeView} alt="" className="w-full h-full object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D] via-transparent to-[#0D0D0D]" />

      <div className="relative z-10 text-center max-w-5xl">
        <motion.h2 initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1 }}
          className="font-playfair text-4xl md:text-6xl lg:text-8xl font-bold text-white leading-tight">
          Some habits don't<br/><span className="italic text-[#C2A36B]">kill you instantly...</span>
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}
          className="font-playfair text-2xl md:text-4xl text-white/50 mt-8">
          they kill the people around you first.
        </motion.p>
      </div>
    </section>
  );
};

// Final CTA
const FinalCTASection = ({ onRequestAccess, count }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let current = 0;
    const timer = setInterval(() => {
      current += count / 60;
      if (current >= count) { setDisplayCount(count); clearInterval(timer); }
      else setDisplayCount(Math.floor(current));
    }, 30);
    return () => clearInterval(timer);
  }, [count, isInView]);

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center px-6 bg-[#0D0D0D] relative overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${IMAGES.templeWalk})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0 bg-[#0D0D0D]/70" />

      <div className="relative z-10 text-center max-w-5xl">
        <motion.h2 initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="font-playfair text-5xl md:text-7xl lg:text-[10vw] font-bold text-white leading-[0.9]">
          It wasn't his<br/><span className="italic text-[#C2A36B]">last puff...</span>
        </motion.h2>
        
        <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}
          className="font-playfair text-5xl md:text-7xl lg:text-[10vw] font-bold text-white mt-4">
          ...it was <span className="text-[#8B0000]">HERS.</span>
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.8 }} className="mt-16">
          <button onClick={onRequestAccess} data-hover
            className="inline-flex items-center gap-4 font-playfair text-xl bg-[#F5E6D3] text-[#0D0D0D] px-12 py-6 hover:bg-[#C2A36B] transition-all duration-500 glitch">
            Request Premiere Access <ArrowRight className="w-6 h-6" />
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 1 }} className="mt-20">
          <p className="font-playfair text-7xl md:text-9xl font-bold text-[#C2A36B]">{displayCount.toLocaleString()}</p>
          <p className="font-inter text-sm tracking-widest text-white/40 mt-2">PEOPLE HAVE REQUESTED ACCESS</p>
        </motion.div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => (
  <footer className="py-16 px-6 md:px-12 lg:px-24 cream-section border-t border-black/10">
    <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
      <div>
        <h3 className="font-playfair text-4xl font-bold">Last The Puff</h3>
        <p className="font-inter text-sm mt-4 opacity-50">A cinematic exploration of addiction, love, and consequence.</p>
      </div>
      <div>
        <p className="font-inter text-xs tracking-widest uppercase opacity-50 mb-4">Navigate</p>
        <ul className="space-y-2">
          {['Story', 'Characters', 'Gallery'].map(item => (
            <li key={item}><a href={`#${item.toLowerCase()}`} className="font-inter hover-line" data-hover>{item}</a></li>
          ))}
        </ul>
      </div>
      <div>
        <p className="font-inter text-xs tracking-widest uppercase opacity-50 mb-4">Connect</p>
        <ul className="space-y-2">
          {['Instagram', 'Twitter', 'Contact'].map(item => (
            <li key={item}><a href="#" className="font-inter hover-line" data-hover>{item}</a></li>
          ))}
        </ul>
      </div>
    </div>
    <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-black/10 flex justify-between text-xs opacity-50">
      <p>© 2025 Last The Puff</p>
      <p>Hyderabad, India</p>
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
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={onClose}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-lg bg-[#0D0D0D] border border-[#C2A36B]/30 p-8 md:p-12 modal-content" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white" data-hover><X className="w-6 h-6" /></button>

            {submitStatus === 'success' ? (
              <div className="text-center py-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 rounded-full border-2 border-[#C2A36B] flex items-center justify-center mx-auto mb-6">
                  <span className="font-playfair text-3xl text-[#C2A36B]">✓</span>
                </motion.div>
                <h3 className="font-playfair text-4xl font-bold text-white">You're In</h3>
                <p className="font-inter text-white/60 mt-4">You are now on the premiere list.</p>
              </div>
            ) : (
              <>
                <span className="font-inter text-xs tracking-widest text-[#C2A36B]">LIMITED ACCESS</span>
                <h3 className="font-playfair text-4xl font-bold text-white mt-2">Request Access</h3>
                <p className="font-inter text-sm text-white/40 mt-2 mb-8">Join the premiere list</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {['name', 'phone', 'email', 'college'].map(field => (
                    <div key={field}>
                      <input type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'} name={field}
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1) + (field === 'college' ? ' (Optional)' : ' *')}
                        value={formData[field]} onChange={e => { setFormData(p => ({ ...p, [field]: e.target.value })); setErrors(p => ({ ...p, [field]: null })); }}
                        className="w-full px-4 py-4" />
                      {errors[field] && <p className="text-red-400 text-xs mt-1">{errors[field]}</p>}
                    </div>
                  ))}
                  <textarea name="interest" placeholder="Why do you want to watch? (Optional)" value={formData.interest}
                    onChange={e => setFormData(p => ({ ...p, interest: e.target.value }))} rows={3} className="w-full px-4 py-4 resize-none" />
                  {errors.submit && <p className="text-red-400 text-sm text-center">{errors.submit}</p>}
                  <button type="submit" disabled={isSubmitting} data-hover
                    className="w-full bg-[#C2A36B] text-[#0D0D0D] font-playfair text-lg py-4 hover:bg-[#F5E6D3] transition-colors disabled:opacity-50 flex items-center justify-center gap-3">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Join List <ArrowRight className="w-5 h-5" /></>}
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

// Main Page
export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [accessCount, setAccessCount] = useState(1247);

  useEffect(() => {
    fetch('/api/access-requests/count').then(r => r.json()).then(d => d.count && setAccessCount(d.count)).catch(console.error);
  }, []);

  return (
    <main className="bg-[#0D0D0D]">
      <CustomCursor />
      <div className="grain" />
      
      <Navigation onMenuClick={() => setIsMenuOpen(true)} onRequestAccess={() => setIsModalOpen(true)} />
      <FullScreenMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onRequestAccess={() => setIsModalOpen(true)} />
      
      <HeroSection onRequestAccess={() => setIsModalOpen(true)} />
      <StorySection />
      <CharactersSection />
      <GallerySection />
      <QuoteSection />
      <FinalCTASection onRequestAccess={() => setIsModalOpen(true)} count={accessCount} />
      <Footer />
      
      <AccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}