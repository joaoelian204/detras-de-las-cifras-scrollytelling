import React from 'react';
import { motion } from 'framer-motion';

export default function IntroPanel() {
  return (
    <section className="panel" id="p0">
      <div className="noise"></div>
      <div className="scan" style={{ top: '22%' }}></div>
      <div className="scan" style={{ top: '78%' }}></div>
      
      {/* Sun glow pulsing */}
      <motion.div 
        className="sun-glow"
        animate={{
          scale: [0.9, 1.08, 0.9],
          opacity: [0.7, 1.0, 0.7],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating year watermarks drifting slowly */}
      <motion.div 
        className="intro-watermark"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, x: [0, 15, 0], y: [0, -10, 0] }}
        transition={{ opacity: { duration: 0.6, delay: 2.2 }, x: { duration: 15, repeat: Infinity, ease: 'easeInOut' }, y: { duration: 15, repeat: Infinity, ease: 'easeInOut' } }}
      >
        2007
      </motion.div>
      <motion.div 
        className="intro-watermark-left"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, x: [0, -15, 0], y: [0, 10, 0] }}
        transition={{ opacity: { duration: 0.6, delay: 2.4 }, x: { duration: 18, repeat: Infinity, ease: 'easeInOut' }, y: { duration: 18, repeat: Infinity, ease: 'easeInOut' } }}
      >
        2026
      </motion.div>

      <div className="pcenter" style={{ zIndex: 2 }}>
        {/* Paso 1: Subtitle Top */}
        <motion.p 
          className="iey"
          style={{ letterSpacing: '8px', textTransform: 'uppercase', fontSize: '0.8rem', color: 'var(--teal)', marginBottom: '16px' }}
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
        >
          Ecuador &middot; Análisis Socioeconómico &middot; INEC &amp; Ministerio del Interior
        </motion.p>

        {/* Paso 2: Title Stack */}
        <div className="ititle">
          <motion.span 
            className="logo-top"
            initial={{ opacity: 0, letterSpacing: '0px', y: 40, filter: 'blur(12px)' }}
            animate={{ opacity: 1, letterSpacing: '12px', y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.1, delay: 0.7, ease: 'easeOut' }}
          >
            DETRÁS DE LAS
          </motion.span>
          <motion.span 
            className="logo-bottom"
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)', y: 20 }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 1.4, delay: 1.2, ease: 'easeOut' }}
          >
            CIFRAS
          </motion.span>
        </div>

        {/* Paso 3: Slogan */}
        <motion.p 
          className="isub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.65, y: 0 }}
          transition={{ duration: 0.9, delay: 1.9, ease: 'easeOut' }}
        >
          Radiografía de la crisis laboral como detonante de la inseguridad en Ecuador
        </motion.p>

        {/* Paso 4: Period */}
        <motion.p 
          className="iperiod"
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.5, ease: 'easeOut' }}
        >
          2007 &mdash; 2026
        </motion.p>

        {/* Paso 5: Scroll hint — aparece al final */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.4, y: 0 }}
          transition={{ duration: 0.8, delay: 3.2 }}
          style={{ fontSize: '0.7rem', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--cream)', marginTop: '8px' }}
        >
          ↓ Scroll para explorar
        </motion.p>
      </div>
    </section>
  );
}
