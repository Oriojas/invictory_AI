import React, { useRef } from "react";
import {
  motion,
  useReducedMotion
} from "framer-motion";
import { useInView } from "../../hooks/useInView.js";
import {
  Box,
  Camera,
  BarChart3,
  Check,
  Clock3,
  Database,
  Bot,
  Mic2,
  PackageSearch,
  QrCode,
  ScanLine,
  Sparkles,
  Video,
  Volume2,
  Warehouse,
} from "lucide-react";
import "./InvictoryRoadmap.css";

const roadmap = [
  {
    version: "V1.0",
    title: "Captura multimodal y auditoría preventiva",
    status: "Versión actual",
    current: true,
    icon: (
      <div className="roadmap-icon-composition">
        <Camera size={29} />
        <Box size={27} />
        <ScanLine size={24} />
      </div>
    ),
    features: [
      "Telegram Mini App con voz frase por frase y fotografía individual de etiquetas.",
      "Whisper, Vision OCR y conciliación semántica 1 a 1 con el SKU del ERP.",
      "Alertas preventivas, dashboard React y reportes PDF certificados.",
    ],
  },
  {
    version: "V1.1",
    title: "QR, zonas y gestión de bodegas",
    status: "Próximo",
    icon: (
      <div className="roadmap-icon-composition">
        <QrCode size={34} />
        <Warehouse size={28} />
      </div>
    ),
    features: [
      "Códigos QR para identificar zonas y estantes sin hardware especializado.",
      "Segmentación ampliada y gestión independiente por bodegas.",
    ],
  },
  {
    version: "V2.0",
    title: "Dictado continuo y asistencia bidireccional",
    status: "En desarrollo",
    icon: (
      <div className="roadmap-icon-composition">
        <Mic2 size={34} />
        <Volume2 size={28} />
      </div>
    ),
    features: [
      "Dictado continuo multi-ítem con separación automática en tiempo real.",
      "Asistente de voz que responde, alerta y solicita confirmaciones.",
      "Fotografía panorámica con detección simultánea de múltiples objetos.",
      "Smart Offline Queue v2 con reducción de hasta 70% en consumo de datos.",
    ],
  },
  {
    version: "V3.0",
    title: "3D, FEFO y analítica predictiva",
    status: "Futuro",
    icon: (
      <div className="roadmap-icon-composition">
        <PackageSearch size={31} />
        <Clock3 size={27} />
        <BarChart3 size={28} />
      </div>
    ),
    features: [
      "Estimación 3D del volumen restante en líquidos y productos a granel.",
      "Control inteligente de vencimientos bajo metodología FEFO.",
      "Simulador de escenarios operativos y demanda en el dashboard.",
    ],
  },
  {
    version: "V4.0",
    title: "Visión continua y copiloto de espacios",
    status: "Visión",
    icon: (
      <div className="roadmap-icon-composition">
        <Video size={29} />
        <Bot size={31} />
        <Sparkles size={24} />
      </div>
    ),
    features: [
      "Auditoría visual continua 24/7 mediante cámaras IP y CCTV.",
      "Sincronización con drones para bodegas industriales y de gran altura.",
      "Copiloto de IA para optimizar recorridos y distribución física.",
    ],
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.25,
      staggerChildren: 0.14,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 34,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 18,
      mass: 0.7,
    },
  },
};

const nodeVariants = {
  hidden: { opacity: 0, scale: 0.35 },
  visible: (index) => ({
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 280,
      damping: 18,
      delay: 0.5 + index * 0.15,
    },
  }),
};

export default function InvictoryRoadmap() {
  const [sectionRef, isInView] = useInView({ threshold: 0.18 });
  const reduceMotion = useReducedMotion();

  return (
    <section
      ref={sectionRef}
      className="invictory-roadmap"
      aria-labelledby="invictory-roadmap-title"
    >
      <div className="roadmap-heading">
        <motion.div
          className="roadmap-eyebrow"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
        >
          <span />
          ROADMAP DE PRODUCTO
          <span />
        </motion.div>

        <motion.h2
          id="invictory-roadmap-title"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          Evolución de <strong>Invictory_AI</strong>
        </motion.h2>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.16 }}
        >
          De la captura multimodal a la auditoría autónoma de inventarios.
        </motion.p>
      </div>

      <div className="roadmap-scroll">
        <div className="roadmap-stage">
          <div className="roadmap-path" aria-hidden="true">
            <svg viewBox="0 0 1200 112" preserveAspectRatio="none">
              <path
                className="roadmap-path-ghost"
                d="M35 56 C135 56 150 25 245 50 S380 82 475 48 S610 25 705 50 S840 79 935 49 S1050 48 1165 43"
              />
              <motion.path
                className="roadmap-path-progress"
                d="M35 56 C135 56 150 25 245 50 S380 82 475 48 S610 25 705 50 S840 79 935 49 S1050 48 1165 43"
                initial={reduceMotion ? false : { pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{
                  duration: 1.65,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.22,
                }}
              />
              <motion.path
                className="roadmap-path-dots"
                d="M35 56 C135 56 150 25 245 50 S380 82 475 48 S610 25 705 50 S840 79 935 49 S1050 48 1165 43"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 1.15, duration: 0.5 }}
              />
            </svg>

            <motion.div
              className="roadmap-moving-dot"
              initial={reduceMotion ? false : { offsetDistance: "0%", opacity: 0 }}
              animate={
                isInView
                  ? {
                      offsetDistance: ["0%", "100%"],
                      opacity: [0, 1, 1, 0],
                    }
                  : {}
              }
              transition={{
                duration: 4.8,
                delay: 1.7,
                repeat: Infinity,
                repeatDelay: 1.4,
                ease: "easeInOut",
              }}
            />
          </div>

          <div className="roadmap-nodes" aria-hidden="true">
            {roadmap.map((item, index) => (
              <motion.div
                key={item.version}
                className={`roadmap-node ${item.current ? "is-current" : ""}`}
                custom={index}
                variants={nodeVariants}
                initial={reduceMotion ? false : "hidden"}
                animate={isInView ? "visible" : "hidden"}
              >
                <span />
              </motion.div>
            ))}
          </div>

          <motion.div
            className="roadmap-grid"
            variants={containerVariants}
            initial={reduceMotion ? false : "hidden"}
            animate={isInView ? "visible" : "hidden"}
          >
            {roadmap.map((item) => (
              <motion.article
                key={item.version}
                className={`roadmap-card ${item.current ? "is-current" : ""}`}
                variants={cardVariants}
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        y: -8,
                        transition: {
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                        },
                      }
                }
              >
                {item.current && (
                  <motion.div
                    className="roadmap-current-badge"
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 18,
                      delay: 0.9,
                    }}
                  >
                    <span />
                    Actual
                  </motion.div>
                )}

                <motion.div
                  className="roadmap-icon"
                  whileHover={
                    reduceMotion
                      ? undefined
                      : {
                          rotate: [0, -2, 2, 0],
                          scale: 1.04,
                        }
                  }
                  transition={{ duration: 0.4 }}
                >
                  {item.icon}
                </motion.div>

                <span className="roadmap-version">{item.version}</span>
                <h3>{item.title}</h3>

                <div className="roadmap-divider" />

                <ul>
                  {item.features.map((feature) => (
                    <li key={feature}>
                      <Check size={15} aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="roadmap-card-footer">
                  <span
                    className={`roadmap-status-dot ${
                      item.current ? "is-yellow" : ""
                    }`}
                  />
                  {item.status}
                </div>
              </motion.article>
            ))}
          </motion.div>

          <div className="roadmap-bottom-line" aria-hidden="true">
            <motion.div
              initial={reduceMotion ? false : { scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{
                duration: 1.45,
                delay: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
            {roadmap.map((item) => (
              <span
                key={item.version}
                className={item.current ? "is-current" : ""}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="roadmap-mobile-hint">
        <Database size={17} aria-hidden="true" />
        Desliza horizontalmente para explorar el roadmap
      </div>
    </section>
  );
}
