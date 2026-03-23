'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, X, ArrowRight, ArrowUpRight, Menu } from 'lucide-react';

// Film stills from user uploads
const FILM_IMAGES = {
  eyes: 'https://customer-assets.emergentagent.com/job_67afdf74-f95e-4c0d-8ad4-298d916277ab/artifacts/8nee39y1_Screenshot%202026-03-24%20at%201.59.42%E2%80%AFAM.png',
  couple: 'https://customer-assets.emergentagent.com/job_67afdf74-f95e-4c0d-8ad4-298d916277ab/artifacts/2l1d7243_Screenshot%202026-03-24%20at%201.59.22%E2%80%AFAM.png',
  family: 'https://customer-assets.emergentagent.com/job_67afdf74-f95e-4c0d-8ad4-298d916277ab/artifacts/52gk4kuz_Screenshot%202026-03-24%20at%201.58.47%E2%80%AFAM.png',
  fire: 'https://customer-assets.emergentagent.com/job_67afdf74-f95e-4c0d-8ad4-298d916277ab/artifacts/63jsj0ki_Screenshot%202026-03-24%20at%201.58.08%E2%80%AFAM.png',
  pyre: 'https://customer-assets.emergentagent.com/job_67afdf74-f95e-4c0d-8ad4-298d916277ab/artifacts/63woeyeu_Screenshot%202026-03-24%20at%201.57.38%E2%80%AFAM.png',
};

// Custom Cursor Component
const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isHovering, setIsHovering] = useState(false);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, [data-cursor-hover]')) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e) => {
      if (e.target.closest('a, button, [data-cursor-hover]')) {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        className="custom-cursor hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          width: isHovering ? 60 : 20,
          height: isHovering ? 60 : 20,
          backgroundColor: isHovering ? '#111' : 'transparent',
        }}
      />
      <motion.div
        className="custom-cursor-dot hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      />
    </>
  );
};

// Navigation
const Navigation = ({ onMenuClick, onRequestAccess }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
      <div className="flex justify-between items-center px-6 md:px-12 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="font-playfair text-xl font-bold text-white"
        >
          Last The Puff
        </motion.div>
        <div className="flex items-center gap-8">
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={onRequestAccess}
            className="hidden md:block font-inter text-sm text-white hover-underline"
          >
            Request Access
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            onClick={onMenuClick}
            className="text-white"
          >
            <Menu className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </nav>
  );
};

// Full Screen Menu
const FullScreenMenu = ({ isOpen, onClose, onRequestAccess }) => {
  const menuItems = [
    { label: 'The Story', href: '#story' },
    { label: 'Characters', href: '#characters' },
    { label: 'Director\'s Note', href: '#director' },
    { label: 'Request Access', action: onRequestAccess },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
          animate={{ clipPath: 'circle(150% at calc(100% - 40px) 40px)' }}
          exit={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
          transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
          className="fullscreen-menu"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 md:right-12"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="max-w-4xl">
            {menuItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="mb-4"
              >
                {item.action ? (
                  <button
                    onClick={() => {
                      item.action();
                      onClose();
                    }}
                    className="font-playfair text-5xl md:text-7xl font-bold hover:italic transition-all duration-300 flex items-center gap-4 group"
                  >
                    {item.label}
                    <ArrowUpRight className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ) : (
                  <a
                    href={item.href}
                    onClick={onClose}
                    className="font-playfair text-5xl md:text-7xl font-bold hover:italic transition-all duration-300 flex items-center gap-4 group"
                  >
                    {item.label}
                    <ArrowRight className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>

          <div className="absolute bottom-8 left-6 md:left-12">
            <p className="font-inter text-sm opacity-50">A Short Film • Hyderabad 2025</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hero Section - Miranda Style
const HeroSection = ({ onRequestAccess }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={containerRef} className="min-h-screen relative overflow-hidden bg-[#F5E6D3]">
      {/* Decorative vertical text */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="vertical-ticker-animate">
          <p className="font-inter text-xs tracking-widest transform -rotate-90 origin-center whitespace-nowrap opacity-30">
            HYDERABAD PREMIERE • JUNE 2025 • LIMITED ACCESS • HYDERABAD PREMIERE • JUNE 2025 • LIMITED ACCESS •
          </p>
        </div>
      </div>

      {/* Main content */}
      <motion.div style={{ opacity }} className="relative z-10 min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24">
        {/* Top ticker */}
        <div className="absolute top-0 left-0 right-0 overflow-hidden py-4 border-b border-black/10">
          <div className="ticker-animate whitespace-nowrap flex">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="font-inter text-xs tracking-widest px-8 opacity-40">
                A STORY THEY NEVER WANTED YOU TO SEE • PREMIERE 2025 •
              </span>
            ))}
          </div>
        </div>

        {/* Hero Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-center pt-24">
          {/* Left - Main Title */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-4"
            >
              <span className="font-inter text-xs tracking-[0.3em] uppercase opacity-50">
                A Short Film by
              </span>
            </motion.div>

            <div className="relative">
              <motion.h1 
                style={{ y: y1 }}
                className="font-playfair text-[12vw] md:text-[10vw] lg:text-[8vw] leading-[0.85] font-bold"
              >
                <motion.span
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="block"
                >
                  Last
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="block italic text-[#8B0000]"
                >
                  The
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="block"
                >
                  Puff
                </motion.span>
              </motion.h1>

              {/* Decorative stamp */}
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -30 }}
                animate={{ opacity: 1, scale: 1, rotate: -12 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -right-4 top-1/4 hidden md:block"
              >
                <div className="stamp w-24 h-24 flex items-center justify-center">
                  <span className="font-playfair text-[10px] text-center leading-tight font-bold">
                    PREMIERE<br/>2025
                  </span>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-8 max-w-md"
            >
              <p className="font-inter text-sm leading-relaxed opacity-60">
                Some habits don't kill you instantly...<br/>
                They kill the people around you first.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="mt-12"
            >
              <button
                onClick={onRequestAccess}
                className="magnetic-btn group flex items-center gap-4 font-playfair text-lg border-b-2 border-black pb-2 hover:gap-6 transition-all duration-300"
                data-cursor-hover
              >
                Request Premiere Access
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* Right - Images */}
          <div className="lg:col-span-5 relative h-[60vh] lg:h-[70vh]">
            <motion.div
              style={{ y: y2 }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="absolute top-0 right-0 w-[70%] image-hover"
            >
              <img
                src={FILM_IMAGES.eyes}
                alt="The Eyes"
                className="w-full aspect-[4/5] object-cover"
              />
            </motion.div>

            <motion.div
              style={{ y: y3 }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="absolute bottom-0 left-0 w-[60%] image-hover rotate-slight"
            >
              <img
                src={FILM_IMAGES.couple}
                alt="The Couple"
                className="w-full aspect-[4/3] object-cover"
              />
            </motion.div>

            {/* Decorative circle image */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full overflow-hidden border-4 border-[#F5E6D3] shadow-xl z-10"
            >
              <img
                src={FILM_IMAGES.fire}
                alt="Fire"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Bottom scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="font-inter text-xs tracking-widest opacity-40"
        >
          SCROLL
        </motion.div>
      </motion.div>
    </section>
  );
};

// Story Section - Horizontal Scroll Style
const StoryHorizontalSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-75%']);

  const stories = [
    {
      title: 'HE THOUGHT',
      subtitle: 'HE WAS FREE',
      content: 'Nights filled with laughter. Bottles passed like memories. Smoke shared like friendship. He called it freedom.',
      image: FILM_IMAGES.couple,
    },
    {
      title: 'LOVE',
      subtitle: 'COULDN\'T STOP',
      content: 'He loved her. But not enough to quit. Not enough to choose her over the cigarette. And slowly... the smoke chose for him.',
      image: FILM_IMAGES.family,
    },
    {
      title: 'SHE PAID',
      subtitle: 'THE PRICE',
      content: 'It wasn\'t his lungs that failed first. It was hers. The one who stayed. The one who loved. The one who believed he would change.',
      image: FILM_IMAGES.eyes,
    },
    {
      title: 'REGRET',
      subtitle: 'DOESN\'T HEAL',
      content: 'He quit. But too late. The smoke had already taken everything. Not memories. Not photographs. Just ashes.',
      image: FILM_IMAGES.pyre,
    },
  ];

  return (
    <section ref={containerRef} id="story" className="relative h-[400vh] bg-[#0D0D0D]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Section title */}
        <div className="absolute top-8 left-6 md:left-12 z-10">
          <span className="font-inter text-xs tracking-[0.3em] text-[#F5E6D3]/50">THE STORY</span>
        </div>

        <motion.div
          style={{ x }}
          className="flex h-full"
        >
          {stories.map((story, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-screen h-full flex items-center px-6 md:px-12 lg:px-24"
            >
              <div className="grid lg:grid-cols-2 gap-12 items-center w-full max-w-7xl mx-auto">
                {/* Text */}
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <h2 className="font-playfair text-[10vw] lg:text-[6vw] leading-[0.9] font-bold text-[#F5E6D3]">
                    <span className="block">{story.title}</span>
                    <span className="block italic text-[#C2A36B]">{story.subtitle}</span>
                  </h2>
                  <p className="mt-8 font-inter text-lg text-[#F5E6D3]/60 max-w-md leading-relaxed">
                    {story.content}
                  </p>
                  <div className="mt-8 font-inter text-sm text-[#C2A36B]">
                    {String(index + 1).padStart(2, '0')} / {String(stories.length).padStart(2, '0')}
                  </div>
                </div>

                {/* Image */}
                <div className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="relative image-hover">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full aspect-[4/3] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-40" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Progress indicator */}
        <div className="absolute bottom-8 left-6 md:left-12 right-6 md:right-12">
          <div className="h-[1px] bg-[#F5E6D3]/20">
            <motion.div
              style={{ scaleX: scrollYProgress }}
              className="h-full bg-[#C2A36B] origin-left"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// Quote Section - Miranda Style
const QuoteSection = () => {
  return (
    <section className="py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-[#F5E6D3] relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative">
        {/* Large quote mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 0.1, scale: 1 }}
          viewport={{ once: true }}
          className="absolute -top-20 -left-10 font-playfair text-[40vw] leading-none select-none"
        >
          "
        </motion.div>

        <div className="relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-playfair text-4xl md:text-6xl lg:text-7xl leading-tight font-bold"
          >
            Some habits don't kill you <span className="italic text-[#8B0000]">instantly</span>...
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-playfair text-4xl md:text-6xl lg:text-7xl leading-tight font-bold mt-4"
          >
            they kill the people <span className="italic">around you</span> first.
          </motion.p>
        </div>

        {/* Decorative image */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="absolute -right-12 bottom-0 w-48 h-48 hidden lg:block"
        >
          <img
            src={FILM_IMAGES.fire}
            alt=""
            className="w-full h-full object-cover rounded-full"
          />
        </motion.div>
      </div>
    </section>
  );
};

// Director Section - Miranda Style
const DirectorSection = () => {
  return (
    <section id="director" className="py-32 px-6 md:px-12 lg:px-24 bg-[#EDE4D4] diagonal-lines">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left - Title */}
          <div className="lg:col-span-5">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-inter text-xs tracking-[0.3em] uppercase opacity-50"
            >
              Director's Note
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-playfair text-5xl md:text-7xl font-bold mt-4 leading-tight"
            >
              Think,
              <span className="block italic">Create</span>
              <span className="block">Deliver</span>
            </motion.h2>
          </div>

          {/* Right - Content */}
          <div className="lg:col-span-7 lg:pt-16">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-inter text-lg leading-relaxed drop-cap"
            >
              We made this film with nothing but belief. No big budgets, no fancy equipment—just a story that needed to be told. This isn't just a film about addiction; it's about the invisible victims, the ones who stand beside us while we destroy ourselves.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-inter text-lg leading-relaxed mt-6 opacity-70"
            >
              Every frame of "Last The Puff" is a reminder that our choices don't just affect us. They ripple outward, touching everyone who loves us. This is not a lecture—it's a mirror.
            </motion.p>

            {/* Signature */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-12 flex items-center gap-6"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img
                  src={FILM_IMAGES.couple}
                  alt="Director"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-playfair text-lg font-bold">The Filmmaker</p>
                <p className="font-inter text-sm opacity-50">Director & Writer</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Final CTA Section
const FinalCTASection = ({ onRequestAccess, count }) => {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = count / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= count) {
        setDisplayCount(count);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [count]);

  return (
    <section className="min-h-screen py-32 px-6 md:px-12 lg:px-24 bg-[#0D0D0D] flex flex-col justify-center relative overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${FILM_IMAGES.pyre})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/90 to-[#0D0D0D]/80" />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-inter text-sm tracking-[0.3em] text-[#C2A36B] mb-8"
        >
          THE FINAL MESSAGE
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-playfair text-5xl md:text-7xl lg:text-9xl font-bold text-[#F5E6D3] leading-tight"
        >
          It wasn't his
          <span className="block italic text-[#C2A36B]">last puff...</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="font-playfair text-5xl md:text-7xl lg:text-9xl font-bold text-[#F5E6D3] mt-4"
        >
          ...it was <span className="text-[#8B0000]">HERS.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <button
            onClick={onRequestAccess}
            className="magnetic-btn inline-flex items-center gap-4 font-playfair text-xl bg-[#F5E6D3] text-[#0D0D0D] px-12 py-6 hover:bg-[#C2A36B] transition-colors duration-300"
            data-cursor-hover
          >
            Request Premiere Access
            <ArrowRight className="w-6 h-6" />
          </button>
        </motion.div>

        {/* Counter */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="mt-20"
        >
          <p className="font-playfair text-6xl md:text-8xl font-bold text-[#C2A36B]">
            {displayCount.toLocaleString()}
          </p>
          <p className="font-inter text-sm tracking-widest text-[#F5E6D3]/50 mt-2">
            PEOPLE HAVE REQUESTED ACCESS
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// Footer - Miranda Style
const Footer = () => {
  return (
    <footer className="py-16 px-6 md:px-12 lg:px-24 bg-[#F5E6D3] border-t border-black/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-12 gap-12">
          {/* Logo */}
          <div className="md:col-span-4">
            <h3 className="font-playfair text-4xl md:text-5xl font-bold">Last The Puff</h3>
            <p className="font-inter text-sm mt-4 opacity-50">
              A cinematic exploration of addiction, love, and consequence.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-4">
            <p className="font-inter text-xs tracking-[0.2em] uppercase opacity-50 mb-4">Navigate</p>
            <ul className="space-y-2">
              <li><a href="#story" className="font-inter hover-underline">The Story</a></li>
              <li><a href="#director" className="font-inter hover-underline">Director's Note</a></li>
              <li><a href="#" className="font-inter hover-underline">Request Access</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <p className="font-inter text-xs tracking-[0.2em] uppercase opacity-50 mb-4">Connect</p>
            <ul className="space-y-2">
              <li><a href="#" className="font-inter hover-underline">Instagram</a></li>
              <li><a href="#" className="font-inter hover-underline">Twitter</a></li>
              <li><a href="#" className="font-inter hover-underline">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-inter text-xs opacity-50">
            © 2025 Last The Puff. All rights reserved.
          </p>
          <p className="font-inter text-xs opacity-50">
            Hyderabad, India
          </p>
        </div>
      </div>
    </footer>
  );
};

// Access Request Modal - Dark Miranda Style
const AccessModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    college: '',
    interest: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/access-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
        setErrors({ submit: data.error || 'Something went wrong' });
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0D0D0D]/95"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative w-full max-w-lg bg-[#0D0D0D] border border-[#F5E6D3]/20 p-8 md:p-12 dark-modal"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[#F5E6D3]/50 hover:text-[#F5E6D3] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {submitStatus === 'success' ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 rounded-full border-2 border-[#C2A36B] flex items-center justify-center mx-auto mb-6">
                  <span className="font-playfair text-2xl text-[#C2A36B]">✓</span>
                </div>
                <h3 className="font-playfair text-4xl font-bold text-[#F5E6D3] mb-4">You're In</h3>
                <p className="font-inter text-[#F5E6D3]/70">
                  You are now on the premiere list.
                </p>
                <p className="font-inter text-sm text-[#C2A36B] mt-4">
                  We'll reach out with exclusive details soon.
                </p>
              </motion.div>
            ) : (
              <>
                <div className="mb-8">
                  <span className="font-inter text-xs tracking-[0.2em] text-[#C2A36B]">LIMITED ACCESS</span>
                  <h3 className="font-playfair text-4xl font-bold text-[#F5E6D3] mt-2">Request Access</h3>
                  <p className="font-inter text-sm text-[#F5E6D3]/50 mt-2">
                    Join the premiere list for Hyderabad 2025
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name *"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-transparent border border-[#F5E6D3]/20 text-[#F5E6D3] placeholder:text-[#F5E6D3]/30 px-4 py-4 focus:border-[#F5E6D3] focus:outline-none transition-colors"
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Mobile Number *"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-transparent border border-[#F5E6D3]/20 text-[#F5E6D3] placeholder:text-[#F5E6D3]/30 px-4 py-4 focus:border-[#F5E6D3] focus:outline-none transition-colors"
                    />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-transparent border border-[#F5E6D3]/20 text-[#F5E6D3] placeholder:text-[#F5E6D3]/30 px-4 py-4 focus:border-[#F5E6D3] focus:outline-none transition-colors"
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <input
                      type="text"
                      name="college"
                      placeholder="College / Institution (Optional)"
                      value={formData.college}
                      onChange={handleChange}
                      className="w-full bg-transparent border border-[#F5E6D3]/20 text-[#F5E6D3] placeholder:text-[#F5E6D3]/30 px-4 py-4 focus:border-[#F5E6D3] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <textarea
                      name="interest"
                      placeholder="Why do you want to watch this film? (Optional)"
                      value={formData.interest}
                      onChange={handleChange}
                      rows={3}
                      className="w-full bg-transparent border border-[#F5E6D3]/20 text-[#F5E6D3] placeholder:text-[#F5E6D3]/30 px-4 py-4 focus:border-[#F5E6D3] focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {errors.submit && (
                    <p className="text-red-400 text-sm text-center">{errors.submit}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#F5E6D3] text-[#0D0D0D] font-playfair text-lg py-4 hover:bg-[#C2A36B] transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Join Premiere List
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
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

// Main Page Component
export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [accessCount, setAccessCount] = useState(1247);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch('/api/access-requests/count');
        const data = await response.json();
        if (data.count) {
          setAccessCount(data.count);
        }
      } catch (error) {
        console.error('Error fetching count:', error);
      }
    };

    fetchCount();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <main className="min-h-screen bg-[#F5E6D3]">
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Navigation */}
      <Navigation 
        onMenuClick={() => setIsMenuOpen(true)} 
        onRequestAccess={openModal}
      />

      {/* Full Screen Menu */}
      <FullScreenMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        onRequestAccess={openModal}
      />

      {/* Hero */}
      <HeroSection onRequestAccess={openModal} />

      {/* Story Horizontal Scroll */}
      <StoryHorizontalSection />

      {/* Quote */}
      <QuoteSection />

      {/* Director's Note */}
      <DirectorSection />

      {/* Final CTA */}
      <FinalCTASection onRequestAccess={openModal} count={accessCount} />

      {/* Footer */}
      <Footer />

      {/* Access Modal */}
      <AccessModal isOpen={isModalOpen} onClose={closeModal} />
    </main>
  );
}
