'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Instagram, Mail, Phone, X, ChevronDown, Play } from 'lucide-react';

// Film stills from user uploads
const FILM_IMAGES = {
  eyes: 'https://customer-assets.emergentagent.com/job_67afdf74-f95e-4c0d-8ad4-298d916277ab/artifacts/8nee39y1_Screenshot%202026-03-24%20at%201.59.42%E2%80%AFAM.png',
  couple: 'https://customer-assets.emergentagent.com/job_67afdf74-f95e-4c0d-8ad4-298d916277ab/artifacts/2l1d7243_Screenshot%202026-03-24%20at%201.59.22%E2%80%AFAM.png',
  family: 'https://customer-assets.emergentagent.com/job_67afdf74-f95e-4c0d-8ad4-298d916277ab/artifacts/52gk4kuz_Screenshot%202026-03-24%20at%201.58.47%E2%80%AFAM.png',
  fire: 'https://customer-assets.emergentagent.com/job_67afdf74-f95e-4c0d-8ad4-298d916277ab/artifacts/63jsj0ki_Screenshot%202026-03-24%20at%201.58.08%E2%80%AFAM.png',
  pyre: 'https://customer-assets.emergentagent.com/job_67afdf74-f95e-4c0d-8ad4-298d916277ab/artifacts/63woeyeu_Screenshot%202026-03-24%20at%201.57.38%E2%80%AFAM.png',
};

// Animated text component
const AnimatedText = ({ text, className = '', delay = 0 }) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className={className}
    >
      {text}
    </motion.span>
  );
};

// Ticker component
const Ticker = () => {
  const text = "HYDERABAD PREMIERE • LIMITED ACCESS • A STORY THEY NEVER WANTED YOU TO SEE • ";
  return (
    <div className="overflow-hidden bg-[#C2A36B] py-2">
      <div className="ticker-animate whitespace-nowrap flex">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="text-[#0D0D0D] font-playfair text-sm tracking-widest px-4">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};

// Hero Section
const HeroSection = ({ onRequestAccess }) => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const y = useTransform(scrollY, [0, 400], [0, 100]);

  return (
    <motion.section 
      style={{ opacity }}
      className="min-h-screen relative flex flex-col justify-center items-center newspaper-texture overflow-hidden"
    >
      {/* Background smoke effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full bg-gradient-to-t from-transparent to-white/5 blur-3xl smoke-effect"
            style={{
              left: `${20 + i * 15}%`,
              bottom: '10%',
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}
      </div>

      <motion.div style={{ y }} className="relative z-10 text-center px-4">
        {/* Top date line */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[#C2A36B] font-inter text-xs tracking-[0.3em] mb-8"
        >
          HYDERABAD • JUNE 2025 • EXCLUSIVE PREMIERE
        </motion.p>

        {/* Main title */}
        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-playfair text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-4"
        >
          <span className="block">LAST</span>
          <span className="block text-[#C2A36B] italic">THE</span>
          <span className="block">PUFF</span>
        </motion.h1>

        {/* Decorative line */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="w-48 h-[2px] bg-[#C2A36B] mx-auto my-8"
        />

        {/* Tagline */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="font-playfair text-xl md:text-2xl italic text-[#F5E6D3]/80 mb-4"
        >
          "A story they never wanted you to see"
        </motion.p>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="font-inter text-sm text-[#F5E6D3]/60 max-w-md mx-auto mb-12"
        >
          Some habits don't kill you instantly...<br/>
          They kill the people around you first.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
        >
          <Button 
            onClick={onRequestAccess}
            className="bg-[#C2A36B] hover:bg-[#d4b87d] text-[#0D0D0D] font-playfair text-lg px-12 py-6 tracking-wider transition-all duration-300 hover:scale-105"
          >
            REQUEST ACCESS
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8 text-[#C2A36B]/50" />
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

// Story Section
const StorySection = ({ title, content, image, imagePosition = 'right', darkBg = false }) => {
  return (
    <section className={`py-24 md:py-32 px-4 ${darkBg ? 'bg-[#0a0a0a]' : 'bg-[#0D0D0D]'}`}>
      <div className="max-w-6xl mx-auto">
        <div className={`grid md:grid-cols-2 gap-12 items-center ${imagePosition === 'left' ? 'md:grid-flow-dense' : ''}`}>
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: imagePosition === 'right' ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={imagePosition === 'left' ? 'md:col-start-2' : ''}
          >
            <h2 className="font-playfair text-3xl md:text-5xl font-bold mb-8 leading-tight">
              {title}
            </h2>
            <div className="space-y-6">
              {content.map((paragraph, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className={`font-inter text-lg leading-relaxed text-[#F5E6D3]/70 ${i === 0 ? 'drop-cap' : ''}`}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: imagePosition === 'right' ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`relative ${imagePosition === 'left' ? 'md:col-start-1 md:row-start-1' : ''}`}
          >
            <div className="relative group">
              <img
                src={image}
                alt={title}
                className="w-full aspect-[4/3] object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-60" />
              {/* Paper texture overlay */}
              <div className="absolute inset-0 mix-blend-overlay opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')]" />
            </div>
            {/* Decorative corner */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r-2 border-b-2 border-[#C2A36B]/30" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Quote Section
const QuoteSection = ({ quote, attribution }) => {
  return (
    <section className="py-32 px-4 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url(${FILM_IMAGES.fire})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center relative z-10"
      >
        <div className="text-[#C2A36B] text-6xl font-playfair mb-8">"</div>
        <p className="font-playfair text-3xl md:text-5xl italic leading-relaxed mb-8">
          {quote}
        </p>
        {attribution && (
          <p className="font-inter text-sm tracking-widest text-[#C2A36B]">
            — {attribution}
          </p>
        )}
      </motion.div>
    </section>
  );
};

// Final Message Section
const FinalMessageSection = ({ onRequestAccess }) => {
  return (
    <section className="min-h-screen py-32 px-4 bg-[#0D0D0D] flex items-center justify-center relative">
      {/* Background pyre image */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${FILM_IMAGES.pyre})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/80 to-[#0D0D0D]" />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        viewport={{ once: true }}
        className="text-center relative z-10 max-w-4xl mx-auto"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="font-playfair text-2xl md:text-4xl italic text-[#F5E6D3]/60 mb-8"
        >
          It wasn't his last puff...
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold mb-12"
        >
          <span className="text-[#C2A36B]">...it was</span>
          <span className="block mt-2">HERS.</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <p className="font-inter text-lg text-[#F5E6D3]/50">
            Watch the film. Feel the truth.
          </p>
          <Button 
            onClick={onRequestAccess}
            className="bg-[#C2A36B] hover:bg-[#d4b87d] text-[#0D0D0D] font-playfair text-lg px-12 py-6 tracking-wider transition-all duration-300 hover:scale-105"
          >
            REQUEST PREMIERE ACCESS
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};

// Live Counter Section
const LiveCounter = ({ count }) => {
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
    <section className="py-16 px-4 bg-[#C2A36B]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center"
      >
        <p className="font-playfair text-3xl md:text-5xl font-bold text-[#0D0D0D]">
          <span className="count-animate">{displayCount.toLocaleString()}</span>
        </p>
        <p className="font-inter text-sm tracking-widest text-[#0D0D0D]/70 mt-2">
          PEOPLE HAVE REQUESTED ACCESS
        </p>
      </motion.div>
    </section>
  );
};

// Access Request Modal
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative w-full max-w-lg bg-[#0D0D0D] border border-[#C2A36B]/30 p-8 md:p-12"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[#F5E6D3]/50 hover:text-[#C2A36B] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {submitStatus === 'success' ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 rounded-full bg-[#C2A36B]/20 flex items-center justify-center mx-auto mb-6">
                  <Play className="w-8 h-8 text-[#C2A36B]" />
                </div>
                <h3 className="font-playfair text-3xl font-bold mb-4">You're In</h3>
                <p className="font-inter text-[#F5E6D3]/70">
                  You are now on the premiere list.
                </p>
                <p className="font-inter text-sm text-[#C2A36B] mt-4">
                  We'll reach out with exclusive details soon.
                </p>
              </motion.div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h3 className="font-playfair text-3xl font-bold mb-2">Request Access</h3>
                  <p className="font-inter text-sm text-[#F5E6D3]/50">
                    Limited seats for Hyderabad Premiere
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Your Name *"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-transparent border-[#C2A36B]/30 focus:border-[#C2A36B] text-[#F5E6D3] placeholder:text-[#F5E6D3]/40 py-6"
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="Mobile Number *"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-transparent border-[#C2A36B]/30 focus:border-[#C2A36B] text-[#F5E6D3] placeholder:text-[#F5E6D3]/40 py-6"
                    />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-transparent border-[#C2A36B]/30 focus:border-[#C2A36B] text-[#F5E6D3] placeholder:text-[#F5E6D3]/40 py-6"
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <Input
                      type="text"
                      name="college"
                      placeholder="College / Institution (Optional)"
                      value={formData.college}
                      onChange={handleChange}
                      className="w-full bg-transparent border-[#C2A36B]/30 focus:border-[#C2A36B] text-[#F5E6D3] placeholder:text-[#F5E6D3]/40 py-6"
                    />
                  </div>

                  <div>
                    <textarea
                      name="interest"
                      placeholder="Why do you want to watch this film? (Optional)"
                      value={formData.interest}
                      onChange={handleChange}
                      rows={3}
                      className="w-full bg-transparent border border-[#C2A36B]/30 focus:border-[#C2A36B] text-[#F5E6D3] placeholder:text-[#F5E6D3]/40 p-4 rounded-md resize-none"
                    />
                  </div>

                  {errors.submit && (
                    <p className="text-red-400 text-sm text-center">{errors.submit}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#C2A36B] hover:bg-[#d4b87d] text-[#0D0D0D] font-playfair text-lg py-6 tracking-wider transition-all duration-300 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                      'JOIN THE PREMIERE LIST'
                    )}
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="py-16 px-4 bg-[#0a0a0a] border-t border-[#2A2A2A]">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-playfair text-2xl font-bold mb-4">LAST THE PUFF</h3>
            <p className="font-inter text-sm text-[#F5E6D3]/50 leading-relaxed">
              A cinematic exploration of addiction, love, and the consequences we never see coming.
            </p>
          </div>

          {/* Credits */}
          <div>
            <h4 className="font-playfair text-lg font-bold mb-4 text-[#C2A36B]">Credits</h4>
            <ul className="font-inter text-sm text-[#F5E6D3]/50 space-y-2">
              <li>Director: The Filmmaker</li>
              <li>Producer: Production House</li>
              <li>Music: Original Score</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-playfair text-lg font-bold mb-4 text-[#C2A36B]">Contact</h4>
            <div className="flex gap-4">
              <a href="#" className="text-[#F5E6D3]/50 hover:text-[#C2A36B] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#F5E6D3]/50 hover:text-[#C2A36B] transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#F5E6D3]/50 hover:text-[#C2A36B] transition-colors">
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-[#2A2A2A] text-center">
          <p className="font-inter text-xs text-[#F5E6D3]/30">
            © 2025 Last The Puff. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Main Page Component
export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accessCount, setAccessCount] = useState(1247);

  useEffect(() => {
    // Fetch access count
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
    <main className="min-h-screen bg-[#0D0D0D]">
      {/* Ticker */}
      <Ticker />

      {/* Hero */}
      <HeroSection onRequestAccess={openModal} />

      {/* Story: The Boy */}
      <StorySection
        title="HE THOUGHT HE WAS FREE"
        content={[
          "Nights filled with laughter. Bottles passed like memories. Smoke shared like friendship.",
          "He called it freedom.",
          "It was just the beginning."
        ]}
        image={FILM_IMAGES.couple}
        imagePosition="right"
      />

      {/* Quote */}
      <QuoteSection
        quote="Some habits don't kill you instantly... they kill the people around you first."
      />

      {/* Story: The Family */}
      <StorySection
        title="LOVE COULDN'T STOP THE SMOKE"
        content={[
          "He loved her. But not enough to quit. Not enough to choose her over the cigarette.",
          "And slowly... the smoke chose for him.",
          "The one who stayed. The one who loved. The one who believed he would change."
        ]}
        image={FILM_IMAGES.family}
        imagePosition="left"
        darkBg
      />

      {/* Story: Consequence */}
      <StorySection
        title="SHE PAID THE PRICE"
        content={[
          "It wasn't his lungs that failed first. It was hers.",
          "The one who stayed. The one who loved. The one who believed he would change.",
          "He quit. But too late. The smoke had already taken everything."
        ]}
        image={FILM_IMAGES.eyes}
        imagePosition="right"
      />

      {/* Quote: Regret */}
      <QuoteSection
        quote="Regret doesn't heal. Not memories. Not photographs. Just ashes. And a jar full of what was left."
      />

      {/* Final Message */}
      <FinalMessageSection onRequestAccess={openModal} />

      {/* Live Counter */}
      <LiveCounter count={accessCount} />

      {/* Footer */}
      <Footer />

      {/* Access Modal */}
      <AccessModal isOpen={isModalOpen} onClose={closeModal} />
    </main>
  );
}
