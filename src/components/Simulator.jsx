import React, { useState, useMemo, useEffect, useRef } from "react";
import Chart from "react-apexcharts";
import { animate } from "animejs";
import { useResponsiveChartHeight } from '../hooks/useResponsiveChartHeight';

// NOTA METODOLÓGICA DE SERIE: La serie de deserción educativa (abandono escolar) reporta el ciclo escolar finalizado en el respectivo año calendario. Por ejemplo, el año lectivo 2019-2020 se alinea bajo 2020 (75.3), 2020-2021 bajo 2021 (90.0, cifra confirmada por reportes del MinEdu), y el ciclo 2021-2022 bajo 2022 (84.4, cifra estimada por interpolación). Los ciclos 2022-2023 y 2023-2024 se alinean con 2023 (78.7) y 2024 (72.6) respectivamente. Para 2025, se utiliza la cifra de 70.0k como dato preliminar del ciclo 2024-2025.
// Datos de comparación por variables cruzadas y por años
const COMPARE_YEARS_DATA = {
  "2020": {
    year: "2020",
    homicidios: 1372,
    informalidad: 41.2,
    desercion: 75.3,
    color: "#ffaa00"
  },
  "2021": {
    year: "2021",
    homicidios: 2495,
    informalidad: 42.5,
    desercion: 90.0,
    color: "#ff8800"
  },
  "2022": {
    year: "2022",
    homicidios: 4886,
    informalidad: 46.2,
    desercion: 84.4,
    color: "#ff5500"
  },
  "2023": {
    year: "2023",
    homicidios: 8248,
    informalidad: 50.1,
    desercion: 78.7,
    color: "#ff2233"
  },
  "2024": {
    year: "2024",
    homicidios: 7033,
    informalidad: 52.8,
    desercion: 72.6,
    color: "#e11d48"
  },
  "2025": {
    year: "2025",
    homicidios: 9216,
    informalidad: 53.4,
    desercion: 70.0,
    color: "#7f1d1d"
  }
};

const maxHomicidios = Math.max(...Object.values(COMPARE_YEARS_DATA).map(d => d.homicidios));
const maxInformalidad = Math.max(...Object.values(COMPARE_YEARS_DATA).map(d => d.informalidad));
const maxDesercion = Math.max(...Object.values(COMPARE_YEARS_DATA).map(d => d.desercion));

export default function Simulator({ active }) {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [showChart, setShowChart] = useState(false);
  const chartHeight = useResponsiveChartHeight(320, 260);
  const [showNormalized, setShowNormalized] = useState(true);
  const data = COMPARE_YEARS_DATA[selectedYear];

  const leftRef = useRef(null);

  // Estados para animación de recuento numérico
  const [displayHomicidios, setDisplayHomicidios] = useState(data.homicidios);
  const [displayInformalidad, setDisplayInformalidad] = useState(data.informalidad);
  const [displayDesercion, setDisplayDesercion] = useState(data.desercion);

  const prevHomicidiosRef = useRef(data.homicidios);
  const prevInformalidadRef = useRef(data.informalidad);
  const prevDesercionRef = useRef(data.desercion);

  useEffect(() => {
    const targets = {
      homicidios: prevHomicidiosRef.current,
      informalidad: prevInformalidadRef.current,
      desercion: prevDesercionRef.current
    };

    const anim = animate(targets, {
      homicidios: data.homicidios,
      informalidad: data.informalidad,
      desercion: data.desercion,
      duration: 650,
      ease: "easeOutQuad",
      onUpdate: () => {
        setDisplayHomicidios(Math.round(targets.homicidios));
        setDisplayInformalidad(parseFloat(targets.informalidad.toFixed(1)));
        setDisplayDesercion(parseFloat(targets.desercion.toFixed(1)));
      },
      onComplete: () => {
        prevHomicidiosRef.current = data.homicidios;
        prevInformalidadRef.current = data.informalidad;
        prevDesercionRef.current = data.desercion;
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
      if (e.detail.id === 'p5') {
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

  useEffect(() => {
    let anims = [];
    if (active && leftRef.current) {
      const els = Array.from(leftRef.current.children);
      anims.push(animate(els, {
        opacity: [0, 1],
        translateY: [20, 0],
        delay: (_, i) => i * 100,
        duration: 500,
        ease: "easeOutQuad"
      }));
    }
    return () => {
      anims.forEach(a => { if (a && typeof a.pause === 'function') a.pause(); });
    };
  }, [active, selectedYear]);

  // Series del gráfico de barras horizontales (normalizada vs valores reales)
  const series = useMemo(() => {
    if (showNormalized) {
      const idxHomicidios = (data.homicidios / maxHomicidios) * 100;
      const idxInformalidad = (data.informalidad / maxInformalidad) * 100;
      const idxDesercion = (data.desercion / maxDesercion) * 100;
      return [
        {
          name: "Homicidios (% del pico)",
          data: [parseFloat(idxHomicidios.toFixed(1)), null, null]
        },
        {
          name: "Informalidad Laboral (% del pico)",
          data: [null, parseFloat(idxInformalidad.toFixed(1)), null]
        },
        {
          name: "Deserción Educativa (% del pico)",
          data: [null, null, parseFloat(idxDesercion.toFixed(1))]
        }
      ];
    }

    return [
      {
        name: "Homicidios (Casos)",
        data: [data.homicidios, null, null]
      },
      {
        name: "Informalidad Laboral (%)",
        data: [null, data.informalidad, null]
      },
      {
        name: "Deserción Educativa (Miles)",
        data: [null, null, data.desercion]
      }
    ];
  }, [selectedYear, data, showNormalized]);

  const options = useMemo(() => {
    return {
      theme: { mode: "dark" },
      chart: {
        background: "transparent",
        foreColor: "#f3ede2",
        fontFamily: "Inter, sans-serif",
        toolbar: { show: false },
        stacked: true, // Apilado para que compartan la posición
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
        }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: "50%",
          borderRadius: 8,
          dataLabels: {
            position: "right"
          }
        }
      },
      colors: ["#ff3366", "#a855f7", "#3399ff"],
      grid: {
        borderColor: "rgba(255,255,255,0.04)",
        xaxis: { lines: { show: true } }
      },
      stroke: { width: 0 },
      legend: {
        show: true,
        position: "top",
        horizontalAlign: "center",
        labels: {
          colors: ["#ff3366", "#a855f7", "#3399ff"],
          useSeriesColors: true
        },
        fontFamily: "Barlow Condensed, sans-serif",
        fontSize: "13px",
      },
      dataLabels: {
        enabled: true,
        textAnchor: "start",
        offsetX: 12,
        style: {
          fontSize: "12px",
          fontFamily: "Barlow Condensed, sans-serif",
          colors: ["#fff"]
        },
        formatter: function (val, opt) {
          if (val === null || val <= 0) return "";
          const isPrelim = (opt.seriesIndex === 2 && selectedYear === "2025") ? " (preliminar)" : "";
          const isEst = (opt.seriesIndex === 2 && selectedYear === "2022") ? " (estimado)" : "";
          const suffix = isPrelim + isEst;
          if (showNormalized) {
            if (opt.seriesIndex === 0) return val.toFixed(1) + "% (" + data.homicidios.toLocaleString("es") + " Casos)";
            if (opt.seriesIndex === 1) return val.toFixed(1) + "% (" + data.informalidad + "% PEA)";
            if (opt.seriesIndex === 2) return val.toFixed(1) + "% (" + data.desercion + " mil" + suffix + ")";
          } else {
            if (opt.seriesIndex === 0) return data.homicidios.toLocaleString("es") + " Casos";
            if (opt.seriesIndex === 1) return data.informalidad + "% PEA";
            if (opt.seriesIndex === 2) return data.desercion + " mil" + suffix;
          }
          return "";
        }
      },
      xaxis: {
        categories: [
          "Homicidios",
          "Informalidad Laboral",
          "Deserción Educativa"
        ],
        axisBorder: { show: false },
        axisTicks: { show: false },
        max: showNormalized ? 120 : undefined,
        labels: { show: showNormalized }
      },
      yaxis: {
        labels: {
          style: {
            fontFamily: "Barlow Condensed, sans-serif",
            fontSize: "12px",
            fontWeight: "bold",
            colors: ["#ff3366", "#a855f7", "#3399ff"]
          }
        }
      },
      tooltip: {
        theme: "dark",
        y: {
          formatter: function (val, opt) {
            const isPrelim = (opt.seriesIndex === 2 && selectedYear === "2025") ? " [dato preliminar]" : "";
            const isEst = (opt.seriesIndex === 2 && selectedYear === "2022") ? " [estimado]" : "";
            const suffix = isPrelim + isEst;
            if (showNormalized) {
              if (opt.seriesIndex === 0) return val + "% de su pico histórico (" + data.homicidios.toLocaleString("es") + " casos)";
              if (opt.seriesIndex === 1) return val + "% de su pico histórico (" + data.informalidad + "% de la PEA)";
              if (opt.seriesIndex === 2) return val + "% de su pico histórico (" + data.desercion + " mil estudiantes" + suffix + ")";
            } else {
              if (opt.seriesIndex === 0) return data.homicidios + " casos totales";
              if (opt.seriesIndex === 1) return data.informalidad + "% de la PEA";
              if (opt.seriesIndex === 2) return data.desercion + " mil estudiantes" + suffix;
            }
            return val;
          }
        }
      }
    };
  }, [selectedYear, data, showNormalized]);

  return (
    <section className="panel" id="p5" style={{ background: "var(--bg)" }}>
      <div className="noise"></div>
      <div className="scan" style={{ top: "30%" }}></div>
      <div className="scan" style={{ top: "70%" }}></div>

      <div className="sim-wrap">
        <div className="sim-left" ref={leftRef}>
          <div>
            <span
              className="tag"
              style={{
                color: data.color,
                borderColor: `${data.color}4d`,
              }}
            >
              Análisis Comparativo por Años
            </span>
            <h2
              className="ex-title"
              style={{
                color: "var(--cream)",
                fontFamily: "Bebas Neue, cursive",
                fontSize: "clamp(2.2rem, 4.5vw, 4.8rem)",
                lineHeight: 0.9,
                marginTop: "10px",
                marginBottom: "14px",
              }}
            >
              CRUCE DE
              <br />
              <span style={{ color: data.color, textShadow: `0 0 40px ${data.color}22` }}>VARIABLES</span>
            </h2>
            <p
              className="ex-desc"
              style={{
                fontSize: "0.82rem",
                lineHeight: 1.6,
                color: "rgba(244, 237, 226, 0.65)",
                minHeight: "80px"
              }}
            >
              Usa la leyenda superior interactiva para ocultar o mostrar variables haciendo clic sobre sus nombres. Selecciona el año en el menú desplegable para estudiar su impacto socioeconómico real en Ecuador.
            </p>
          </div>

          <div
            className="ex-insight"
            style={{
              marginTop: "10px",
              padding: "16px 20px",
              background: "rgba(255,255,255,0.01)",
              borderLeft: `3px solid ${data.color}`,
              borderRadius: "0 8px 8px 0"
            }}
          >
            <div style={{ fontSize: "0.72rem", letterSpacing: "1px", textTransform: "uppercase", color: "rgba(244, 237, 226, 0.45)" }}>
              Contexto del Año {selectedYear}:
            </div>
            <div style={{ fontSize: "0.85rem", color: "#fff", marginTop: "6px", lineHeight: 1.5 }}>
              En {selectedYear}, bajo una tasa de informalidad del <strong>{displayInformalidad}%</strong> y con un acumulado de <strong>{displayDesercion} mil{selectedYear === "2022" ? " (estimado)" : ""}</strong> estudiantes fuera del sistema educativo, los homicidios intencionales a nivel nacional se situaron en <strong>{displayHomicidios.toLocaleString("es")}</strong> casos reales.
            </div>
          </div>
        </div>

        <div className="sim-right">
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "auto",
              background: "rgba(255,255,255,0.018)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "24px",
              padding: "20px 16px 12px",
              backdropFilter: "blur(12px)",
              boxShadow: `0 0 60px ${data.color}11, inset 0 0 40px rgba(255,255,255,0.01)`,
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
                background: `linear-gradient(90deg, transparent, ${data.color}, transparent)`,
              }}
            />

            {/* Encabezado del Gráfico con Selector Integrado */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div>
                <p
                  style={{
                    fontFamily: "Barlow Condensed, sans-serif",
                    fontSize: "0.68rem",
                    letterSpacing: "4px",
                    textTransform: "uppercase",
                    color: "rgba(244, 237, 226, 0.35)",
                    margin: 0,
                  }}
                >
                  Dashboard Comparativo
                </p>
                <p
                  style={{
                    fontFamily: "Bebas Neue, cursive",
                    fontSize: "1.35rem",
                    letterSpacing: "3px",
                    color: "rgba(244, 237, 226, 0.85)",
                    margin: 0,
                  }}
                >
                  Cruce de Factores de Riesgo
                </p>
              </div>
              
              {/* Controles de interactividad del gráfico */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {/* Botón de alternancia de vista */}
                <button
                  onClick={() => setShowNormalized(!showNormalized)}
                  style={{
                    background: "rgba(7, 7, 10, 0.9)",
                    border: `1px solid ${data.color}`,
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
                    e.target.style.background = `${data.color}22`;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(7, 7, 10, 0.9)";
                  }}
                >
                  {showNormalized ? "Ver Valores Reales" : "Ver Vista Normalizada"}
                </button>

                {/* Selector de años embebido en el gráfico */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: "0.8rem", letterSpacing: "1px", color: "rgba(244,237,226,0.5)" }}>AÑO:</span>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    style={{
                      background: "rgba(7, 7, 10, 0.9)",
                      border: `1px solid ${data.color}`,
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
                    {Object.keys(COMPARE_YEARS_DATA).map(yr => (
                      <option key={yr} value={yr} style={{ background: "#0a0a0f", color: "#fff" }}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Explicación obligatoria en pantalla */}
            <div
              style={{
                fontFamily: "Barlow Condensed, Inter, sans-serif",
                fontSize: "11px",
                fontWeight: 400,
                color: "rgba(244, 237, 226, 0.5)",
                marginBottom: "12px",
                lineHeight: "1.3"
              }}
            >
              {showNormalized 
                ? "Cada barra muestra el porcentaje respecto al máximo histórico de esa variable (2020–2025). No representa un valor absoluto comparable entre categorías distintas."
                : "Cada barra representa el valor real en su respectiva unidad (Casos de homicidio, % de informalidad de la PEA, Miles de estudiantes en deserción). No son directamente comparables en magnitud."}
            </div>

            {showChart && (
              <Chart
                key={`${selectedYear}_${showNormalized}`}
                options={options}
                series={series}
                type="bar"
                height={chartHeight}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
