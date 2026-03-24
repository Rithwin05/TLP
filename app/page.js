'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { X, ArrowRight, ArrowUpRight, Menu, Loader2 } from 'lucide-react';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// New Film Images
const IMAGES = {
  eyes: 'https://customer-assets.emergentagent.com/job_final-inhale/artifacts/h86md1oc_IMG_7003.PNG',
  couple: 'https://customer-assets.emergentagent.com/job_final-inhale/artifacts/oiwdme0h_IMG_7002.PNG',
  family: 'https://customer-assets.emergentagent.com/job_final-inhale/artifacts/qr929r3g_IMG_7001.PNG',
  pyre: 'https://customer-assets.emergentagent.com/job_final-inhale/artifacts/h867bqg1_IMG_6999.PNG',
  fire: 'https://customer-assets.emergentagent.com/job_final-inhale/artifacts/y9td8vjq_IMG_6998.PNG',
};

// Custom Cursor Component
const CustomCursor = () => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;

    const moveCursor = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      // Smooth follow for main cursor
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      
      // Faster follow for dot
      dotX += (mouseX - dotX) * 0.5;
      dotY += (mouseY - dotY) * 0.5;

      if (cursor) {
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
      }
      if (dot) {
        dot.style.left = `${dotX}px`;
        dot.style.top = `${dotY}px`;
      }
      requestAnimationFrame(animate);
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, [data-hover]')) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e) => {
      if (e.target.closest('a, button, [data-hover]')) {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    animate();

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <>
      <div 
        ref={cursorRef} 
        className={`cursor-main hidden md:block ${isHovering ? 'hovering' : ''}`}
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div 
        ref={dotRef} 
        className="cursor-dot hidden md:block"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
    </>
  );
};

// Animated Text - Character by Character
const AnimatedTitle = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  const words = children.split(' ');

  return (
    <span ref={ref} className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="word-mask mr-[0.25em]">
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={charIndex}
              className="char inline-block"
              initial={{ y: '100%', opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{
                duration: 0.8,
                delay: delay + wordIndex * 0.1 + charIndex * 0.03,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  );
};

// Line Reveal Animation
const LineReveal = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div ref={ref} className="line-mask">
      <motion.div
        className={className}
        initial={{ y: '110%' }}
        animate={isInView ? { y: 0 } : {}}
        transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Floating Image Component
const FloatingImage = ({ src, alt, className, delay = 0, rotate = 0, floatIntensity = 20 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const y = useMotionValue(0);
  const smoothY = useSpring(y, { stiffness: 50, damping: 20 });

  useEffect(() => {
    let frame;
    let time = delay * 1000;
    
    const animate = () => {
      time += 16;
      y.set(Math.sin(time / 2000) * floatIntensity);
      frame = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(frame);
  }, [delay, floatIntensity, y]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y: smoothY, rotate }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="img-zoom">
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </div>
    </motion.div>
  );
};

// Ticker Component
const Ticker = () => (
  <div className="overflow-hidden py-3 border-b border-black/10">
    <div className="ticker-scroll flex whitespace-nowrap">
      {[...Array(8)].map((_, i) => (
        <span key={i} className="font-inter text-[11px] tracking-[0.2em] uppercase px-8 opacity-40">
          A Story They Never Wanted You To See • Hyderabad Premiere 2025 • Limited Access •
        </span>
      ))}
    </div>
  </div>
);

// Navigation
const Navigation = ({ onMenuClick, onRequestAccess }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 mix-blend-difference px-6 md:px-12 py-6">
    <div className="flex justify-between items-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <span className="font-playfair text-xl font-bold text-white">Last The Puff</span>
      </motion.div>
      <div className="flex items-center gap-8">
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          onClick={onRequestAccess}
          className="hidden md:block font-inter text-sm text-white hover-line"
          data-hover
        >
          Request Access
        </motion.button>
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          onClick={onMenuClick}
          className="text-white"
          data-hover
        >
          <Menu className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  </nav>
);

// Full Screen Menu
const FullScreenMenu = ({ isOpen, onClose, onRequestAccess }) => {
  const menuItems = [
    { label: 'The Story', href: '#story' },
    { label: 'Characters', href: '#characters' },
    { label: 'Director', href: '#director' },
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
          
          <div className="w-full max-w-4xl">
            {menuItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mb-2"
              >
                {item.action ? (
                  <button
                    onClick={() => { item.action(); onClose(); }}
                    className="font-playfair text-[10vw] md:text-[8vw] font-bold leading-none hover:italic transition-all duration-500 flex items-center gap-4 group"
                    data-hover
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </button>
                ) : (
                  <a
                    href={item.href}
                    onClick={onClose}
                    className="font-playfair text-[10vw] md:text-[8vw] font-bold leading-none hover:italic transition-all duration-500 flex items-center gap-4 group"
                    data-hover
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-6 md:left-24"
          >
            <p className="font-inter text-sm opacity-40">A Short Film • Hyderabad 2025</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// HERO SECTION - Miranda Style with Amazing Animations
const HeroSection = ({ onRequestAccess }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={containerRef} className="min-h-[200vh] relative bg-[#F5E6D3]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <Ticker />
        
        <motion.div style={{ opacity, scale }} className="h-full flex flex-col justify-center px-6 md:px-12 lg:px-24">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 relative z-10">
              {/* Label */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mb-6"
              >
                <span className="font-inter text-xs tracking-[0.3em] uppercase opacity-50">A Short Film</span>
              </motion.div>

              {/* Main Title - Staggered Character Animation */}
              <h1 className="font-playfair text-[18vw] md:text-[14vw] lg:text-[10vw] leading-[0.85] font-bold">
                <div className="overflow-hidden">
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    Last
                  </motion.div>
                </div>
                <div className="overflow-hidden">
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.75, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="italic text-[#8B0000]"
                  >
                    The
                  </motion.div>
                </div>
                <div className="overflow-hidden">
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.9, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    Puff
                  </motion.div>
                </div>
              </h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.8 }}
                className="mt-8 font-inter text-sm md:text-base max-w-md leading-relaxed opacity-60"
              >
                Some habits don't kill you instantly...<br />
                They kill the people around you first.
              </motion.p>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="mt-12"
              >
                <button
                  onClick={onRequestAccess}
                  className="group flex items-center gap-4 font-playfair text-lg border-b-2 border-black pb-2 transition-all duration-500 hover:gap-8"
                  data-hover
                >
                  <span>Request Premiere Access</span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-2" />
                </button>
              </motion.div>
            </div>

            {/* Right - Floating Images */}
            <div className="lg:col-span-5 relative h-[60vh] lg:h-[80vh] hidden lg:block">
              {/* Main Image */}
              <motion.div
                style={{ y: y1 }}
                initial={{ opacity: 0, scale: 0.8, x: 100 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-[5%] right-0 w-[65%] z-20"
              >
                <div className="img-zoom aspect-[3/4]">
                  <img src={IMAGES.eyes} alt="Her Eyes" className="w-full h-full object-cover" />
                </div>
              </motion.div>

              {/* Secondary Image - Rotated */}
              <motion.div
                style={{ y: y3 }}
                initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
                animate={{ opacity: 1, scale: 1, rotate: -6 }}
                transition={{ delay: 1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-[10%] left-0 w-[55%] z-10"
              >
                <div className="img-zoom aspect-[4/3]">
                  <img src={IMAGES.couple} alt="The Couple" className="w-full h-full object-cover" />
                </div>
              </motion.div>

              {/* Circular Floating Image */}
              <motion.div
                style={{ y: y2 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-[40%] left-[30%] w-28 h-28 z-30"
              >
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#F5E6D3] shadow-2xl float-animation">
                  <img src={IMAGES.fire} alt="Fire" className="w-full h-full object-cover" />
                </div>
              </motion.div>

              {/* Stamp */}
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: -15 }}
                transition={{ delay: 1.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-[15%] left-0 z-40"
              >
                <div className="w-24 h-24 border-[3px] border-black rounded-full flex items-center justify-center stamp-rotate">
                  <div className="text-center transform -rotate-12">
                    <span className="font-playfair text-[10px] font-bold block">PREMIERE</span>
                    <span className="font-playfair text-[8px] block">2025</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="font-inter text-xs tracking-widest opacity-40"
          >
            SCROLL
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Story Section with Parallax
const StorySection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [200, -200]);

  return (
    <section ref={containerRef} id="story" className="py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-[#F5E6D3] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Text */}
          <div className="lg:col-span-6">
            <LineReveal>
              <span className="font-inter text-xs tracking-[0.3em] uppercase opacity-50">The Beginning</span>
            </LineReveal>
            
            <h2 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold mt-6 leading-[0.9]">
              <AnimatedTitle delay={0.2}>He Thought</AnimatedTitle>
              <br />
              <span className="italic text-[#8B0000]">
                <AnimatedTitle delay={0.4}>He Was Free</AnimatedTitle>
              </span>
            </h2>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-12 font-inter text-lg leading-relaxed opacity-70 max-w-lg"
            >
              Nights filled with laughter. Bottles passed like memories. 
              Smoke shared like friendship. He called it freedom. 
              It was just the beginning.
            </motion.p>
          </div>

          {/* Images */}
          <div className="lg:col-span-6 relative h-[70vh]">
            <motion.div style={{ y: y1 }} className="absolute top-0 right-0 w-[70%]">
              <FloatingImage
                src={IMAGES.couple}
                alt="The Couple"
                className="aspect-[4/3]"
                delay={0}
                floatIntensity={15}
              />
            </motion.div>
            <motion.div style={{ y: y2 }} className="absolute bottom-0 left-0 w-[60%]">
              <FloatingImage
                src={IMAGES.family}
                alt="Happy Times"
                className="aspect-[4/3]"
                delay={0.5}
                rotate={-3}
                floatIntensity={20}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Quote Section - Full Screen
const QuoteSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 md:px-12 bg-[#0D0D0D] text-[#F5E6D3] relative overflow-hidden">
      {/* Background Image */}
      <motion.div
        initial={{ scale: 1.2 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2 }}
        className="absolute inset-0 opacity-20"
      >
        <img src={IMAGES.fire} alt="" className="w-full h-full object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-[#0D0D0D]" />

      <div className="relative z-10 text-center max-w-5xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="absolute -top-32 left-0 font-playfair text-[40vw] leading-none opacity-10"
        >
          "
        </motion.div>

        <h2 className="font-playfair text-4xl md:text-6xl lg:text-8xl font-bold leading-tight">
          <AnimatedTitle delay={0}>Some habits don't</AnimatedTitle>
          <br />
          <span className="italic text-[#C2A36B]">
            <AnimatedTitle delay={0.3}>kill you instantly...</AnimatedTitle>
          </span>
        </h2>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="font-playfair text-2xl md:text-4xl mt-8 opacity-60"
        >
          they kill the people around you first.
        </motion.p>
      </div>
    </section>
  );
};

// Characters Section
const CharactersSection = () => {
  const characters = [
    { name: 'HER', role: 'The One Who Stayed', image: IMAGES.eyes },
    { name: 'THEM', role: 'What Could Have Been', image: IMAGES.family },
    { name: 'THE END', role: 'What He Chose', image: IMAGES.pyre },
  ];

  return (
    <section id="characters" className="py-32 px-6 md:px-12 lg:px-24 bg-[#F5E6D3]">
      <div className="max-w-7xl mx-auto">
        <LineReveal>
          <span className="font-inter text-xs tracking-[0.3em] uppercase opacity-50">The Characters</span>
        </LineReveal>
        
        <h2 className="font-playfair text-5xl md:text-7xl font-bold mt-6 mb-20">
          <AnimatedTitle>Their Story</AnimatedTitle>
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {characters.map((char, i) => (
            <motion.div
              key={char.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              className="group"
              data-hover
            >
              <div className="img-zoom aspect-[3/4] mb-6 overflow-hidden">
                <img 
                  src={char.image} 
                  alt={char.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>
              <h3 className="font-playfair text-3xl font-bold">{char.name}</h3>
              <p className="font-inter text-sm opacity-50 mt-2">{char.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Director Section
const DirectorSection = () => (
  <section id="director" className="py-32 px-6 md:px-12 lg:px-24 bg-[#EDE4D4]">
    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
      <div>
        <LineReveal>
          <span className="font-inter text-xs tracking-[0.3em] uppercase opacity-50">Director's Note</span>
        </LineReveal>
        
        <h2 className="font-playfair text-5xl md:text-7xl font-bold mt-6 leading-[0.9]">
          <AnimatedTitle>Think,</AnimatedTitle>
          <br />
          <span className="italic"><AnimatedTitle delay={0.2}>Create</AnimatedTitle></span>
          <br />
          <AnimatedTitle delay={0.4}>Deliver</AnimatedTitle>
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-12 font-inter text-lg leading-relaxed opacity-70"
        >
          We made this film with nothing but belief. No big budgets, 
          no fancy equipment—just a story that needed to be told.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative"
      >
        <div className="img-zoom aspect-square">
          <img src={IMAGES.pyre} alt="Director" className="w-full h-full object-cover" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full overflow-hidden border-4 border-[#EDE4D4]"
        >
          <img src={IMAGES.couple} alt="" className="w-full h-full object-cover" />
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// Final CTA Section
const FinalCTASection = ({ onRequestAccess, count }) => {
  const [displayCount, setDisplayCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    
    let current = 0;
    const increment = count / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= count) {
        setDisplayCount(count);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(current));
      }
    }, 30);

    return () => clearInterval(timer);
  }, [count, isInView]);

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center px-6 bg-[#0D0D0D] text-[#F5E6D3] relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-30"
        style={{ backgroundImage: `url(${IMAGES.pyre})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="absolute inset-0 bg-[#0D0D0D]/70" />

      <div className="relative z-10 text-center max-w-5xl">
        <h2 className="font-playfair text-5xl md:text-7xl lg:text-[10vw] font-bold leading-[0.9]">
          <AnimatedTitle>It wasn't his</AnimatedTitle>
          <br />
          <span className="italic text-[#C2A36B]"><AnimatedTitle delay={0.3}>last puff...</AnimatedTitle></span>
        </h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="font-playfair text-5xl md:text-7xl lg:text-[10vw] font-bold mt-4"
        >
          ...it was <span className="text-[#8B0000]">HERS.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2 }}
          className="mt-16"
        >
          <button
            onClick={onRequestAccess}
            className="inline-flex items-center gap-4 font-playfair text-xl bg-[#F5E6D3] text-[#0D0D0D] px-12 py-6 hover:bg-[#C2A36B] transition-all duration-500"
            data-hover
          >
            Request Premiere Access
            <ArrowRight className="w-6 h-6" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.5 }}
          className="mt-20"
        >
          <p className="font-playfair text-7xl md:text-9xl font-bold text-[#C2A36B]">
            {displayCount.toLocaleString()}
          </p>
          <p className="font-inter text-sm tracking-widest opacity-50 mt-2">
            PEOPLE HAVE REQUESTED ACCESS
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => (
  <footer className="py-16 px-6 md:px-12 lg:px-24 bg-[#F5E6D3] border-t border-black/10">
    <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
      <div>
        <h3 className="font-playfair text-4xl font-bold">Last The Puff</h3>
        <p className="font-inter text-sm mt-4 opacity-50">A cinematic exploration of addiction, love, and consequence.</p>
      </div>
      <div>
        <p className="font-inter text-xs tracking-widest uppercase opacity-50 mb-4">Navigate</p>
        <ul className="space-y-2">
          {['The Story', 'Characters', 'Director'].map(item => (
            <li key={item}><a href={`#${item.toLowerCase().replace(' ', '-')}`} className="font-inter hover-line" data-hover>{item}</a></li>
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

// Access Modal
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
      const res = await fetch('/api/access-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) setSubmitStatus('success');
      else setErrors({ submit: data.error });
    } catch {
      setErrors({ submit: 'Network error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0D0D0D]/90 modal-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative w-full max-w-lg bg-[#0D0D0D] border border-[#F5E6D3]/20 p-8 md:p-12 modal-content"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-[#F5E6D3]/50 hover:text-[#F5E6D3]" data-hover>
              <X className="w-6 h-6" />
            </button>

            {submitStatus === 'success' ? (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 rounded-full border-2 border-[#C2A36B] flex items-center justify-center mx-auto mb-6"
                >
                  <span className="font-playfair text-3xl text-[#C2A36B]">✓</span>
                </motion.div>
                <h3 className="font-playfair text-4xl font-bold text-[#F5E6D3]">You're In</h3>
                <p className="font-inter text-[#F5E6D3]/60 mt-4">You are now on the premiere list.</p>
              </div>
            ) : (
              <>
                <span className="font-inter text-xs tracking-widest text-[#C2A36B]">LIMITED ACCESS</span>
                <h3 className="font-playfair text-4xl font-bold text-[#F5E6D3] mt-2">Request Access</h3>
                <p className="font-inter text-sm text-[#F5E6D3]/40 mt-2 mb-8">Join the premiere list</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {['name', 'phone', 'email', 'college'].map(field => (
                    <div key={field}>
                      <input
                        type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                        name={field}
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1) + (field === 'college' ? ' (Optional)' : ' *')}
                        value={formData[field]}
                        onChange={handleChange}
                        className="w-full px-4 py-4"
                      />
                      {errors[field] && <p className="text-red-400 text-xs mt-1">{errors[field]}</p>}
                    </div>
                  ))}
                  <textarea
                    name="interest"
                    placeholder="Why do you want to watch? (Optional)"
                    value={formData.interest}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-4 resize-none"
                  />
                  {errors.submit && <p className="text-red-400 text-sm text-center">{errors.submit}</p>}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#F5E6D3] text-[#0D0D0D] font-playfair text-lg py-4 hover:bg-[#C2A36B] transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
                    data-hover
                  >
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
    fetch('/api/access-requests/count')
      .then(res => res.json())
      .then(data => data.count && setAccessCount(data.count))
      .catch(console.error);
  }, []);

  return (
    <main className="bg-[#F5E6D3]">
      <CustomCursor />
      <div className="grain" />
      
      <Navigation onMenuClick={() => setIsMenuOpen(true)} onRequestAccess={() => setIsModalOpen(true)} />
      <FullScreenMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onRequestAccess={() => setIsModalOpen(true)} />
      
      <HeroSection onRequestAccess={() => setIsModalOpen(true)} />
      <StorySection />
      <QuoteSection />
      <CharactersSection />
      <DirectorSection />
      <FinalCTASection onRequestAccess={() => setIsModalOpen(true)} count={accessCount} />
      <Footer />
      
      <AccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}