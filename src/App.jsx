import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import IntroPanel from './components/IntroPanel';
import Chapter1 from './components/Chapter1';
import Chapter2 from './components/Chapter2';
import Chapter3 from './components/Chapter3';
import Chapter4 from './components/Chapter4';
import MapSection from './components/MapSection';
import Simulator from './components/Simulator';
import Credits from './components/Credits';

gsap.registerPlugin(ScrollTrigger);

const getBackgroundStyle = (p) => {
  if (p < 15) {
    return 'linear-gradient(135deg, #07070a, #160824, #081726, #07070a)';
  }
  if (p < 30) {
    return 'radial-gradient(ellipse 80% 80% at 20% 50%, rgba(0, 245, 204, 0.05), transparent), #07070a';
  }
  if (p < 45) {
    return 'radial-gradient(ellipse 80% 80% at 80% 50%, rgba(51, 153, 255, 0.05), transparent), #07070a';
  }
  if (p < 60) {
    return 'radial-gradient(ellipse 75% 80% at 50% 50%, rgba(255, 51, 102, 0.12), transparent), #07070a';
  }
  if (p < 75) {
    return 'radial-gradient(ellipse 80% 80% at 30% 50%, rgba(225, 61, 61, 0.06), transparent), #07070a';
  }
  if (p < 90) {
    return 'radial-gradient(ellipse 80% 80% at 30% 50%, rgba(0, 245, 204, 0.03), transparent), #07070a';
  }
  return 'radial-gradient(ellipse 75% 75% at 50% 50%, rgba(168, 85, 247, 0.06), transparent), #07070a';
};

export default function App() {
  const scrollCanvasRef = useRef(null);
  const lenisRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const panelsCount = 8;
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 899);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 899);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const canvas = document.getElementById('bg-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 60;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.5,
        speedX: Math.random() * 0.4 - 0.2,
        speedY: -(Math.random() * 0.5 + 0.1),
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let lastScrollLeft = window.scrollX || document.documentElement.scrollLeft;

    const animateParticles = () => {
      ctx.clearRect(0, 0, width, height);
      
      const currentScrollLeft = window.scrollX || document.documentElement.scrollLeft;
      const scrollDiff = currentScrollLeft - lastScrollLeft;
      lastScrollLeft = currentScrollLeft;

      const wind = scrollDiff * 0.05;

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX - wind;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244, 237, 226, ${p.alpha})`;
        ctx.shadowBlur = p.radius * 3;
        ctx.shadowColor = 'var(--teal)';
        ctx.fill();
      });

      animationId = requestAnimationFrame(animateParticles);
    };

    animateParticles();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const scrollCanvas = scrollCanvasRef.current;
    
    const lenis = new Lenis({
      orientation: 'horizontal',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.15,
      touchMultiplier: 1.5,
      syncTouch: true
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tickHandler = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickHandler);
    gsap.ticker.lagSmoothing(0);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollCanvas,
        start: 'left left',
        end: 'right right',
        scrub: 1.8,
        horizontal: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const prog = self.progress;
          setProgress(prog * 100);
          
          const idx = Math.round(prog * (panelsCount - 1));
          setActiveIdx(idx);
        }
      }
    });

    tl.to('#prog', {
      width: '100%',
      ease: 'none',
      duration: 7
    }, 0);

    tl.fromTo('#p0', { opacity: 1, filter: 'blur(0px)' }, { opacity: 0, filter: 'blur(15px)', duration: 1.0, ease: 'power2.inOut' }, 0.5);

    tl.fromTo('#p1', 
      { opacity: 0, filter: 'blur(20px)', scale: 0.97 }, 
      { 
        opacity: 1, filter: 'blur(0px)', scale: 1.0, duration: 1.0, ease: 'power2.inOut',
        onComplete: () => window.dispatchEvent(new CustomEvent('panel-revealed', { detail: { id: 'p1' } }))
      }, 
      0.5
    );
    tl.to('#p1', { opacity: 0, filter: 'blur(20px)', scale: 0.97, duration: 1.0, ease: 'power2.inOut' }, 1.5);
    tl.fromTo('#p1 .wm', { xPercent: 12 }, { xPercent: -18, ease: 'none' }, 0.5);

    tl.fromTo('#p2', 
      { opacity: 0, filter: 'blur(20px)', scale: 0.97 }, 
      { 
        opacity: 1, filter: 'blur(0px)', scale: 1.0, duration: 1.0, ease: 'power2.inOut',
        onComplete: () => window.dispatchEvent(new CustomEvent('panel-revealed', { detail: { id: 'p2' } }))
      }, 
      1.5
    );
    tl.to('#p2', { opacity: 0, filter: 'blur(20px)', scale: 0.97, duration: 1.0, ease: 'power2.inOut' }, 2.5);
    tl.fromTo('#p2 .wm', { xPercent: 12 }, { xPercent: -18, ease: 'none' }, 1.5);

    tl.fromTo('#p3', 
      { opacity: 0, filter: 'blur(20px)', scale: 0.97 }, 
      { 
        opacity: 1, filter: 'blur(0px)', scale: 1.0, duration: 1.0, ease: 'power2.inOut',
        onComplete: () => window.dispatchEvent(new CustomEvent('panel-revealed', { detail: { id: 'p3' } }))
      }, 
      2.5
    );
    tl.to('#p3', { opacity: 0, filter: 'blur(20px)', scale: 0.97, duration: 1.0, ease: 'power2.inOut' }, 3.5);
    tl.fromTo('#p3 .wm', { xPercent: 12 }, { xPercent: -18, ease: 'none' }, 2.5);

    tl.fromTo('#p4', 
      { opacity: 0, filter: 'blur(20px)', scale: 0.97 }, 
      { 
        opacity: 1, filter: 'blur(0px)', scale: 1.0, duration: 1.0, ease: 'power2.inOut',
        onComplete: () => window.dispatchEvent(new CustomEvent('panel-revealed', { detail: { id: 'p4' } }))
      }, 
      3.5
    );
    tl.to('#p4', { opacity: 0, filter: 'blur(20px)', scale: 0.97, duration: 1.0, ease: 'power2.inOut' }, 4.5);
    tl.fromTo('#p4 .wm', { xPercent: 12 }, { xPercent: -18, ease: 'none' }, 3.5);

    tl.fromTo('#p_map', 
      { opacity: 0, filter: 'blur(20px)', scale: 0.97 }, 
      { 
        opacity: 1, filter: 'blur(0px)', scale: 1.0, duration: 1.0, ease: 'power2.inOut',
        onComplete: () => window.dispatchEvent(new CustomEvent('panel-revealed', { detail: { id: 'p_map' } }))
      }, 
      4.5
    );
    tl.to('#p_map', { opacity: 0, filter: 'blur(20px)', scale: 0.97, duration: 1.0, ease: 'power2.inOut' }, 5.5);

    tl.fromTo('#p5', 
      { opacity: 0, filter: 'blur(20px)', scale: 0.97 }, 
      { 
        opacity: 1, filter: 'blur(0px)', scale: 1.0, duration: 1.0, ease: 'power2.inOut',
        onComplete: () => window.dispatchEvent(new CustomEvent('panel-revealed', { detail: { id: 'p5' } }))
      }, 
      5.5
    );
    tl.to('#p5', { opacity: 0, filter: 'blur(20px)', scale: 0.97, duration: 1.0, ease: 'power2.inOut' }, 6.5);

    tl.fromTo('#p6', 
      { opacity: 0, filter: 'blur(20px)', scale: 0.97 }, 
      { 
        opacity: 1, filter: 'blur(0px)', scale: 1.0, duration: 1.0, ease: 'power2.inOut',
        onComplete: () => window.dispatchEvent(new CustomEvent('panel-revealed', { detail: { id: 'p6' } }))
      }, 
      6.5
    );
    tl.fromTo('#p6 .wm', { xPercent: 12 }, { xPercent: -18, ease: 'none' }, 6.5);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tickHandler);
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) return;

    const onScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const vh = window.innerHeight;
      const totalHeight = panelsCount * vh;
      const prog = Math.min(scrollY / totalHeight, 1);
      setProgress(prog * 100);

      const idx = Math.round(prog * (panelsCount - 1));
      setActiveIdx(idx);
    };

    const fireReveals = () => {
      const panels = ['p0','p1','p2','p3','p4','p_map','p5','p6'];
      const vh = window.innerHeight;
      panels.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < vh * 0.75 && rect.bottom > 0) {
            window.dispatchEvent(new CustomEvent('panel-revealed', { detail: { id } }));
          }
        }
      });
    };

    window.addEventListener('scroll', onScroll);
    window.addEventListener('scroll', fireReveals);
    fireReveals();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', fireReveals);
    };
  }, [isMobile]);

  const handleDotClick = (idx) => {
    if (isMobile) {
      const target = document.getElementById(`p${idx === 5 ? '_map' : idx === 6 ? '5' : idx === 7 ? '6' : idx}`);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const totalScrollWidth = (panelsCount - 1) * window.innerWidth;
    const targetScroll = (idx / (panelsCount - 1)) * totalScrollWidth;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetScroll);
    } else {
      window.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  const isNear = (idx) => Math.abs(activeIdx - idx) <= 1;

  return (
    <>
      <div id="prog"></div>

      <nav id="nav">
        <div id="nav-logo">DETRÁS DE LAS CIFRAS</div>
        <div id="nav-ch" style={{ opacity: progress > 2 ? 1 : 0 }}>
          ECUADOR 2007 &ndash; 2026
        </div>
      </nav>

      <div id="dots">
        {Array.from({ length: panelsCount }).map((_, idx) => (
          <div
            key={idx}
            className={`dot ${activeIdx === idx ? 'active' : ''}`}
            onClick={() => handleDotClick(idx)}
            title={`Sección ${idx + 1}`}
          />
        ))}
      </div>

      <div id="sh" style={{ opacity: progress > 5 ? 0 : 1 }}>
        SCROLL
      </div>

      <div id="bg-fixed" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: getBackgroundStyle(progress),
        zIndex: -1,
        transition: 'background 1.2s ease',
        pointerEvents: 'none'
      }}>
        <canvas id="bg-particles" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.4 }}></canvas>
      </div>

      {!isMobile && (
        <div 
          ref={scrollCanvasRef}
          style={{
            width: `${panelsCount * 100}vw`,
            height: '100vh',
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            zIndex: -2
          }} 
        />
      )}

      <div id="container" className={isMobile ? 'mobile' : ''}>
        <div className={`panel-wrapper ${activeIdx === 0 ? 'active' : ''}`} style={{ zIndex: activeIdx === 0 ? 10 : 1, display: !isMobile && !isNear(0) ? 'none' : undefined }}>
          <IntroPanel active={isMobile ? true : activeIdx === 0} />
        </div>
        <div className={`panel-wrapper ${activeIdx === 1 ? 'active' : ''}`} style={{ zIndex: activeIdx === 1 ? 10 : 1, display: !isMobile && !isNear(1) ? 'none' : undefined }}>
          <Chapter1 active={isMobile ? true : activeIdx === 1} />
        </div>
        <div className={`panel-wrapper ${activeIdx === 2 ? 'active' : ''}`} style={{ zIndex: activeIdx === 2 ? 10 : 1, display: !isMobile && !isNear(2) ? 'none' : undefined }}>
          <Chapter2 active={isMobile ? true : activeIdx === 2} />
        </div>
        <div className={`panel-wrapper ${activeIdx === 3 ? 'active' : ''}`} style={{ zIndex: activeIdx === 3 ? 10 : 1, display: !isMobile && !isNear(3) ? 'none' : undefined }}>
          <Chapter3 active={isMobile ? true : activeIdx === 3} />
        </div>
        <div className={`panel-wrapper ${activeIdx === 4 ? 'active' : ''}`} style={{ zIndex: activeIdx === 4 ? 10 : 1, display: !isMobile && !isNear(4) ? 'none' : undefined }}>
          <Chapter4 active={isMobile ? true : activeIdx === 4} />
        </div>
        <div className={`panel-wrapper ${activeIdx === 5 ? 'active' : ''}`} style={{ zIndex: activeIdx === 5 ? 10 : 1, display: !isMobile && !isNear(5) ? 'none' : undefined }}>
          <MapSection active={isMobile ? true : activeIdx === 5} />
        </div>
        <div className={`panel-wrapper ${activeIdx === 6 ? 'active' : ''}`} style={{ zIndex: activeIdx === 6 ? 10 : 1, display: !isMobile && !isNear(6) ? 'none' : undefined }}>
          <Simulator active={isMobile ? true : activeIdx === 6} />
        </div>
        <div className={`panel-wrapper ${activeIdx === 7 ? 'active' : ''}`} style={{ zIndex: activeIdx === 7 ? 10 : 1, display: !isMobile && !isNear(7) ? 'none' : undefined }}>
          <Credits active={isMobile ? true : activeIdx === 7} />
        </div>
      </div>
    </>
  );
}
