import React, { useState, useMemo, useEffect, useRef } from "react";
import Chart from "react-apexcharts";
import { animate } from 'animejs';
import { useResponsiveChartHeight } from '../hooks/useResponsiveChartHeight';

// Base de datos de evolución histórica completa del Capítulo 2 (2013 - 2019)
const CHAPTER2_HISTORIC = {
  categories: ["2013", "2014", "2015", "2016", "2017", "2018", "2019"],
  empleo: [45.35, 47.84, 45.53, 40.34, 40.31, 40.07, 38.31],
  homicidios: [1314, 1310, 1050, 959, 970, 996, 1189]
};

export default function Chapter2({ active }) {
  const [showChart, setShowChart] = useState(false);
  const chartHeight = useResponsiveChartHeight(320, 240);
  const leftRef = useRef(null);

  useEffect(() => {
    if (!active) {
      setShowChart(false);
      return;
    }

    let fallbackTimeoutId;

    const handleReveal = (e) => {
      if (e.detail.id === 'p2') {
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
  }, [active]);

  const [showVariation, setShowVariation] = useState(false);

  const calculateVariation = (dataArray) => {
    return dataArray.map((val, idx) => {
      if (idx === 0) return 0;
      const prev = dataArray[idx - 1];
      return parseFloat((((val - prev) / prev) * 100).toFixed(2));
    });
  };

  // Gráfico Mixto: Columnas (Homicidios) + Línea (Empleo Adecuado) con dos ejes Y independientes
  const series = useMemo(() => {
    if (showVariation) {
      return [
        {
          name: "Variación Homicidios (% YoY)",
          type: "column",
          data: calculateVariation(CHAPTER2_HISTORIC.homicidios)
        },
        {
          name: "Variación Empleo Adecuado (% YoY)",
          type: "line",
          data: calculateVariation(CHAPTER2_HISTORIC.empleo)
        }
      ];
    }
    return [
      {
        name: "Homicidios (Casos)",
        type: "column", // Representado como barras verticales para ver volúmenes absolutos
        data: CHAPTER2_HISTORIC.homicidios
      },
      {
        name: "Empleo Adecuado (%)",
        type: "line", // Representado como línea de tendencia para ver su declive
        data: CHAPTER2_HISTORIC.empleo
      }
    ];
  }, [showVariation]);

  const options = useMemo(() => {
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
        width: [0, 4], // Sin línea en las barras, 4px de grosor en la curva de empleo
        curve: "smooth"
      },
      plotOptions: {
        bar: {
          columnWidth: "40%",
          borderRadius: 6
        }
      },
      colors: ["#ff3366", "#3399ff"], // Homicidios en rojo, Empleo en azul
      grid: {
        borderColor: "rgba(255,255,255,0.04)"
      },
      legend: {
        show: true,
        position: "top",
        horizontalAlign: "center",
        labels: {
          colors: ["#ff3366", "#3399ff"],
          useSeriesColors: true
        },
        fontFamily: "Barlow Condensed, Inter, sans-serif",
        fontSize: "13px",
        markers: { radius: 12 }
      },
      xaxis: {
        categories: CHAPTER2_HISTORIC.categories,
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
            text: showVariation ? "Variación Homicidios (% YoY)" : "Homicidios (Casos)",
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
            formatter: (val) => showVariation ? val.toFixed(1) + "%" : Math.round(val).toLocaleString("es")
          }
        },
        {
          opposite: true,
          title: {
            text: showVariation ? "Variación Empleo Adecuado (% YoY)" : "Empleo Adecuado (%)",
            style: {
              color: "#3399ff",
              fontFamily: "Barlow Condensed, sans-serif"
            }
          },
          labels: {
            style: {
              colors: "#3399ff",
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
        x: { show: true }
      }
    };
  }, [showVariation]);

  return (
    <section className="panel" id="p2">
      <div className="noise"></div>
      <div className="wm">19</div>

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
              color: "var(--blue)",
              borderColor: "rgba(51, 153, 255, 0.3)",
            }}
          >
            Capítulo 2 &middot; 2017 &ndash; 2019
          </span>
          <div
            className="hl"
            style={{
              background: "var(--blue)",
              boxShadow: "0 0 8px var(--blue)",
            }}
          ></div>
          <h2 className="ptitle" style={{ color: "var(--blue)", fontSize: "clamp(2.4rem, 4.8vw, 5.5rem)", lineHeight: 0.9, marginBottom: "14px" }}>
            GRIETAS
            <br />
            SILENCIOSAS
          </h2>
          <p className="pdesc">
            La paz social es frágil. A partir de 2017, la economía formal comenzó a contraerse lentamente. Al interactuar con el gráfico mixto de la derecha, puedes observar cómo el volumen absoluto de homicidios aumenta en forma de columnas verticales a medida que la curva de empleo pleno desciende.
          </p>
          <div className="srow">
            <div
              className="scard"
              style={{ borderColor: "rgba(51, 153, 255, 0.15)", width: "100%" }}
            >
              <div style={{ fontFamily: "Barlow Condensed", fontSize: "0.7rem", letterSpacing: "1px", color: "rgba(244,237,226,0.45)", textTransform: "uppercase" }}>
                Datos Consolidados del Capítulo:
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                <div>
                  <div className="sn" style={{ color: "var(--blue)", fontSize: "1.6rem" }}>
                    38.31%
                  </div>
                  <div className="sl" style={{ fontSize: "10px" }}>Empleo Mínimo (2019)</div>
                </div>
                <div>
                  <div className="sn" style={{ color: "var(--red)", fontSize: "1.6rem" }}>
                    1,189
                  </div>
                  <div className="sl" style={{ fontSize: "10px" }}>Homicidios Máx. (2019)</div>
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
                "0 0 60px rgba(51,153,255,0.06), inset 0 0 40px rgba(255,255,255,0.01)",
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
                  "linear-gradient(90deg, transparent, rgba(51,153,255,0.4), rgba(255,51,102,0.4), transparent)",
              }}
            />
            {/* Título del gráfico descriptivo */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
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
                  Relación Empleo vs. Homicidios
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
                  Evolución Histórica · Columnas + Tendencia
                </div>
              </div>

              {/* Botón de alternancia (Toggle) */}
              <button
                onClick={() => setShowVariation(!showVariation)}
                style={{
                  background: "rgba(7, 7, 10, 0.9)",
                  border: "1px solid rgba(51, 153, 255, 0.4)",
                  color: "#fff",
                  fontFamily: "Barlow Condensed, sans-serif",
                  fontWeight: "bold",
                  fontSize: "0.8rem",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  outline: "none",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(51, 153, 255, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(7, 7, 10, 0.9)";
                }}
              >
                {showVariation ? "Ver Valores Absolutos" : "Ver Variación % YoY"}
              </button>
            </div>

            {/* Chart */}
            {showChart && (
              <Chart
                key={String(showChart)}
                options={options}
                series={series}
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
