import React, { useMemo, useEffect, useRef, useState } from "react";
import Chart from "react-apexcharts";
import { animate } from 'animejs';
import SplitType from 'split-type';
import { useResponsiveChartHeight } from '../hooks/useResponsiveChartHeight';

export default function Chapter3({ active }) {
  const ref = React.useRef(null);
  const titleRef = useRef(null);

  const series = [
    { name: "2018", data: [40.07, 18.41, 41.52] },
    { name: "2019", data: [38.31, 19.1, 42.59] },
    { name: "2020 (Shock)", data: [29.48, 24.32, 46.2] },
  ];

  const options = useMemo(
    () => ({
      theme: { mode: "dark" },
      chart: {
        background: "transparent",
        foreColor: "#f3ede2",
        fontFamily: "Inter, sans-serif",
        toolbar: { show: false },
        animations: {
          enabled: true,
          easing: "easeOutQuart",
          speed: 1000,
          animateGradually: {
            enabled: true,
            delay: 130
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        },
        dropShadow: {
          enabled: true,
          blur: 10,
          left: 0,
          top: 0,
          opacity: 0.5,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => val.toFixed(1) + "%",
        offsetY: -6,
        style: {
          fontSize: "11px",
          fontFamily: "Barlow Condensed, sans-serif",
          fontWeight: 700,
          colors: ["#f3ede2"]
        }
      },
      colors: ["#ffcc00", "#ffaa00", "#ff3366"],
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      fill: {
        opacity: 0.9,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 4,
          dataLabels: { position: "top" }
        }
      },
      xaxis: {
        categories: ["Empleo Pleno", "Subempleo", "Empleo Informal"],
        labels: {
          show: true,
          style: {
            colors: ["#ffcc00", "#ffaa00", "#ff3366"],
            fontSize: "14px",
            fontFamily: "Barlow Condensed, sans-serif",
            fontWeight: 700,
          },
          formatter: (val) => val,
        },
      },
      yaxis: {
        show: true,
        min: 0,
        max: 55,
        tickAmount: 5,
        labels: {
          formatter: (val) => val.toFixed(0) + "%",
          style: {
            colors: "rgba(244, 237, 226, 0.35)",
            fontSize: "11px",
            fontFamily: "Barlow Condensed, sans-serif",
          },
        },
      },
      legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "center",
        offsetY: 4,
        itemMargin: { horizontal: 16, vertical: 4 },
        onItemClick: {
          toggleDataSeries: true
        },
        markers: {
          width: 10,
          height: 10,
          radius: 5,
        },
        labels: {
          colors: ["#ffcc00", "#ffaa00", "#ff3366"],
          useSeriesColors: true,
        },
        fontFamily: "Barlow Condensed, sans-serif",
        fontSize: "13px",
      },
      tooltip: {
        theme: "dark",
        style: { fontFamily: "Barlow Condensed, sans-serif", fontSize: "13px" },
        y: { formatter: (val) => val.toFixed(2) + "%" },
      },
    }),
    [],
  );

  const leftRef = useRef(null);
  const stat1Ref = useRef(null);
  const stat2Ref = useRef(null);
  const [showChart, setShowChart] = React.useState(false);
  const [yearFilter, setYearFilter] = useState('todos');
  const chartHeight = useResponsiveChartHeight(350, 280);

  useEffect(() => {
    let anims = [];
    let timeoutId;
    let fallbackTimeoutId;

    if (active && leftRef.current) {
      const handleReveal = (e) => {
        if (e.detail.id === 'p3') {
          setShowChart(true);
          clearTimeout(fallbackTimeoutId);
        }
      };

      window.addEventListener('panel-revealed', handleReveal);

      // Safety net: fallback timeout
      fallbackTimeoutId = setTimeout(() => {
        setShowChart(true);
      }, 600);

      timeoutId = setTimeout(() => {
        const els = Array.from(leftRef.current.children);
        anims.push(animate(els, {
          opacity: [0, 1],
          translateY: [28, 0],
          delay: (_, i) => i * 120,
          duration: 600,
          ease: 'easeOutQuad',
        }));

        const s1 = { val: 0 };
        anims.push(animate(s1, {
          val: 29.48,
          duration: 1300,
          ease: 'easeOutQuad',
          onUpdate: () => { if (stat1Ref.current) stat1Ref.current.textContent = s1.val.toFixed(2) + '%'; },
        }));

        const s2 = { val: 0 };
        anims.push(animate(s2, {
          val: 24.32,
          duration: 1300,
          ease: 'easeOutQuad',
          onUpdate: () => { if (stat2Ref.current) stat2Ref.current.textContent = s2.val.toFixed(2) + '%'; },
        }));
      }, 400);

      return () => {
        window.removeEventListener('panel-revealed', handleReveal);
        clearTimeout(timeoutId);
        clearTimeout(fallbackTimeoutId);
        anims.forEach(a => {
          if (a && typeof a.pause === 'function') a.pause();
        });
      };
    } else if (!active && leftRef.current) {
      setShowChart(false);
      Array.from(leftRef.current.children).forEach(el => {
        el.style.opacity = 0;
      });
      if (stat1Ref.current) stat1Ref.current.textContent = '0%';
      if (stat2Ref.current) stat2Ref.current.textContent = '0%';
    }
  }, [active]);

  useEffect(() => {
    let splitInstance;
    let anim;
    if (active && titleRef.current) {
      splitInstance = new SplitType(titleRef.current, { types: 'chars' });
      const chars = splitInstance.chars;
      if (chars && chars.length > 0) {
        chars.forEach(c => {
          c.style.display = 'inline-block';
          c.style.transformOrigin = 'center bottom';
        });

        anim = animate(chars, {
          opacity: [0, 1],
          translateY: [24, 0],
          scale: [0.75, 1],
          filter: ["blur(12px)", "blur(0px)"],
          delay: (_, i) => i * 45,
          duration: 750,
          ease: "easeOutQuad"
        });
      }
    }
    return () => {
      if (anim && typeof anim.pause === 'function') anim.pause();
      if (splitInstance && typeof splitInstance.revert === 'function') splitInstance.revert();
    };
  }, [active]);

  const filteredSeries = useMemo(() => {
    if (yearFilter === 'todos') return series;
    return series.filter(s => s.name.startsWith(yearFilter));
  }, [yearFilter]);

  return (
    <section
      className={`panel ${active ? "active-shock" : ""}`}
      id="p3"
      ref={ref}
      style={{
        background: active
          ? "radial-gradient(ellipse 75% 80% at 50% 50%, rgba(255, 51, 102, 0.16), transparent), var(--bg)"
          : "var(--bg)",
        transition: "background 0.8s ease",
      }}
    >
      <div className="noise"></div>
      <div className="scan" style={{ top: "38%" }}></div>
      <div
        className="wm"
        style={{
          color: "rgba(255, 51, 102, 0.008)",
          bottom: "-12%",
          right: "-2%",
          fontSize: "50vw",
        }}
      >
        20
      </div>

      <div
        className="psplit"
        style={{ gridTemplateColumns: "0.68fr 1.32fr", gap: "40px" }}
      >
        {/* LEFT: texto */}
        <div className="pleft" ref={leftRef}>
          <span
            className="tag"
            style={{
              color: "var(--red)",
              borderColor: "rgba(255, 51, 102, 0.4)",
            }}
          >
            Capítulo 3 &middot; 2020
          </span>
          <div
            className="hl"
            style={{
              background: "var(--red)",
              boxShadow: "0 0 8px var(--red)",
            }}
          ></div>
          <h2 ref={titleRef} className="ptitle" style={{ color: "#fff" }}>
            EL GRAN
            <br />
            <span
              style={{
                color: "var(--red)",
                textShadow: "0 0 80px var(--red-glow)",
              }}
            >
              SHOCK
            </span>
          </h2>
          <p className="pdesc">
            Llegó el 2020. No fue solo un shock sanitario; fue la demolición del
            mercado laboral formal. El empleo adecuado nacional se desplomó al{" "}
            <strong>29.48%</strong>. La población activa necesitaba comer, por
            lo que el trabajo formal mutó hacia la vulnerabilidad informal: el
            subempleo escaló hasta el <strong>24.32%</strong> a nivel nacional.
          </p>
          <div className="srow">
            <div
              className="scard"
              style={{ borderColor: "rgba(255, 204, 0, 0.25)" }}
            >
              <div className="sn" style={{ color: "var(--gold)" }} ref={stat1Ref}>
                29.48%
              </div>
              <div className="sl">Empleo Adecuado (Caída)</div>
            </div>
            <div
              className="scard"
              style={{ borderColor: "rgba(255, 51, 102, 0.25)" }}
            >
              <div className="sn" style={{ color: "var(--red)" }} ref={stat2Ref}>
                24.32%
              </div>
              <div className="sl">Subempleo (Pico)</div>
            </div>
          </div>
        </div>

        {/* RIGHT: gráfico */}
        <div className="pright" style={{ flexDirection: "column", gap: "0px" }}>
          {/* Título del gráfico */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "4px",
              zIndex: 2,
            }}
          >
            <p
              style={{
                fontFamily: "Barlow Condensed, sans-serif",
                fontSize: "0.68rem",
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: "rgba(244,237,226,0.35)",
                marginBottom: "4px",
              }}
            >
              Estructura del mercado laboral
            </p>
            <p
              style={{
                fontFamily: "Bebas Neue, cursive",
                fontSize: "1.35rem",
                letterSpacing: "3px",
                color: "rgba(244,237,226,0.85)",
              }}
            >
              Comparativa 2018 – 2020
            </p>
          </div>

          {/* Year filter buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '10px', zIndex: 2 }}>
            {['todos', '2018', '2019', '2020'].map(year => (
              <button
                key={year}
                onClick={() => setYearFilter(year)}
                style={{
                  background: yearFilter === year ? '#fff' : 'rgba(255,255,255,0.02)',
                  color: yearFilter === year ? '#000' : '#fff',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '6px',
                  fontSize: '0.62rem',
                  fontFamily: 'Barlow Condensed',
                  fontWeight: 'bold',
                  padding: '4px 10px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s ease'
                }}
              >
                {year === 'todos' ? 'Todos' : year}
              </button>
            ))}
          </div>

          {/* Contenedor del chart con glassmorphism */}
          {showChart && (
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "640px",
                background: "rgba(255,255,255,0.018)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "24px",
                padding: "12px 8px 0px",
                backdropFilter: "blur(12px)",
                boxShadow:
                  "0 0 60px rgba(255,51,102,0.07), inset 0 0 40px rgba(255,255,255,0.01)",
              }}
            >
              {/* Glow accent lines */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "10%",
                  right: "10%",
                  height: "1px",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,51,102,0.4), rgba(255,204,0,0.4), transparent)",
                }}
              />

              <Chart
                key={String(showChart) + yearFilter}
                options={options}
                series={filteredSeries}
                type="bar"
                height={chartHeight}
                width="100%"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
