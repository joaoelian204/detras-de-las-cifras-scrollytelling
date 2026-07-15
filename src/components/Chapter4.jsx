import React, { useState, useMemo, useEffect, useRef } from "react";
import Chart from "react-apexcharts";
import { animate } from 'animejs';
import SplitType from 'split-type';
import { useResponsiveChartHeight } from '../hooks/useResponsiveChartHeight';

export default function Chapter4({ active }) {
  const [viewMode, setViewMode] = useState("both"); // 'both' | 'cases' | 'rate'
  const titleRef = useRef(null);

  // Data from Primicias 2025 Article & OECO adjustments
  const series = useMemo(() => {
    const allSeries = [
      {
        name: "Homicidios Intencionales (Casos)",
        type: "column",
        data: [1372, 2495, 4886, 8248, 7033, 9216],
      },
      {
        name: "Tasa por 100k Habitantes",
        type: "line",
        data: [7.7, 13.9, 27.0, 45.4, 38.6, 50.91],
      },
    ];
    if (viewMode === "cases") return [allSeries[0]];
    if (viewMode === "rate") return [allSeries[1]];
    return allSeries;
  }, [viewMode]);

  const options = useMemo(() => {
    const baseColors = ["#e13d3d", "rgba(220,220,255,0.88)"];
    const baseStroke = [0, 4];
    const baseFill = ["solid", "solid"];

    let colors = baseColors;
    let strokeWidth = baseStroke;
    let fillType = baseFill;

    if (viewMode === "cases") {
      colors = ["#e13d3d"];
      strokeWidth = [0];
      fillType = ["solid"];
    } else if (viewMode === "rate") {
      colors = ["rgba(220,220,255,0.88)"];
      strokeWidth = [4];
      fillType = ["solid"];
    }

    const yaxisCases = {
      title: {
        text: "Número de Homicidios",
        style: {
          color: "#e13d3d",
          fontFamily: "Barlow Condensed, sans-serif",
          fontSize: "13px",
          letterSpacing: "2px",
        },
      },
      labels: {
        style: { colors: "#e13d3d" },
        formatter: (val) => Math.round(val).toLocaleString("es"),
      },
    };

    const yaxisRate = {
      opposite: viewMode === "both",
      title: {
        text: "Tasa por 100.000 Habitantes",
        style: {
          color: "rgba(220,220,255,0.88)",
          fontFamily: "Barlow Condensed, sans-serif",
          fontSize: "13px",
          letterSpacing: "2px",
        },
      },
      labels: {
        style: { colors: "rgba(220,220,255,0.88)" },
        formatter: (val) => parseFloat(val).toFixed(1),
      },
    };

    let yaxis = [yaxisCases, yaxisRate];
    if (viewMode === "cases") yaxis = [yaxisCases];
    if (viewMode === "rate") yaxis = [yaxisRate];

    return {
      theme: { mode: "dark" },
      chart: {
        background: "transparent",
        foreColor: "#f3ede2",
        fontFamily: "Inter, sans-serif",
        toolbar: { show: false },
        animations: {
          enabled: true,
          easing: 'easeOutQuart',
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
          enabledOnSeries: viewMode === "both" ? [1] : (viewMode === "rate" ? [0] : []),
          top: 0,
          left: 0,
          blur: 10,
          opacity: 0.65,
        },
      },
      grid: { borderColor: "rgba(255,255,255,0.04)" },
      colors,
      stroke: { width: strokeWidth, curve: "smooth" },
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: "45%",
        },
      },
      fill: {
        type: fillType,
      },
      labels: ["2020", "2021", "2022", "2023", "2024", "2025"],
      legend: {
        show: true,
        position: "top",
        horizontalAlign: "right",
        labels: { useSeriesColors: true },
        fontFamily: "Barlow Condensed, sans-serif",
        fontSize: "13px",
      },
      xaxis: {
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: {
            fontFamily: "Barlow Condensed, sans-serif",
            fontSize: "14px",
            letterSpacing: "2px",
          },
        },
      },
      yaxis,
      tooltip: {
        theme: "dark",
        shared: true,
        intersect: false,
        x: { show: true },
      },
    };
  }, [viewMode]);

  const leftRef = useRef(null);
  const stat1Ref = useRef(null);
  const stat2Ref = useRef(null);
  const [showChart, setShowChart] = React.useState(false);
  const chartHeight = useResponsiveChartHeight(330, 240);

  useEffect(() => {
    let anims = [];
    let timeoutId;
    let fallbackTimeoutId;

    if (active && leftRef.current) {
      const handleReveal = (e) => {
        if (e.detail.id === 'p4') {
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
          val: 9216,
          duration: 1300,
          ease: 'easeOutQuad',
          onUpdate: () => { if (stat1Ref.current) stat1Ref.current.textContent = Math.round(s1.val).toLocaleString('es'); },
        }));

        const s2 = { val: 0 };
        anims.push(animate(s2, {
          val: 50.91,
          duration: 1300,
          ease: 'easeOutQuad',
          onUpdate: () => { if (stat2Ref.current) stat2Ref.current.textContent = s2.val.toFixed(2); },
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
      if (stat1Ref.current) stat1Ref.current.textContent = '0';
      if (stat2Ref.current) stat2Ref.current.textContent = '0';
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
          delay: (_, i) => i * 40,
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

  return (
    <section className="panel" id="p4">
      <div className="noise"></div>
      <div className="wm" style={{ color: "rgba(225, 61, 61, 0.012)" }}>
        25
      </div>

      <div className="psplit" style={{ gridTemplateColumns: "0.9fr 1.1fr" }}>
        <div className="pleft" ref={leftRef}>
          <span
            className="tag"
            style={{
              color: "var(--red)",
              borderColor: "rgba(225, 61, 61, 0.4)",
            }}
          >
            Capítulo 4 &middot; La Espiral
          </span>
          <div
            className="hl"
            style={{
              background: "var(--red)",
              boxShadow: "0 0 8px var(--red)",
            }}
          ></div>
          <h2
            ref={titleRef}
            className="ptitle"
            style={{ color: "#fff", fontSize: "clamp(2.5rem, 5.2vw, 6.2rem)" }}
          >
            EL AÑO MÁS
            <br />
            <span
              style={{
                color: "var(--red)",
                textShadow: "0 0 50px var(--red-glow)",
              }}
            >
              VIOLENTO
            </span>
          </h2>
          <p className="pdesc" style={{ fontSize: "0.85rem", lineHeight: 1.8 }}>
            En 2025, Ecuador rompió todos sus registros históricos de violencia.
            El país cerró con <strong>9,216 homicidios intencionales</strong>.
            Con una población proyectada por el INEC de 18.1 millones, la tasa
            de muertes violentas se ubicó en un crítico{" "}
            <strong>50.91 por cada 100,000 habitantes</strong>. La curva superó
            el pico de 2023 tras un breve respiro militar en 2024.
          </p>
          <div className="srow">
            <div
              className="scard"
              style={{ borderColor: "rgba(225, 61, 61, 0.2)" }}
            >
              <div className="sn" style={{ color: "var(--red)" }} ref={stat1Ref}>
                9,216
              </div>
              <div className="sl">Muertes en 2025</div>
            </div>
            <div
              className="scard"
              style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
            >
              <div className="sn" style={{ color: "#fff" }} ref={stat2Ref}>
                50.91
              </div>
              <div className="sl">Tasa nacional por 100k</div>
            </div>
          </div>
        </div>

        <div className="pright">
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "640px",
              background: "rgba(255,255,255,0.018)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "24px",
              padding: "20px 16px 8px",
              backdropFilter: "blur(12px)",
              boxShadow:
                "0 0 60px rgba(225,61,61,0.08), inset 0 0 40px rgba(255,255,255,0.01)",
            }}
          >
            {/* Línea de acento superior */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "10%",
                right: "10%",
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(225,61,61,0.5), rgba(255,204,0,0.3), transparent)",
              }}
            />

            {/* Cabecera del gráfico con selector de vista */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div>
                <p
                  style={{
                    fontFamily: "Barlow Condensed, sans-serif",
                    fontSize: "0.68rem",
                    letterSpacing: "4px",
                    textTransform: "uppercase",
                    color: "rgba(244,237,226,0.35)",
                    marginBottom: "4px",
                    marginTop: 0,
                  }}
                >
                  Homicidios Intencionales &middot; Ecuador
                </p>
                <p
                  style={{
                    fontFamily: "Bebas Neue, cursive",
                    fontSize: "1.35rem",
                    letterSpacing: "3px",
                    color: "rgba(244,237,226,0.85)",
                    marginBottom: 0,
                    marginTop: 0,
                  }}
                >
                  Evolución 2020 – 2025
                </p>
              </div>

              {/* Selector de modo de vista */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: "0.8rem", letterSpacing: "1px", color: "rgba(244,237,226,0.5)" }}>VISTA:</span>
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value)}
                  style={{
                    background: "rgba(7, 7, 10, 0.9)",
                    border: "1px solid rgba(225, 61, 61, 0.4)",
                    color: "#fff",
                    fontFamily: "Barlow Condensed, sans-serif",
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    outline: "none"
                  }}
                >
                  <option value="both" style={{ background: "#0a0a0f", color: "#fff" }}>Ver Ambos</option>
                  <option value="cases" style={{ background: "#0a0a0f", color: "#fff" }}>Solo Casos</option>
                  <option value="rate" style={{ background: "#0a0a0f", color: "#fff" }}>Solo Tasa</option>
                </select>
              </div>
            </div>

            {showChart && (
              <Chart
                key={String(showChart)}
                options={options}
                series={series}
                type="line"
                height={chartHeight}
              />
            )}

            <p
              style={{
                fontSize: "0.62rem",
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: "rgba(244, 237, 226, 0.35)",
                marginTop: "8px",
                textAlign: "right",
              }}
            >
              Fuente: Ministerio del Interior &amp; INEC
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
