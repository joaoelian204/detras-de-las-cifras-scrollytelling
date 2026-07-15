import React from 'react';
import { motion } from 'framer-motion';

export default function Credits({ active }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <section className="panel" id="p6" style={{ position: 'relative', overflow: 'hidden', background: "var(--bg)" }}>
      <div className="noise"></div>
      <div className="scan" style={{ top: '14%' }}></div>
      <div className="scan" style={{ top: '86%' }}></div>
      
      {/* Watermark in background */}
      <div 
        className="wm" 
        style={{ 
          position: "absolute", 
          bottom: "10%", 
          right: "5%", 
          fontSize: "14vw", 
          fontFamily: "Bebas Neue, sans-serif", 
          color: "rgba(244, 237, 226, 0.03)", 
          userSelect: "none",
          pointerEvents: "none",
          zIndex: 0
        }}
      >
        2026
      </div>

      {/* Background pulsing glow effect - set z-index: 0 and absolute centering */}
      <motion.div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          x: "-50%",
          y: "-50%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.06) 0%, transparent 70%)",
          zIndex: 0,
          pointerEvents: "none"
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="pcenter" style={{ zIndex: 10, position: 'relative', width: '100%', maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
        <motion.div 
          style={{ width: '100%', padding: '0 24px' }}
          variants={containerVariants}
          initial="hidden"
          animate={active ? 'visible' : 'hidden'}
        >
          {/* Header elements matching the visual system of the rest of the chapters */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <motion.span 
              className="tag" 
              style={{ 
                color: "#a855f7", 
                borderColor: "rgba(168, 85, 247, 0.3)",
                fontSize: "0.75rem",
                letterSpacing: "2px"
              }}
              variants={itemVariants}
            >
              Cierre · Equipo de Investigación
            </motion.span>
            
            <div className="ititle" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '8px' }}>
              <motion.span 
                className="logo-top"
                style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.8rem)", letterSpacing: "8px" }}
                variants={{
                  hidden: { opacity: 0, letterSpacing: '0px', y: 20, filter: 'blur(8px)' },
                  visible: { opacity: 1, letterSpacing: '8px', y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: 'easeOut' } }
                }}
              >
                DETRÁS DE LAS
              </motion.span>
              <motion.span 
                className="logo-bottom"
                style={{ fontSize: "clamp(3rem, 5vw, 5.5rem)", letterSpacing: "2px", fontWeight: 900, background: "linear-gradient(to bottom, #ff3366 30%, #a855f7 95%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                variants={{
                  hidden: { opacity: 0, scale: 0.8, filter: 'blur(15px)', y: 15 },
                  visible: { opacity: 1, scale: 1, filter: 'blur(0px)', y: 0, transition: { duration: 1.1, delay: 0.2, ease: 'easeOut' } }
                }}
              >
                CIFRAS
              </motion.span>
            </div>
            
            <motion.div 
              style={{ 
                width: "48px", 
                height: "2px", 
                background: "#a855f7", 
                margin: "12px auto" 
              }} 
              variants={itemVariants}
            />
          </div>

          {/* Academic Affiliation (Downscaled to avoid competing with main headings) */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <motion.p 
              style={{ 
                fontFamily: "Barlow Condensed, sans-serif",
                fontSize: "0.75rem",
                letterSpacing: "2px",
                color: "rgba(244, 237, 226, 0.45)",
                margin: "0 0 4px 0",
                textTransform: "uppercase"
              }}
              variants={itemVariants}
            >
              Facultad de Ciencias de la Vida y Tecnología
            </motion.p>
            <motion.p 
              style={{ 
                fontFamily: "Barlow Condensed, sans-serif",
                fontSize: "0.85rem",
                letterSpacing: "1px",
                color: "rgba(244, 237, 226, 0.6)",
                margin: 0
              }}
              variants={itemVariants}
            >
              Carrera de Software — 6to Semestre
            </motion.p>
          </div>

          {/* Teacher and Subject Info */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', marginBottom: '28px', textAlign: 'center' }}>
            <div>
              <motion.p 
                style={{ 
                  fontFamily: "Barlow Condensed, sans-serif", 
                  fontSize: "0.68rem", 
                  letterSpacing: "2px", 
                  color: "rgba(244, 237, 226, 0.4)",
                  margin: "0 0 2px 0",
                  textTransform: "uppercase"
                }}
                variants={itemVariants}
              >
                Asignatura
              </motion.p>
              <motion.p 
                style={{ 
                  fontFamily: "Barlow Condensed, sans-serif", 
                  fontSize: "1.1rem", 
                  fontWeight: "bold",
                  color: "var(--cream)",
                  margin: 0
                }}
                variants={itemVariants}
              >
                Visualización de Datos
              </motion.p>
            </div>
            <div>
              <motion.p 
                style={{ 
                  fontFamily: "Barlow Condensed, sans-serif", 
                  fontSize: "0.68rem", 
                  letterSpacing: "2px", 
                  color: "rgba(244, 237, 226, 0.4)",
                  margin: "0 0 2px 0",
                  textTransform: "uppercase"
                }}
                variants={itemVariants}
              >
                Docente
              </motion.p>
              <motion.p 
                style={{ 
                  fontFamily: "Barlow Condensed, sans-serif", 
                  fontSize: "1.1rem", 
                  fontWeight: "bold",
                  color: "var(--cream)",
                  margin: 0
                }}
                variants={itemVariants}
              >
                Anthony Legarda
              </motion.p>
            </div>
          </div>

          {/* Members cards in a structured 2x2 grid or responsive row */}
          <motion.div 
            style={{ 
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "14px",
              justifyContent: "center",
              width: "100%",
              maxWidth: "720px",
              margin: "0 auto 28px"
            }} 
            variants={itemVariants}
          >
            {["Carlos Valencia", "Joao Moreira", "Steven Magallanes", "David Jaramillo"].map((name) => (
              <motion.div 
                key={name}
                style={{
                  background: "rgba(255, 255, 255, 0.015)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  backdropFilter: "blur(12px)",
                  textAlign: "center",
                  fontFamily: "Barlow Condensed, sans-serif",
                  fontSize: "1.02rem",
                  fontWeight: "bold",
                  color: "rgba(244, 237, 226, 0.8)",
                  boxShadow: "inset 0 0 12px rgba(255,255,255,0.01)"
                }}
                whileHover={{ 
                  scale: 1.05, 
                  color: "#00f5cc", 
                  borderColor: "rgba(0, 245, 204, 0.35)",
                  boxShadow: "0 4px 20px rgba(0, 245, 204, 0.12), inset 0 0 12px rgba(255,255,255,0.02)",
                  cursor: "pointer" 
                }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                {name}
              </motion.div>
            ))}
          </motion.div>

          {/* Methodology Note - Styled matching the ex-insight from Simulator */}
          <motion.div 
            variants={itemVariants}
            style={{ 
              marginTop: "16px",
              padding: "14px 20px",
              background: "rgba(255, 255, 255, 0.012)",
              borderLeft: "3px solid #f59e0b", // Amber/Gold highlight accent
              borderRadius: "0 8px 8px 0",
              textAlign: "justify",
              fontFamily: "Inter, sans-serif",
              fontSize: "0.76rem",
              lineHeight: "1.5",
              color: "rgba(244, 237, 226, 0.6)"
            }}
          >
            <div style={{ fontSize: "0.68rem", letterSpacing: "1px", textTransform: "uppercase", color: "#f59e0b", fontWeight: "bold", marginBottom: "6px" }}>
              NOTA METODOLÓGICA:
            </div>
            El término "Detonante" en el título de este proyecto se emplea en sentido narrativo y periodístico, propio del título de la investigación. El análisis de datos presentado a lo largo de este trabajo —basado en series agregadas nacionales y provinciales de empleo, informalidad y homicidios— permite identificar evolución paralela y coexistencia temporal entre ambos fenómenos, mas no establece una relación causal comprobada estadísticamente. Otros factores no abordados aquí (narcotráfico, control territorial, capacidad institucional, entre otros) inciden también en la dinámica de la inseguridad en Ecuador.
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
