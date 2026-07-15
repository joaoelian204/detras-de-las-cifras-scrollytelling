import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { animate } from 'animejs';
import gsap from 'gsap';
import { useWindowWidth } from '../hooks/useResponsiveChartHeight';
import ecuadorGeoJson from './ecuador-provinces.json';

// Helper function to interpolate between two hex colors smoothly
function interpolateColor(color1, color2, factor) {
  const c1 = parseHex(color1);
  const c2 = parseHex(color2);
  
  const r = Math.round(c1.r + factor * (c2.r - c1.r));
  const g = Math.round(c1.g + factor * (c2.g - c1.g));
  const b = Math.round(c1.b + factor * (c2.b - c1.b));
  
  return `rgb(${r}, ${g}, ${b})`;
}

function parseHex(hex) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return { r, g, b };
}

// RESOLVED: Traffic light color scale based on cases count (Green = Low, Yellow = Medium, Red = High)
function getColorForCases(cases) {
  if (cases <= 0) return '#0f1715';
  
  if (cases <= 40) {
    const ratio = cases / 40;
    return interpolateColor('#0f1715', '#10b981', ratio);
  }
  if (cases <= 200) {
    const ratio = (cases - 40) / 160;
    return interpolateColor('#10b981', '#eab308', ratio);
  }
  if (cases <= 600) {
    const ratio = (cases - 200) / 400;
    return interpolateColor('#eab308', '#f97316', ratio);
  }
  if (cases <= 1200) {
    const ratio = (cases - 600) / 600;
    return interpolateColor('#f97316', '#ef4444', ratio);
  }
  if (cases <= 4000) {
    const ratio = (cases - 1200) / 2800;
    return interpolateColor('#ef4444', '#7f1d1d', ratio);
  }
  return '#7f1d1d';
}

function getColorForRate(rate) {
  if (rate <= 0) return '#0f1715';
  
  if (rate <= 5) {
    const ratio = rate / 5;
    return interpolateColor('#0f1715', '#10b981', ratio);
  }
  if (rate <= 20) {
    const ratio = (rate - 5) / 15;
    return interpolateColor('#10b981', '#eab308', ratio);
  }
  if (rate <= 50) {
    const ratio = (rate - 20) / 30;
    return interpolateColor('#eab308', '#f97316', ratio);
  }
  if (rate <= 90) {
    const ratio = (rate - 50) / 40;
    return interpolateColor('#f97316', '#ef4444', ratio);
  }
  if (rate <= 140) {
    const ratio = (rate - 90) / 50;
    return interpolateColor('#ef4444', '#7f1d1d', ratio);
  }
  return '#7f1d1d';
}

function getSeverityCategory(cases) {
  if (cases <= 40) return 'bajo';
  if (cases <= 600) return 'medio';
  return 'critico';
}

const HOTSPOTS = [
  {
    id: 'puebloviejo',
    name: 'Puebloviejo',
    province: 'Los Ríos',
    hc_x: 4301.9,
    hc_y: 4828.0,
    homicides: '148',
    rate: '360.0',
    status: 'Crítico - Alerta Roja Máxima',
    color: '#ffffff',
    severity: 'critico',
    desc: 'El cantón combina la tasa de homicidios más alta del país (360 por cada 100k hab.) con una economía predominantemente agrícola informal. Cobertura periodística y de seguridad asocia la zona con disputas de bandas por el control de rutas de comercialización agrícola.'
  },
  {
    id: 'lasnaves',
    name: 'Las Naves',
    province: 'Bolívar',
    hc_x: 4657.9,
    hc_y: 5282.2,
    homicides: '38',
    rate: '210.5',
    status: 'Extremo - Zona Roja',
    color: '#ffffff',
    severity: 'critico',
    desc: 'Pequeño cantón colindante con la provincia de Los Ríos. Con una economía agrícola local caracterizada por altos niveles de informalidad a nivel provincial, reportes de seguridad asocian esta zona con actividades logísticas de almacenamiento de grupos delictivos.'
  },
  {
    id: 'balao',
    name: 'Balao',
    province: 'Guayas',
    hc_x: 3809.0,
    hc_y: 2539.9,
    homicides: '78',
    rate: '180.2',
    status: 'Extremo - Corredor del Golfo',
    color: '#ffffff',
    severity: 'critico',
    desc: 'Eje costero al sur del Guayas cuya actividad económica principal es la pesca artesanal. Análisis de seguridad asocian su cercanía a los canales fluviales del Golfo con dinámicas de contrabando, piratería y asaltos marítimos.'
  },
  {
    id: 'duran',
    name: 'Durán',
    province: 'Guayas',
    hc_x: 3793.2,
    hc_y: 3785.1,
    homicides: '582',
    rate: '145.2',
    status: 'Extremo - Foco Metropolitano',
    color: '#ffffff',
    severity: 'critico',
    desc: 'Foco industrial y portuario de la provincia del Guayas. Registros policiales asocian la vulnerabilidad social y la falta de alternativas laborales formales en la zona con el desarrollo de centros de operaciones de delincuencia organizada y microtráfico.'
  },
  {
    id: 'quevedo',
    name: 'Quevedo',
    province: 'Los Ríos',
    hc_x: 4421.0,
    hc_y: 5719.9,
    homicides: '392',
    rate: '115.4',
    status: 'Extremo - Corredor Norte',
    color: '#ffffff',
    severity: 'critico',
    desc: 'Eje de transporte en el norte de Los Ríos. Cobertura periodística destaca que la escasez de empleo adecuado en la provincia coexiste con una alta incidencia de secuestros extorsivos y hechos de sicariato comercial.'
  },
  {
    id: 'esmeraldas',
    name: 'Esmeraldas',
    province: 'Esmeraldas',
    hc_x: 4099.2,
    hc_y: 9051.8,
    homicides: '368',
    rate: '92.4',
    status: 'Alerta Roja - Zona Fronteriza',
    color: '#ffffff',
    severity: 'critico',
    desc: 'Puerto costero fronterizo del norte. Cobertura de prensa y reportes de derechos humanos asocian la debilidad del mercado laboral formal a nivel provincial con la captación de jóvenes por parte de redes de criminalidad organizada.'
  },
  {
    id: 'guayaquil',
    name: 'Guayaquil',
    province: 'Guayas',
    hc_x: 3674.7,
    hc_y: 3751.6,
    homicides: '2,842',
    rate: '88.5',
    status: 'Alerta Roja - Foco Urbano',
    color: '#ffffff',
    severity: 'critico',
    desc: 'El principal puerto comercial del país concentra el mayor volumen absoluto de homicidios. Informes de seguridad señalan que la alta incidencia de informalidad urbana, observada en zonas urbano-marginales de la provincia, acompaña dinámicas de exclusión y captación delictiva.'
  },
  {
    id: 'manta',
    name: 'Manta',
    province: 'Manabí',
    hc_x: 2287.2,
    hc_y: 5838.2,
    homicides: '425',
    rate: '130.8',
    status: 'Alerta Roja - Foco Logístico',
    color: '#ffffff',
    severity: 'critico',
    desc: 'Puerto pesquero internacional. Investigaciones policiales asocian la zona con operaciones de tráfico marítimo y contrabando, donde la escasez de puestos de trabajo formales en la provincia coincide con la vulnerabilidad social de sectores pesqueros.'
  },
  {
    id: 'machala',
    name: 'Machala',
    province: 'El Oro',
    hc_x: 3571.6,
    hc_y: 1951.3,
    homicides: '244',
    rate: '68.2',
    status: 'Alerta Roja - Corredor Fronterizo',
    color: '#ffffff',
    severity: 'critico',
    desc: 'Cantón costero de la frontera sur. Análisis locales asocian la actividad minera de la provincia y la alta informalidad laboral a nivel provincial con una mayor exposición de la población desocupada a dinámicas de extorsión.'
  },
  {
    id: 'quito',
    name: 'Quito',
    province: 'Pichincha',
    hc_x: 6099.2,
    hc_y: 7133.3,
    homicides: '262',
    rate: '12.4',
    status: 'Moderado - Capital',
    color: '#00f5cc',
    severity: 'bajo',
    desc: 'La capital del país registra un comportamiento delictivo menor al de la costa. Es consistente con la hipótesis de que mayores niveles de empleo formal (cercano al 45% a nivel provincial) y la presencia institucional coexisten con tasas más bajas de criminalidad urbana.'
  }
];

const PROVINCE_STATS = {
  'ec-lr': { name: 'Los Ríos', rate: 130.4, cases: 1184, isLitoral: true },
  'ec-gu': { name: 'Guayas', rate: 88.5, cases: 3968, isLitoral: true },
  'ec-es': { name: 'Esmeraldas', rate: 72.1, cases: 468, isLitoral: true },
  'ec-eo': { name: 'El Oro', rate: 68.2, cases: 412, isLitoral: true },
  'ec-mn': { name: 'Manabí', rate: 58.4, cases: 944, isLitoral: true },
  'ec-se': { name: 'Santa Elena', rate: 45.0, cases: 188, isLitoral: true },
  'ec-sd': { name: 'Santo Domingo De Los Tsachilas', rate: 38.0, cases: 172, isLitoral: false },
  'ec-su': { name: 'Sucumbios', rate: 35.0, cases: 78, isLitoral: false },
  'ec-na': { name: 'Orellana', rate: 26.0, cases: 42, isLitoral: false },
  'ec-pi': { name: 'Pichincha', rate: 12.4, cases: 388, isLitoral: false },
  'ec-az': { name: 'Azuay', rate: 10.1, cases: 92, isLitoral: false },
  'ec-1076': { name: 'Tungurahua', rate: 9.2, cases: 54, isLitoral: false },
  'ec-im': { name: 'Imbabura', rate: 8.5, cases: 42, isLitoral: false },
  'ec-lj': { name: 'Loja', rate: 5.4, cases: 28, isLitoral: false },
  'ec-cr': { name: 'Carchi', rate: 7.2, cases: 14, isLitoral: false },
  'ec-ct': { name: 'Cotopaxi', rate: 9.8, cases: 48, isLitoral: false },
  'ec-cb': { name: 'Chimborazo', rate: 6.1, cases: 32, isLitoral: false },
  'ec-bo': { name: 'Bolivar', rate: 14.2, cases: 30, isLitoral: false },
  'ec-cn': { name: 'Cañar', rate: 11.5, cases: 28, isLitoral: false },
  'ec-pa': { name: 'Pastaza', rate: 8.0, cases: 10, isLitoral: false },
  'ec-ms': { name: 'Morona Santiago', rate: 7.5, cases: 16, isLitoral: false },
  'ec-zc': { name: 'Zamora Chinchipe', rate: 6.2, cases: 8, isLitoral: false },
  'ec-tu': { name: 'Napo', rate: 5.0, cases: 6, isLitoral: false },
  'ec-ga': { name: 'Galápagos', rate: 0.0, cases: 0, isLitoral: false }
};

const PROVINCE_NARRATIVES = {
  'Los Ríos': 'La provincia registra una tasa de 130.4 muertes por cada 100k hab. La informalidad agrícola cacaotera y bananera, predominante en la zona, coexiste con dinámicas de reclutamiento juvenil por bandas de extorsión, según informes de seguridad.',
  'Guayas': 'La provincia industrial del Litoral registra 3,968 casos en 2025. Se asocia con altos niveles de informalidad laboral, coincidiendo con áreas vulnerables a dinámicas de pandillas y violencia de bandas.',
  'Esmeraldas': 'Frontera norte costera. El empleo pleno promedio de la provincia se sitúa en niveles históricamente bajos. Informes de seguridad indican que esta situación se da en paralelo a dinámicas de reclutamiento para el tráfico marítimo.',
  'El Oro': 'Provincia de la frontera sur. Análisis de seguridad asocian la informalidad en la minería artesanal y en puertos de cabotaje con la proliferación de extorsiones y exigencias de cobros ilegales.',
  'Manabí': 'Provincia costera con puertos pesqueros. Informes policiales asocian la escasez de empleo adecuado en la provincia con la captación de pescadores artesanales informales por parte de redes delictivas.',
  'Santa Elena': 'Península costera. Analistas de seguridad asocian el incremento delictivo en la provincia con el efecto derrame urbano y la alta informalidad en los sectores pesquero y hotelero locales.',
  'Pichincha': 'Territorio con tasa de 12.4. Es consistente con la hipótesis de que mayores niveles de empleo formal (45% a nivel provincial) y de presencia institucional coexisten con menores niveles de criminalidad, aunque influyen otros factores territoriales.',
  'Santo Domingo De Los Tsachilas': 'Eje de transporte interregional. Registra alza de incidentes en corredores viales, coincidiendo con un nivel de empleo adecuado provincial bajo.',
  'Sucumbios': 'Provincia fronteriza amazónica. Reportes de seguridad asocian la baja oferta laboral formal rural con la vulnerabilidad frente a corredores logísticos informales o ilícitos.'
};
const WIDTH = 420;
const HEIGHT = 460;

function project(hc_x, hc_y) {
  const minX = 1750;
  const maxX = 11650;
  const minY = -1050;
  const maxY = 9950;

  const x = ((hc_x - minX) / (maxX - minX)) * WIDTH;
  const y = HEIGHT - ((hc_y - minY) / (maxY - minY)) * HEIGHT;
  return [x, y];
}

export default function MapSection({ active }) {
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth <= 899;

  const [selectedType, setSelectedType] = useState('hotspot');
  const [selectedId, setSelectedId] = useState('puebloviejo');
  const [hoveredProv, setHoveredProv] = useState(null);
  const [colorFilter, setColorFilter] = useState('todos');
  const [colorMode, setColorMode] = useState('cases'); // 'cases' | 'rate'

  const mapData = useMemo(() => {
    const filteredFeatures = ecuadorGeoJson.features.filter(
      f => f.properties.name !== 'Galápagos' && f.properties.name !== null
    );
    return { ...ecuadorGeoJson, features: filteredFeatures };
  }, []);

  const activeDetails = useMemo(() => {
    if (selectedType === 'hotspot') {
      const h = HOTSPOTS.find(item => item.id === selectedId) || HOTSPOTS[0];
      return {
        title: h.name,
        subtitle: `CANTÓN DE ${h.province.toUpperCase()}`,
        status: h.status,
        color: h.color,
        homicides: h.homicides,
        rate: h.rate,
        desc: h.desc
      };
    } else {
      const p = selectedId;
      const hcKey = Object.keys(PROVINCE_STATS).find(key => PROVINCE_STATS[key].name === p);
      const stats = PROVINCE_STATS[hcKey] || { rate: 0, cases: 0, isLitoral: false };
      const desc = PROVINCE_NARRATIVES[p] || 'Provincia con niveles estables o moderados de delincuencia. Muestra una fuerte resiliencia social y mayor porcentaje de empleo adecuado.';
      return {
        title: p,
        subtitle: 'DETALLE PROVINCIAL',
        status: stats.isLitoral ? 'Crítico - Corredor Costa' : 'Estable / Moderado',
        color: stats.isLitoral ? 'var(--red)' : 'var(--teal)',
        homicides: stats.cases.toLocaleString('es'),
        rate: stats.rate.toFixed(1),
        desc: desc
      };
    }
  }, [selectedType, selectedId]);

  const activeParentProvince = useMemo(() => {
    if (selectedType === 'hotspot') {
      const h = HOTSPOTS.find(item => item.id === selectedId);
      return h ? h.province : null;
    }
    return null;
  }, [selectedType, selectedId]);

  const getSvgPath = (geometry) => {
    if (!geometry) return '';
    if (geometry.type === 'Polygon') {
      return geometry.coordinates.map(ring => {
        return 'M ' + ring.map(coord => {
          const [x, y] = project(coord[0], coord[1]);
          return `${x.toFixed(1)},${y.toFixed(1)}`;
        }).join(' L ') + ' Z';
      }).join(' ');
    } else if (geometry.type === 'MultiPolygon') {
      return geometry.coordinates.map(polygon => {
        return polygon.map(ring => {
          return 'M ' + ring.map(coord => {
            const [x, y] = project(coord[0], coord[1]);
            return `${x.toFixed(1)},${y.toFixed(1)}`;
          }).join(' L ') + ' Z';
        }).join(' ');
      }).join(' ');
    }
    return '';
  };

  const [displayHomicides, setDisplayHomicides] = useState(0);
  const [displayRate, setDisplayRate] = useState(0.0);

  useEffect(() => {
    const targetHomicides = parseInt(String(activeDetails.homicides).replace(/,/g, "")) || 0;
    const targetRate = parseFloat(activeDetails.rate) || 0.0;

    const startH = displayHomicides;
    const startR = displayRate;

    const obj = { h: startH, r: startR };
    animate(obj, {
      h: targetHomicides,
      r: targetRate,
      duration: 800,
      ease: 'easeOutQuad',
      onUpdate: () => {
        setDisplayHomicides(Math.round(obj.h));
        setDisplayRate(parseFloat(obj.r.toFixed(1)));
      }
    });
  }, [activeDetails]);

  useEffect(() => {
    if (!active) return;

    const runHotspotAnimation = () => {
      gsap.fromTo('#hotspots-layer g',
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, stagger: 0.05, duration: 0.8, transformOrigin: 'center center' }
      );
    };

    const handleReveal = (e) => {
      if (e.detail.id === 'p_map') {
        runHotspotAnimation();
      }
    };
    window.addEventListener('panel-revealed', handleReveal);

    const fallback = setTimeout(runHotspotAnimation, 600);

    return () => {
      window.removeEventListener('panel-revealed', handleReveal);
      clearTimeout(fallback);
    };
  }, [active]);

  return (
    <section className="panel" id="p_map" style={{ background: 'var(--bg)' }}>
      <div className="noise"></div>
      <div className="scan" style={{ top: '15%' }}></div>
      <div className="scan" style={{ top: '85%' }}></div>

      <div className="psplit" style={{ gridTemplateColumns: '1.0fr 1.15fr', gap: '30px' }}>
        
        {/* LEFT PANEL - DETAIL CARD */}
        <div className="pleft" style={{ zIndex: 10 }}>
          <span className="tag" style={{ color: 'var(--red)', borderColor: 'rgba(255, 51, 102, 0.4)' }}>
            Radiografía Geográfica de la Inseguridad
          </span>
          <div className="hl" style={{ background: 'var(--red)', boxShadow: '0 0 8px var(--red)' }}></div>
          <h2 className="ptitle" style={{ color: '#fff', fontSize: 'clamp(1.8rem, 3.8vw, 4.2rem)', marginBottom: '6px' }}>
            ZONAS EN<br /><span style={{ color: 'var(--red)', textShadow: '0 0 50px var(--red-glow)' }}>ALERTA ROJA</span>
          </h2>
          <p className="pdesc" style={{ fontSize: '0.78rem', lineHeight: 1.6, marginBottom: '22px' }}>
            Haz clic en las provincias o cantones del mapa para explorar sus estadísticas. Usa los filtros interactivos por color integrados dentro del mapa para segmentar la severidad del crimen.
          </p>

          {/* DYNAMIC ACTIVE DETAIL CARD */}
          <div 
            style={{ 
              background: 'rgba(255, 255, 255, 0.02)', 
              border: `1px solid ${activeDetails.color}33`, 
              borderRadius: '20px', 
              padding: '24px 28px', 
              backdropFilter: 'blur(12px)',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: `0 0 25px ${activeDetails.color}08`,
            }}
          >
            <div 
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '6px', 
                height: '100%', 
                background: activeDetails.color,
                boxShadow: `0 0 10px ${activeDetails.color}`
              }} 
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
              <h3 style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '2.5rem', letterSpacing: '1px', color: '#fff', margin: 0 }}>
                {activeDetails.title}
              </h3>
              <span style={{ 
                fontFamily: 'Barlow Condensed, sans-serif', 
                fontSize: '0.75rem', 
                letterSpacing: '2px', 
                textTransform: 'uppercase', 
                color: activeDetails.color,
                fontWeight: 'bold'
              }}>
                {activeDetails.status}
              </span>
            </div>

            <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(244, 237, 226, 0.45)', marginBottom: '14px' }}>
              Nivel: <strong style={{ color: '#fff' }}>{activeDetails.subtitle}</strong>
            </p>

            <div className="srow" style={{ marginBottom: '16px', gap: '10px' }}>
              <div className="scard" style={{ padding: '12px 18px', background: 'rgba(255, 255, 255, 0.01)' }}>
                <div className="sn" style={{ color: activeDetails.color, fontSize: '1.9rem' }}>{displayHomicides.toLocaleString("es")}</div>
                <div className="sl" style={{ fontSize: '0.62rem', letterSpacing: '1px' }}>Homicidios Totales</div>
              </div>
              <div className="scard" style={{ padding: '12px 18px', background: 'rgba(255, 255, 255, 0.01)' }}>
                <div className="sn" style={{ color: '#fff', fontSize: '1.9rem' }}>{displayRate}</div>
                <div className="sl" style={{ fontSize: '0.62rem', letterSpacing: '1px' }}>Tasa por 100k hab.</div>
              </div>
            </div>

            {/* Desc with elegant fade clamp - no scroll */}
            <div style={{ position: 'relative' }}>
              <p style={{ 
                fontSize: '0.82rem', 
                lineHeight: 1.7, 
                color: 'rgba(244, 237, 226, 0.7)', 
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 5,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {activeDetails.desc}
              </p>
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '32px',
                background: `linear-gradient(to bottom, transparent, rgba(10, 10, 15, 0.92))`,
                pointerEvents: 'none',
              }} />
            </div>
          </div>

          {/* Fuente de datos del Mapa */}
          <div
            style={{
              textAlign: "left",
              fontFamily: "Barlow Condensed, Inter, sans-serif",
              fontSize: "10px",
              letterSpacing: "0.04em",
              color: "rgba(244,237,226,0.35)",
              marginTop: "16px",
              paddingLeft: "4px",
            }}
          >
            Fuente: Ministerio del Interior / Observatorio Ecuatoriano de Crimen Organizado (OECO-PADF)
          </div>
        </div>

        {/* RIGHT PANEL - DETAILED GEOGRAPHIC CHOROPLETH MAP */}
        <div className="pright" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          {/* LEYENDAS Y FILTROS INTEGRADOS DIRECTAMENTE EN LA PARTE SUPERIOR DEL ÁREA DEL MAPA */}
          {/* LEYENDAS Y FILTROS INTEGRADOS DIRECTAMENTE EN LA PARTE SUPERIOR DEL ÁREA DEL MAPA */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            background: 'rgba(255,255,255,0.015)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '12px',
            padding: '10px 12px',
            width: '95%',
            backdropFilter: 'blur(8px)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '0.72rem', letterSpacing: '1px', color: 'rgba(244,237,226,0.45)', textTransform: 'uppercase' }}>
                Filtrar severidad:
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['todos', 'critico', 'medio', 'bajo'].map(type => (
                  <button
                    key={type}
                    onClick={() => setColorFilter(type)}
                    style={{
                      background: colorFilter === type 
                        ? (type === 'critico' ? '#ef4444' : type === 'medio' ? '#eab308' : type === 'bajo' ? '#10b981' : '#fff')
                        : 'rgba(255,255,255,0.02)',
                      color: colorFilter === type && type !== 'critico' ? '#000' : '#fff',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '6px',
                      fontSize: '0.62rem',
                      fontFamily: 'Barlow Condensed',
                      fontWeight: 'bold',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {type !== 'todos' && (
                      <span style={{ 
                        width: '5px', 
                        height: '5px', 
                        borderRadius: '50%', 
                        background: type === 'critico' ? '#ff3333' : type === 'medio' ? '#eab308' : '#10b981'
                      }} />
                    )}
                    {type === 'todos' ? 'Mostrar todo' : type}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle de Modo de Coloreado (Casos vs Tasa) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '6px' }}>
              <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '0.72rem', letterSpacing: '1px', color: 'rgba(244,237,226,0.45)', textTransform: 'uppercase' }}>
                Coloreado por:
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setColorMode('cases')}
                  style={{
                    background: colorMode === 'cases' ? '#fff' : 'rgba(255,255,255,0.02)',
                    color: colorMode === 'cases' ? '#000' : '#fff',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '6px',
                    fontSize: '0.62rem',
                    fontFamily: 'Barlow Condensed',
                    fontWeight: 'bold',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Casos Absolutos
                </button>
                <button
                  onClick={() => setColorMode('rate')}
                  style={{
                    background: colorMode === 'rate' ? '#fff' : 'rgba(255,255,255,0.02)',
                    color: colorMode === 'rate' ? '#000' : '#fff',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '6px',
                    fontSize: '0.62rem',
                    fontFamily: 'Barlow Condensed',
                    fontWeight: 'bold',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Tasa por 100k
                </button>
              </div>
            </div>
          </div>

          <svg 
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`} 
            style={{ 
              width: '95%', 
              height: 'auto', 
              maxHeight: isMobile ? '42vh' : 'calc(100vh - 240px)',
              background: 'rgba(255, 255, 255, 0.01)', 
              borderRadius: '24px', 
              padding: '16px', 
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8)',
              display: 'block',
            }}
          >
            <defs>
              <pattern id="dotGridMap" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="rgba(255, 255, 255, 0.03)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotGridMap)" rx="16" />

            {/* REAL PROVINCES GEOMETRY (CHOROPLETH MAP) */}
            <g id="provinces-layer">
              {mapData && mapData.features.map(f => {
                const hcKey = f.properties['hc-key'];
                const stats = PROVINCE_STATS[hcKey] || { name: f.properties.name || '', rate: 0, cases: 0, isLitoral: false };
                const provName = stats.name;
                
                const isHovered = hoveredProv === provName;
                const isSelected = selectedType === 'province' && selectedId === provName;
                const isParentSelected = activeParentProvince === provName;
                
                const isHighlighted = isSelected || isHovered || isParentSelected;

                const baseColor = colorMode === 'cases' ? getColorForCases(stats.cases) : getColorForRate(stats.rate);

                const strokeColor = stats.isLitoral 
                  ? 'rgba(255, 51, 102, 0.85)'
                  : 'rgba(255, 255, 255, 0.35)';

                const severity = getSeverityCategory(stats.cases);
                const matchesFilter = colorFilter === 'todos' || colorFilter === severity;
                const fillOpacity = matchesFilter ? 1.0 : 0.08;
                const strokeOpacity = matchesFilter ? 1.0 : 0.15;

                return (
                  <path
                    key={f.id || hcKey || f.properties.name || Math.random()}
                    d={getSvgPath(f.geometry)}
                    fill={baseColor}
                    fillOpacity={fillOpacity}
                    stroke={isSelected ? '#ffffff' : (isHighlighted ? 'rgba(255, 255, 255, 0.85)' : strokeColor)}
                    strokeWidth={isSelected ? 3.2 : (isHighlighted ? 2.5 : (stats.isLitoral ? 1.6 : 1.1))}
                    strokeOpacity={strokeOpacity}
                    style={{
                      transition: 'all 0.35s ease',
                      cursor: 'pointer',
                      filter: isSelected && matchesFilter
                        ? `brightness(1.45) drop-shadow(0 0 12px ${baseColor})`
                        : (isHighlighted && matchesFilter
                            ? `brightness(1.22) drop-shadow(0 0 6px ${baseColor})`
                            : (stats.isLitoral && matchesFilter ? 'drop-shadow(0 0 4px rgba(255,51,102,0.25))' : 'none'))
                    }}
                    onMouseEnter={() => matchesFilter && setHoveredProv(provName)}
                    onMouseLeave={() => setHoveredProv(null)}
                    onClick={() => {
                      if (matchesFilter) {
                        setSelectedType('province');
                        setSelectedId(provName);
                      }
                    }}
                  />
                );
              })}
            </g>

            {/* INTERACTIVE GEOLOCATED HOTSPOT MARKERS */}
            <g id="hotspots-layer">
              {HOTSPOTS.map((h) => {
                const isActive = selectedType === 'hotspot' && h.id === selectedId;
                const [x, y] = project(h.hc_x, h.hc_y);

                const matchesFilter = colorFilter === 'todos' || colorFilter === h.severity;
                if (!matchesFilter) return null;

                return (
                  <g 
                    key={h.id} 
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedType('hotspot');
                      setSelectedId(h.id);
                    }}
                  >
                    {isActive && (
                      <circle
                        cx={x}
                        cy={y}
                        r={14}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth={2}
                        className="pulse-ring"
                        style={{
                          animation: 'mapPulse 1.8s infinite ease-out'
                        }}
                      />
                    )}

                    <circle
                      cx={x}
                      cy={y}
                      r={isActive ? 9 : 5}
                      fill="#ffffff"
                      fillOpacity={isActive ? 0.45 : 0.28}
                      stroke="#ffffff"
                      strokeWidth={1}
                      strokeOpacity={0.8}
                    />

                    <circle
                      cx={x}
                      cy={y}
                      r={isActive ? 4.5 : 3}
                      fill="#ffffff"
                      style={{ 
                        filter: 'drop-shadow(0 0 6px #ffffff)',
                        transition: 'all 0.25s'
                      }}
                    />

                    <text 
                      x={x + 9} 
                      y={y + 3} 
                      fill={isActive ? '#fff' : 'rgba(244, 237, 226, 0.55)'} 
                      fontFamily="Barlow Condensed, sans-serif" 
                      fontSize={isActive ? (isMobile ? '11px' : '9px') : (isMobile ? '9.5px' : '7.5px')}
                      fontWeight={isActive ? 'bold' : 'normal'}
                      letterSpacing="0.8px"
                      style={{ 
                        textShadow: '0 1px 3px rgba(0,0,0,0.9)',
                        transition: 'all 0.25s' 
                      }}
                    >
                      {h.name}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* LIVE PROVINCE HOVER INFO OVERLAY (DASHBOARD-STYLE TOOLTIP) */}
            {hoveredProv && (
              <g transform={`translate(16, ${HEIGHT - 54})`} style={{ pointerEvents: 'none' }}>
                {(() => {
                  const hcKey = Object.keys(PROVINCE_STATS).find(key => PROVINCE_STATS[key].name === hoveredProv);
                  const stats = PROVINCE_STATS[hcKey];
                  if (!stats) return null;
                  return (
                    <React.Fragment key="tooltip-frag">
                      <rect 
                        width="180" 
                        height="40" 
                        rx="6" 
                        fill="rgba(7, 7, 10, 0.92)" 
                        stroke="rgba(255, 255, 255, 0.15)" 
                        strokeWidth="1"
                      />
                      <text x="12" y="16" fill="#fff" fontFamily="Barlow Condensed" fontSize="11" letterSpacing="1" fontWeight="bold">
                        {hoveredProv.toUpperCase()}
                      </text>
                      <text x="12" y="30" fill="rgba(244, 237, 226, 0.65)" fontFamily="Inter" fontSize="9">
                        Tasa: {stats.rate.toFixed(1)} | Casos: {stats.cases}
                      </text>
                    </React.Fragment>
                  );
                })()}
              </g>
            )}

            <text x="320" y="380" fill="rgba(255, 255, 255, 0.03)" fontFamily="Bebas Neue" fontSize="24" letterSpacing="6">AMAZONÍA</text>
            <text x="210" y="240" fill="rgba(255, 255, 255, 0.03)" fontFamily="Bebas Neue" fontSize="24" letterSpacing="6" transform="rotate(-78, 210, 240)">SIERRA</text>
            <text x="50" y="290" fill="rgba(255, 51, 102, 0.04)" fontFamily="Bebas Neue" fontSize="24" letterSpacing="6" transform="rotate(-82, 50, 290)">LITORAL</text>
          </svg>
        </div>

      </div>

      <style>{`
        @keyframes mapPulse {
          0% {
            transform: scale(0.6);
            transform-origin: center;
            opacity: 1;
          }
          100% {
            transform: scale(1.6);
            transform-origin: center;
            opacity: 0;
          }
        }
        .pulse-ring {
          transform-box: fill-box;
        }
      `}</style>
    </section>
  );
}
