import React, { useState, useEffect, useMemo, useRef } from "react";
import Chart from "react-apexcharts";
import { animate } from 'animejs';
import { useResponsiveChartHeight } from '../hooks/useResponsiveChartHeight';

// Base de datos de los años del Capítulo 1 (2007 - 2016)
const YEAR_DATA = {
  "2007": { empleo: 43.2, homicidios: 2301 },
  "2008": { empleo: 43.26, homicidios: 2479 },
  "2009": { empleo: 39.18, homicidios: 2187 },
  "2010": { empleo: 42.97, homicidios: 2330 },
  "2011": { empleo: 44.05, homicidios: 2106 },
  "2012": { empleo: 45.86, homicidios: 1706 },
  "2013": { empleo: 45.35, homicidios: 1314 },
  "2014": { empleo: 47.84, homicidios: 1310 },
  "2015": { empleo: 45.53, homicidios: 1050 },
  "2016": { empleo: 40.34, homicidios: 959 }
};

export default function Chapter1({ active }) {
  const [selectedYear, setSelectedYear] = useState("2014");
  const [showChart, setShowChart] = useState(false);
  const chartHeight = useResponsiveChartHeight(320, 240);
  const data = YEAR_DATA[selectedYear];

  const leftRef = useRef(null);

  // Estados para animación de recuento numérico
  const [displayEmpleo, setDisplayEmpleo] = useState(data.empleo);
  const [displayHomicidios, setDisplayHomicidios] = useState(data.homicidios);

  const prevEmpleoRef = useRef(data.empleo);
  const prevHomicidiosRef = useRef(data.homicidios);

  useEffect(() => {
    const targets = {
      empleo: prevEmpleoRef.current,
      homicidios: prevHomicidiosRef.current
    };

    const anim = animate(targets, {
      empleo: data.empleo,
      homicidios: data.homicidios,
      duration: 650,
      ease: "easeOutQuad",
      onUpdate: () => {
        setDisplayEmpleo(parseFloat(targets.empleo.toFixed(2)));
        setDisplayHomicidios(Math.round(targets.homicidios));
      },
      onComplete: () => {
        prevEmpleoRef.current = data.empleo;
        prevHomicidiosRef.current = data.homicidios;
      }
    });

    return () => {
      if (anim && typeof anim.pause === 'function') anim.pause();
    };
  }, [selectedYear, data]);

  useEffect(() => {
    if (!active) {
      setShowChart(false);
      return;
    }

    let fallbackTimeoutId;

    const handleReveal = (e) => {
      if (e.detail.id === 'p1') {
        setShowChart(true);
        clearTimeout(fallbackTimeoutId);
      }
    };

    window.addEventListener('panel-revealed', handleReveal);

    // Safety net: fallback timeout in case the event doesn't fire (e.g., direct navigation via dots)
    fallbackTimeoutId = setTimeout(() => {
      setShowChart(true);
    }, 600);

    return () => {
      window.removeEventListener('panel-revealed', handleReveal);
      clearTimeout(fallbackTimeoutId);
    };
  }, [active]);

  // Animación del panel izquierdo al cargar
  useEffect(() => {
    let anims = [];
    if (active && leftRef.current) {
      const els = Array.from(leftRef.current.children);
      anims.push(animate(els, {
        opacity: [0, 1],
        translateY: [28, 0],
        delay: (_, i) => i * 120,
        duration: 600,
        ease: 'easeOutQuad',
      }));
    } else if (!active && leftRef.current) {
      Array.from(leftRef.current.children).forEach(el => {
        el.style.opacity = 0;
      });
    }
    return () => {
      anims.forEach(a => { if (a && typeof a.pause === 'function') a.pause(); });
    };
  }, [active, selectedYear]);

  // Series del gráfico mixto: Homicidios (Columna) + Empleo Adecuado (Línea)
  // SYNC NOTE: El resaltado de este año en el gráfico está sincronizado con la tarjeta de contexto "Contexto del Año" del panel izquierdo (pleft), permitiendo que la interacción del selector de año actúe de manera unificada en todo el componente.
  const series = useMemo(() => {
    const years = Object.keys(YEAR_DATA);
    return [
      {
        name: "Homicidios (Casos)",
        type: "column",
        data: years.map(yr => ({
          x: yr,
          y: YEAR_DATA[yr].homicidios,
          fillColor: yr === selectedYear ? "#ff3366" : "rgba(255, 51, 102, 0.55)"
        }))
      },
      {
        name: "Empleo Adecuado (%)",
        type: "line",
        data: years.map(yr => ({
          x: yr,
          y: YEAR_DATA[yr].empleo
        }))
      }
    ];
  }, [selectedYear]);

  const options = useMemo(() => {
    const yearsArray = Object.keys(YEAR_DATA);
    const selectedIndex = yearsArray.indexOf(selectedYear);

    return {
      theme: { mode: "dark" },
      chart: {
        background: "transparent",
        foreColor: "#f3ede2",
        fontFamily: "Barlow Condensed, Inter, sans-serif",
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
        }
      },
      stroke: {
        width: [0, 4], // Sin borde para columnas, 4px de grosor para la línea de empleo
        curve: "smooth"
      },
      plotOptions: {
        bar: {
          columnWidth: "45%",
          borderRadius: 6
        }
      },
      colors: ["#ff3366", "#00f5cc"], // Rojo para Homicidios, Teal para Empleo
      grid: {
        borderColor: "rgba(255,255,255,0.04)",
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } }
      },
      legend: {
        show: true,
        position: "top",
        horizontalAlign: "center",
        labels: {
          colors: ["#ff3366", "#00f5cc"],
          useSeriesColors: true
        },
        fontFamily: "Barlow Condensed, Inter, sans-serif",
        fontSize: "13px",
        markers: { radius: 12 }
      },
      markers: {
        size: 4,
        discrete: selectedIndex !== -1 ? [
          {
            seriesIndex: 1,
            dataPointIndex: selectedIndex,
            fillColor: "#00f5cc",
            strokeColor: "#fff",
            size: 8,
            shape: "circle"
          }
        ] : []
      },
      annotations: {
        xaxis: [
          {
            x: selectedYear,
            borderColor: "rgba(255, 255, 255, 0.6)",
            borderWidth: 2,
            strokeDashArray: 4,
            label: {
              style: {
                color: "#000",
                background: "#00f5cc",
                fontFamily: "Barlow Condensed, sans-serif",
                fontWeight: "bold"
              },
              text: `${selectedYear} — ${data.empleo}% empleo / ${data.homicidios.toLocaleString("es")} homicidios`
            }
          }
        ]
      },
      xaxis: {
        categories: Object.keys(YEAR_DATA),
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: {
            fontFamily: "Barlow Condensed, sans-serif",
            fontSize: "13px"
          }
        }
      },
      yaxis: [
        {
          title: {
            text: "Homicidios (Casos)",
            style: {
              color: "#ff3366",
              fontFamily: "Barlow Condensed, sans-serif"
            }
          },
          labels: {
            style: {
              colors: "#ff3366",
              fontFamily: "Barlow Condensed, sans-serif"
            },
            formatter: (val) => Math.round(val).toLocaleString("es")
          }
        },
        {
          opposite: true,
          title: {
            text: "Empleo Adecuado (%)",
            style: {
              color: "#00f5cc",
              fontFamily: "Barlow Condensed, sans-serif"
            }
          },
          labels: {
            style: {
              colors: "#00f5cc",
              fontFamily: "Barlow Condensed, sans-serif"
            },
            formatter: (val) => val.toFixed(1) + "%"
          }
        }
      ],
      tooltip: {
        theme: "dark",
        shared: true,
        intersect: false,
        y: {
          formatter: function (val, opt) {
            if (opt.seriesIndex === 0) return val + " casos";
            if (opt.seriesIndex === 1) return val.toFixed(2) + "%";
            return val;
          }
        }
      }
    };
  }, [selectedYear, data]);

  return (
    <section className="panel" id="p1">
      <div className="noise"></div>
      <div className="wm">07</div>

      <div
        className="psplit"
        style={{
          gridTemplateColumns: "0.72fr 1.28fr",
          gap: "40px",
        }}
      >
        <div className="pleft" ref={leftRef}>
          <span
            className="tag"
            style={{
              color: "var(--teal)",
              borderColor: "rgba(0, 245, 204, 0.3)",
            }}
          >
            Capítulo 1 &middot; 2007 &ndash; 2016
          </span>
          <div
            className="hl"
            style={{
              background: "var(--teal)",
              boxShadow: "0 0 8px var(--teal)",
            }}
          ></div>
          <h2 className="ptitle" style={{ color: "var(--teal)", fontSize: "clamp(2.5rem, 5.2vw, 5.8rem)", marginBottom: "8px", lineHeight: 0.9 }}>
            EL ESCUDO
            <br />
            SOCIAL
          </h2>
          <p className="pdesc" style={{ marginBottom: "12px", fontSize: "0.80rem", lineHeight: 1.6 }}>
            Entre 2007 y 2016, Ecuador atravesó un proceso progresivo de fortalecimiento del mercado laboral. El empleo adecuado no partió de un punto óptimo: en 2007 se ubicaba en 43.2%, con niveles de homicidios aún altos (2,301 casos). A medida que el indicador de empleo mejoró hacia mediados de la década, los homicidios mostraron una tendencia descendente sostenida. Usa el selector de año para explorar esta evolución punto por punto.
          </p>
          <div className="srow" style={{ marginTop: "4px" }}>
            <div
              className="scard"
              style={{ borderColor: "rgba(0, 245, 204, 0.15)", width: "100%", padding: "10px 16px" }}
            >
              <div style={{ fontFamily: "Barlow Condensed", fontSize: "0.68rem", letterSpacing: "1px", color: "rgba(244,237,226,0.45)", textTransform: "uppercase" }}>
                Contexto del Año {selectedYear}:
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                <div>
                  <div className="sn" style={{ color: "var(--teal)", fontSize: "1.45rem", lineHeight: 1.1 }}>
                    {displayEmpleo}%
                  </div>
                  <div className="sl" style={{ fontSize: "9px", marginTop: "2px" }}>Empleo Pleno</div>
                </div>
                <div>
                  <div className="sn" style={{ color: "var(--red)", fontSize: "1.45rem", lineHeight: 1.1 }}>
                    {displayHomicidios.toLocaleString("es")}
                  </div>
                  <div className="sl" style={{ fontSize: "9px", marginTop: "2px" }}>Casos Homicidio</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="pright"
          style={{
            alignItems: "center",
            width: "100%",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          {/* Glassmorphism container */}
          <div
            style={{
              position: "relative",
              width: "100%",
              minWidth: 0,
              height: "auto",
              background: "rgba(255,255,255,0.018)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "24px",
              padding: "20px 20px 12px",
              backdropFilter: "blur(12px)",
              boxShadow:
                "0 0 60px rgba(0,245,204,0.06), inset 0 0 40px rgba(255,255,255,0.01)",
            }}
          >
            {/* Línea de acento superior */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "8%",
                right: "8%",
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(0,245,204,0.45), rgba(255,51,102,0.35), transparent)",
              }}
            />
            {/* Título del gráfico con selector integrado */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
                paddingLeft: "4px",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "Barlow Condensed, Inter, sans-serif",
                    fontSize: "15px",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    color: "rgba(244,237,226,0.85)",
                    textTransform: "uppercase",
                  }}
                >
                  Empleo Adecuado vs. Homicidios
                </div>
                <div
                  style={{
                    fontFamily: "Barlow Condensed, Inter, sans-serif",
                    fontSize: "11px",
                    fontWeight: 400,
                    letterSpacing: "0.06em",
                    color: "rgba(244,237,226,0.45)",
                    marginTop: "2px",
                  }}
                >
                  Capítulo 1 &middot; Ecuador
                </div>
              </div>

              {/* Selector de años embebido */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: "0.8rem", letterSpacing: "1px", color: "rgba(244,237,226,0.5)" }}>AÑO:</span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  style={{
                    background: "rgba(7, 7, 10, 0.9)",
                    border: "1px solid rgba(0, 245, 204, 0.4)",
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
                  {Object.keys(YEAR_DATA).map(yr => (
                    <option key={yr} value={yr} style={{ background: "#0a0a0f", color: "#fff" }}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Chart */}
            {showChart && (
              <Chart
                key={selectedYear}
                options={options}
                series={series}
                type="line"
                height={chartHeight}
                width="100%"
              />
            )}

            {/* Fuente de datos */}
            <div
              style={{
                textAlign: "right",
                fontFamily: "Barlow Condensed, Inter, sans-serif",
                fontSize: "10px",
                letterSpacing: "0.04em",
                color: "rgba(244,237,226,0.35)",
                marginTop: "4px",
                paddingRight: "4px",
              }}
            >
              Fuente: INEC / Ministerio del Interior
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
