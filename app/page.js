'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useInView } from 'framer-motion';
import { X, ArrowRight, ArrowUpRight, Menu, Loader2, Play } from 'lucide-react';

// ALL FILM IMAGES - Complete collection
const IMAGES = {
  coupleRed: 'https://customer-assets.emergentagent.com/job_final-inhale/artifacts/099xqrx4_IMG_7002.PNG',
  family: 'https://customer-assets.emergentagent.com/job_final-inhale/artifacts/ax3wetgg_IMG_7001.PNG',
  templeWalk: 'https://customer-assets.emergentagent.com/job_final-inhale/artifacts/vjssmwgv_IMG_7005.PNG',
  templeView: 'https://customer-assets.emergentagent.com/job_final-inhale/artifacts/slrzotpv_IMG_7004.PNG',
  eyes: 'https://customer-assets.emergentagent.com/job_final-inhale/artifacts/h86md1oc_IMG_7003.PNG',
  paperNote: 'https://customer-assets.emergentagent.com/job_final-inhale/artifacts/esw4c35y_IMG_7008.PNG',
  fatherSon: 'https://customer-assets.emergentagent.com/job_final-inhale/artifacts/y1qefch0_IMG_7007.PNG',
};

// Custom Cursor
const CustomCursor = () => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isLight, setIsLight] = useState(false);

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

    const handleOver = (e) => {
      if (e.target.closest('a, button, [data-hover]')) setIsHovering(true);
      if (e.target.closest('[data-light-cursor]')) setIsLight(true);
    };
    const handleOut = (e) => {
      if (e.target.closest('a, button, [data-hover]')) setIsHovering(false);
      if (e.target.closest('[data-light-cursor]')) setIsLight(false);
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
      <div ref={cursorRef} className={`cursor-main hidden md:block ${isHovering ? 'hovering' : ''} ${isLight ? 'light' : ''}`} style={{ transform: 'translate(-50%, -50%)' }} />
      <div ref={dotRef} className="cursor-dot hidden md:block" style={{ transform: 'translate(-50%, -50%)' }} />
    </>
  );
};

// Navigation
const Navigation = ({ onMenuClick, onRequestAccess }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 mix-blend-difference">
    <div className="flex justify-between items-center">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <span className="font-playfair text-xl font-bold text-white">Last The Puff</span>
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
          className="fixed inset-0 bg-[#F5E6D3] z-[100] flex items-center px-6 md:px-24"
        >
          <button onClick={onClose} className="absolute top-6 right-6 md:right-12" data-hover>
            <X className="w-8 h-8" />
          </button>
          
          <div className="w-full max-w-5xl">
            {items.map((item, i) => (
              <motion.div key={item.label} initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: [0.77, 0, 0.175, 1] }} className="mb-2">
                {item.action ? (
                  <button onClick={() => { item.action(); onClose(); }} data-hover
                    className="font-playfair text-[12vw] md:text-[9vw] font-bold leading-[0.95] hover:italic transition-all duration-500 flex items-center gap-4 group">
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ) : (
                  <a href={item.href} onClick={onClose} data-hover
                    className="font-playfair text-[12vw] md:text-[9vw] font-bold leading-[0.95] hover:italic transition-all duration-500 flex items-center gap-4 group">
                    <span>{item.label}</span>
                    <ArrowRight className="w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// HERO SECTION - Clean Miranda-style Typography Hero
const HeroSection = ({ onRequestAccess }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={containerRef} className="min-h-screen relative bg-[#F5E6D3] overflow-hidden">
      {/* Subtle background image */}
      <div className="absolute inset-0 opacity-[0.03]">
        <img src={IMAGES.eyes} alt="" className="w-full h-full object-cover" />
      </div>

      <motion.div style={{ opacity }} className="relative z-10 min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 py-32">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-4 items-center">
            {/* Left - Main Typography */}
            <div className="lg:col-span-7">
              {/* Small label */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mb-8"
              >
                <span className="font-inter text-xs tracking-[0.4em] uppercase opacity-40">A Short Film • 2025</span>
              </motion.div>

              {/* Main Title - Huge Typography */}
              <h1 className="font-playfair font-bold leading-[0.85]">
                <div className="overflow-hidden">
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.4, duration: 1, ease: [0.77, 0, 0.175, 1] }}
                    className="text-[16vw] md:text-[12vw] lg:text-[9vw]"
                  >
                    Last
                  </motion.div>
                </div>
                <div className="overflow-hidden flex items-baseline gap-4">
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.5, duration: 1, ease: [0.77, 0, 0.175, 1] }}
                    className="text-[16vw] md:text-[12vw] lg:text-[9vw] italic text-[#8B0000]"
                  >
                    The
                  </motion.div>
                  {/* Small circular image inline */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
                    className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden float-subtle hidden md:block"
                  >
                    <img src={IMAGES.family} alt="" className="w-full h-full object-cover" />
                  </motion.div>
                </div>
                <div className="overflow-hidden">
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.6, duration: 1, ease: [0.77, 0, 0.175, 1] }}
                    className="text-[16vw] md:text-[12vw] lg:text-[9vw]"
                  >
                    Puff
                  </motion.div>
                </div>
              </h1>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="mt-8 font-inter text-sm md:text-base leading-relaxed opacity-50 max-w-md"
              >
                Some habits don't kill you instantly...<br/>
                They kill the people around you first.
              </motion.p>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="mt-10"
              >
                <button onClick={onRequestAccess} data-hover
                  className="group flex items-center gap-4 font-playfair text-lg border-b-2 border-black pb-2 hover:gap-6 transition-all duration-500">
                  <span>Request Premiere Access</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                </button>
              </motion.div>
            </div>

            {/* Right - Image Stack */}
            <div className="lg:col-span-5 relative">
              <div className="relative h-[50vh] md:h-[60vh]">
                {/* Main Image */}
                <motion.div
                  style={{ y: y1 }}
                  initial={{ opacity: 0, x: 50, rotate: 3 }}
                  animate={{ opacity: 1, x: 0, rotate: 3 }}
                  transition={{ delay: 0.8, duration: 1, ease: [0.77, 0, 0.175, 1] }}
                  className="absolute top-0 right-0 w-[85%] card-3d"
                >
                  <div className="img-zoom">
                    <img src={IMAGES.coupleRed} alt="The Beginning" className="w-full aspect-[4/3] object-cover shadow-2xl" />
                  </div>
                </motion.div>

                {/* Secondary Image */}
                <motion.div
                  style={{ y: y2 }}
                  initial={{ opacity: 0, x: -30, rotate: -4 }}
                  animate={{ opacity: 1, x: 0, rotate: -4 }}
                  transition={{ delay: 1, duration: 1, ease: [0.77, 0, 0.175, 1] }}
                  className="absolute bottom-0 left-0 w-[65%] card-3d"
                >
                  <div className="img-zoom border-8 border-[#F5E6D3] shadow-xl">
                    <img src={IMAGES.eyes} alt="Her Eyes" className="w-full aspect-square object-cover" />
                  </div>
                </motion.div>

                {/* Stamp */}
                <motion.div
                  initial={{ opacity: 0, scale: 0, rotate: -30 }}
                  animate={{ opacity: 1, scale: 1, rotate: -12 }}
                  transition={{ delay: 1.4, duration: 0.6 }}
                  className="absolute top-[40%] left-[50%] z-20"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 border-2 border-black rounded-full flex items-center justify-center rotate-slow bg-[#F5E6D3]">
                    <div className="text-center">
                      <span className="font-playfair text-[8px] md:text-[10px] font-bold block">PREMIERE</span>
                      <span className="font-playfair text-[6px] md:text-[8px] block">HYDERABAD</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
          className="font-inter text-xs tracking-widest opacity-30">
          SCROLL
        </motion.div>
      </motion.div>
    </section>
  );
};

// Story Section - The Beginning & The Father
const StorySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} id="story" className="py-24 md:py-40 px-6 md:px-12 lg:px-24 bg-[#F5E6D3]">
      <div className="max-w-7xl mx-auto">
        {/* First Story Block */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-32">
          <div>
            <motion.span initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
              className="font-inter text-xs tracking-[0.3em] uppercase opacity-40">01 / The Beginning</motion.span>
            
            <motion.h2 initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3, duration: 0.8 }}
              className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold mt-4 leading-[0.9]">
              He Thought<br/><span className="italic text-[#8B0000]">He Was Free</span>
            </motion.h2>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-8 font-inter text-base md:text-lg leading-relaxed opacity-60 max-w-lg">
              Nights filled with laughter. Bottles passed like memories. Smoke shared like friendship. 
              He called it freedom. It was just the beginning of the end.
            </motion.p>
          </div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.6, duration: 1 }}
            className="card-3d">
            <div className="img-zoom shadow-2xl">
              <img src={IMAGES.coupleRed} alt="" className="w-full aspect-[4/3] object-cover" />
            </div>
          </motion.div>
        </div>

        {/* Second Story Block - Father */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.8, duration: 1 }}
            className="lg:order-2">
            <span className="font-inter text-xs tracking-[0.3em] uppercase opacity-40">02 / The Warning</span>
            
            <h2 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold mt-4 leading-[0.9]">
              A Warning<br/><span className="italic text-[#8B0000]">He Ignored</span>
            </h2>

            <p className="mt-8 font-inter text-base md:text-lg leading-relaxed opacity-60 max-w-lg">
              A father who had seen it all. Sitting in silence. Watching history repeat itself.
              "Son, I've been there..." But some lessons can only be learned the hard way.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 1, duration: 1 }}
            className="lg:order-1 card-3d">
            <div className="img-zoom shadow-2xl">
              <img src={IMAGES.fatherSon} alt="" className="w-full aspect-[16/9] object-cover" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Characters Section - Updated with THE END
const CharactersSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const characters = [
    { name: 'HER', role: 'The One Who Stayed', image: IMAGES.eyes },
    { name: 'THEM', role: 'What Could Have Been', image: IMAGES.family },
    { name: 'THE END', role: 'This Is Our Last Puff', image: IMAGES.paperNote },
  ];

  return (
    <section ref={ref} id="characters" className="py-24 md:py-40 px-6 md:px-12 lg:px-24 dark-section" data-light-cursor>
      <div className="max-w-7xl mx-auto">
        <motion.span initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
          className="font-inter text-xs tracking-[0.3em] uppercase opacity-40">Their Story</motion.span>
        
        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 0.8 }}
          className="font-playfair text-5xl md:text-7xl font-bold mt-4 mb-16 md:mb-24">
          The Characters
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {characters.map((char, i) => (
            <motion.div key={char.name}
              initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.8 }}
              className="group" data-hover>
              <div className="img-zoom aspect-[3/4] mb-6 overflow-hidden">
                <img src={char.image} alt={char.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
              </div>
              <h3 className="font-playfair text-2xl md:text-3xl font-bold group-hover:text-[#C2A36B] transition-colors duration-500">{char.name}</h3>
              <p className="font-inter text-sm opacity-40 mt-2">{char.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Gallery - Horizontal Scroll
const GallerySection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);

  const images = [IMAGES.coupleRed, IMAGES.family, IMAGES.templeWalk, IMAGES.templeView, IMAGES.fatherSon, IMAGES.paperNote];

  return (
    <section ref={ref} id="gallery" className="py-24 md:py-32 overflow-hidden bg-[#F5E6D3]">
      <div className="px-6 md:px-12 lg:px-24 mb-12">
        <span className="font-inter text-xs tracking-[0.3em] uppercase opacity-40">Gallery</span>
        <h2 className="font-playfair text-5xl md:text-7xl font-bold mt-4">Moments</h2>
      </div>

      <motion.div style={{ x }} className="flex gap-4 md:gap-6 pl-6 md:pl-24">
        {images.map((img, i) => (
          <motion.div key={i} whileHover={{ scale: 1.02 }} transition={{ duration: 0.5 }}
            className="flex-shrink-0 w-[80vw] md:w-[50vw] lg:w-[40vw] card-3d" data-hover>
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
    <section ref={ref} className="py-32 md:py-48 px-6 md:px-12 lg:px-24 dark-section relative overflow-hidden" data-light-cursor>
      {/* Background */}
      <div className="absolute inset-0 opacity-10">
        <img src={IMAGES.templeView} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 1 }}>
          <span className="font-playfair text-[20vw] opacity-10 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">"</span>
          
          <h2 className="font-playfair text-3xl md:text-5xl lg:text-7xl font-bold leading-tight">
            Some habits don't<br/>
            <span className="italic text-[#C2A36B]">kill you instantly...</span>
          </h2>
          
          <p className="font-playfair text-xl md:text-3xl lg:text-4xl opacity-50 mt-6">
            they kill the people around you first.
          </p>
        </motion.div>
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
      current += count / 50;
      if (current >= count) { setDisplayCount(count); clearInterval(timer); }
      else setDisplayCount(Math.floor(current));
    }, 30);
    return () => clearInterval(timer);
  }, [count, isInView]);

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center px-6 dark-section relative overflow-hidden" data-light-cursor>
      {/* Background */}
      <div className="absolute inset-0 opacity-15">
        <img src={IMAGES.paperNote} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/80 to-[#0D0D0D]" />

      <div className="relative z-10 text-center max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1 }}>
          <h2 className="font-playfair text-4xl md:text-6xl lg:text-8xl font-bold leading-[0.9]">
            It wasn't his<br/>
            <span className="italic text-[#C2A36B]">last puff...</span>
          </h2>
          
          <p className="font-playfair text-4xl md:text-6xl lg:text-8xl font-bold mt-4">
            ...it was <span className="text-[#8B0000]">HERS.</span>
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5, duration: 0.8 }} className="mt-12 md:mt-16">
          <button onClick={onRequestAccess} data-hover
            className="inline-flex items-center gap-4 font-playfair text-lg md:text-xl bg-[#F5E6D3] text-[#0D0D0D] px-8 md:px-12 py-5 md:py-6 hover:bg-[#C2A36B] transition-all duration-500">
            Request Premiere Access <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.8 }} className="mt-16 md:mt-20">
          <p className="font-playfair text-6xl md:text-8xl lg:text-9xl font-bold text-[#C2A36B]">{displayCount.toLocaleString()}</p>
          <p className="font-inter text-xs md:text-sm tracking-widest opacity-40 mt-2">PEOPLE HAVE REQUESTED ACCESS</p>
        </motion.div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => (
  <footer className="py-16 md:py-20 px-6 md:px-12 lg:px-24 bg-[#F5E6D3] border-t border-black/10">
    <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
      <div>
        <h3 className="font-playfair text-3xl md:text-4xl font-bold">Last The Puff</h3>
        <p className="font-inter text-sm mt-4 opacity-50">A cinematic exploration of addiction, love, and consequence.</p>
      </div>
      <div>
        <p className="font-inter text-xs tracking-widest uppercase opacity-40 mb-4">Navigate</p>
        <ul className="space-y-2">
          {['Story', 'Characters', 'Gallery'].map(item => (
            <li key={item}><a href={`#${item.toLowerCase()}`} className="font-inter hover-line" data-hover>{item}</a></li>
          ))}
        </ul>
      </div>
      <div>
        <p className="font-inter text-xs tracking-widest uppercase opacity-40 mb-4">Connect</p>
        <ul className="space-y-2">
          {['Instagram', 'Twitter', 'Contact'].map(item => (
            <li key={item}><a href="#" className="font-inter hover-line" data-hover>{item}</a></li>
          ))}
        </ul>
      </div>
    </div>
    <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-40">
      <p>© 2025 Last The Puff. All rights reserved.</p>
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
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={onClose}>
          <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="relative w-full max-w-md bg-[#0D0D0D] border border-[#C2A36B]/20 p-8 md:p-10 modal-content" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors" data-hover><X className="w-5 h-5" /></button>

            {submitStatus === 'success' ? (
              <div className="text-center py-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
                  className="w-16 h-16 rounded-full border-2 border-[#C2A36B] flex items-center justify-center mx-auto mb-6">
                  <span className="font-playfair text-2xl text-[#C2A36B]">✓</span>
                </motion.div>
                <h3 className="font-playfair text-3xl font-bold text-white">You're In</h3>
                <p className="font-inter text-white/50 mt-4 text-sm">You are now on the premiere list.</p>
              </div>
            ) : (
              <>
                <span className="font-inter text-[10px] tracking-widest text-[#C2A36B]">LIMITED ACCESS</span>
                <h3 className="font-playfair text-3xl font-bold text-white mt-1">Request Access</h3>
                <p className="font-inter text-xs text-white/30 mt-1 mb-6">Join the Hyderabad premiere list</p>
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
                  <textarea name="interest" placeholder="Why do you want to watch? (Optional)" value={formData.interest}
                    onChange={e => setFormData(p => ({ ...p, interest: e.target.value }))} rows={2} className="w-full px-4 py-3 text-sm resize-none" />
                  {errors.submit && <p className="text-red-400 text-xs text-center">{errors.submit}</p>}
                  <button type="submit" disabled={isSubmitting} data-hover
                    className="w-full bg-[#C2A36B] text-[#0D0D0D] font-playfair py-3 hover:bg-[#F5E6D3] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Join List <ArrowRight className="w-4 h-4" /></>}
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
    <main className="bg-[#F5E6D3]">
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