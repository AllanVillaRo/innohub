// =====================================================================
//  INNOHUB · Datos de miembros y niveles
//  Este es el ÚNICO archivo que hay que editar para actualizar niveles.
// =====================================================================

// 1) Dirección donde está publicada la página
//    Los QR de los gafetes apuntan a:  URL_BASE + "perfil.html?id=" + id
const URL_BASE = "https://allanvillaro.github.io/innohub/";

// 2) Áreas del INNOHUB.
//    Cada área mide el avance con su propia unidad:
//      campo         → nombre del dato en cada miembro (ej. "horas", "impresiones")
//      unidad        → cómo se muestra (ej. "h", "impresiones")
//      metaExperto   → cantidad necesaria para llegar a Experto
//      metaAutonomo  → cantidad ADICIONAL (ya siendo Experto) para llegar a Autónomo
const AREAS = {
  soldadura: {
    nombre: "Soldadura",
    icono: "🔥",
    campo: "horas",
    unidad: "h",
    metaExperto: 50,
    metaAutonomo: 100,
    niveles: [
      {
        id: "basico", nombre: "Básico", color: "#F2B705",
        permiso: "Conoce la teoría. Puede estar en el lab, pero otra persona debe soldar por él/ella.",
        requisito: "Pasar el quiz teórico (10 preguntas) al final del taller."
      },
      {
        id: "intermedio", nombre: "Intermedio", color: "#F07C1B",
        permiso: "Ya sabe soldar, pero necesita a alguien cerca por si algo sale mal.",
        requisito: "Pasar el quiz práctico de componentes durante el taller."
      },
      {
        id: "experto", nombre: "Experto", color: "#D62828",
        permiso: "Trabaja de forma independiente; debe haber alguien con más experiencia rondando el espacio.",
        requisito: "Acumular 50 horas de práctica validadas en el INNOHUB después del taller."
      },
      {
        id: "autonomo", nombre: "Autónomo", color: "#1D5FD1",
        permiso: "Acceso libre al lab sin necesidad de que nadie esté presente.",
        requisito: "Acumular 100 horas adicionales con nivel Experto activo + revisión informal de cierre."
      }
    ]
  },

  impresion3d: {
    nombre: "Impresión 3D",
    icono: "🖨️",
    campo: "impresiones",
    unidad: "impresiones",
    metaExperto: 50,
    metaAutonomo: 100,
    niveles: [
      {
        id: "basico", nombre: "Básico", color: "#F2B705",
        permiso: "Conoce la teoría. Puede estar en el lab, pero otra persona debe operar la impresora por él/ella.",
        requisito: "Pasar el quiz teórico (10 preguntas) al final del taller."
      },
      {
        id: "intermedio", nombre: "Intermedio", color: "#F07C1B",
        permiso: "Ya sabe imprimir, pero necesita a alguien cerca por si algo sale mal.",
        requisito: "Pasar el quiz práctico de impresión durante el taller."
      },
      {
        id: "experto", nombre: "Experto", color: "#D62828",
        permiso: "Imprime de forma independiente; debe haber alguien con más experiencia rondando el espacio.",
        requisito: "Completar 50 impresiones validadas en el INNOHUB después del taller."
      },
      {
        id: "autonomo", nombre: "Autónomo", color: "#1D5FD1",
        permiso: "Acceso libre a las impresoras sin necesidad de que nadie esté presente.",
        requisito: "Completar 100 impresiones adicionales con nivel Experto activo + revisión informal de cierre."
      }
    ]
  }
};

// 3) Miembros. "id" va en la URL del QR: sin espacios, tildes ni mayúsculas.
//    En cada área:
//      quizTeorico    true/false  → Básico
//      quizPractico   true/false  → Intermedio
//      horas / impresiones  número → lo acumulado después del taller
//                                   (50 = Experto, 50 + 100 = 150 → listo para Autónomo)
//      revisionCierre true/false  → revisión informal hecha (necesaria para Autónomo)
const MIEMBROS = [
  {
    id: "carlos-profesor",
    nombre: "Carlos",
    rol: "Coordinador del INNOHUB",
    actualizado: "2026-09-28",
    areas: {
      soldadura:   { quizTeorico: true,  quizPractico: true,  horas: 150,      revisionCierre: true },
      impresion3d: { quizTeorico: false, quizPractico: false, impresiones: 0,  revisionCierre: false }
    }
  },
  {
    id: "allan-villalobos",
    nombre: "Allan Villobos",
    rol: "Asistente de Electrica",
    actualizado: "2026-09-28",
    areas: {
      soldadura:   { quizTeorico: true,  quizPractico: true,  horas: 50,       revisionCierre: false },
      impresion3d: { quizTeorico: false, quizPractico: false, impresiones: 0,  revisionCierre: false }
    }
  },
  {
    id: "sheilyn-morris",
    nombre: "Sheilyn Morris",
    rol: "Asistente Electrica",
    actualizado: "2026-09-28",
    areas: {
      soldadura:   { quizTeorico: true,  quizPractico: false, horas: 0,        revisionCierre: false },
      impresion3d: { quizTeorico: false, quizPractico: false, impresiones: 0,  revisionCierre: false }
    }
  }
];

// ---------------------------------------------------------------------
//  Cálculo de nivel y progreso (no hace falta tocar esto)
// ---------------------------------------------------------------------
function calcularArea(areaId, d) {
  const a = AREAS[areaId];
  d = d || {};
  const cant = Math.max(0, Number(d[a.campo]) || 0);
  const mE = a.metaExperto, mA = a.metaAutonomo, u = a.unidad;

  const hechos = [
    !!d.quizTeorico,
    !!d.quizTeorico && !!d.quizPractico,
    !!d.quizTeorico && !!d.quizPractico && cant >= mE,
    !!d.quizTeorico && !!d.quizPractico && cant >= mE + mA && !!d.revisionCierre
  ];
  let nivel = -1;
  hechos.forEach((ok, i) => { if (ok) nivel = i; });

  // Relleno de cada uno de los 4 tramos de la barra (0 a 1)
  const tramos = [
    hechos[0] ? 1 : 0,
    hechos[1] ? 1 : 0,
    hechos[1] ? Math.min(cant / mE, 1) : 0,
    hechos[2] ? Math.min((cant - mE) / mA, 1) * (d.revisionCierre ? 1 : 0.97) : 0
  ];
  if (hechos[3]) tramos[3] = 1;
  const porcentaje = Math.round(tramos.reduce((s, t) => s + t, 0) / 4 * 100);

  // Qué falta para el siguiente nivel
  let siguiente = null;
  if (nivel === -1) siguiente = { texto: "Pasar el quiz teórico del taller" };
  else if (nivel === 0) siguiente = { texto: "Pasar el quiz práctico del taller" };
  else if (nivel === 1) siguiente = { actual: cant, meta: mE, texto: `${cant} / ${mE} ${u} validadas` };
  else if (nivel === 2) {
    const extra = cant - mE;
    siguiente = extra >= mA
      ? { actual: mA, meta: mA, texto: `${u === "h" ? "Horas" : "Meta"} completa · falta la revisión de cierre` }
      : { actual: extra, meta: mA, texto: `${extra} / ${mA} ${u} adicionales` };
  }

  const requisitos = [
    [hechos[0], "Quiz teórico aprobado"],
    [hechos[1], "Quiz práctico aprobado"],
    [hechos[2], `${mE} ${u} validadas después del taller`],
    [hechos[1] && cant >= mE + mA, `${mA} ${u} adicionales como Experto`],
    [hechos[3], "Revisión de cierre"]
  ];
  return { area: a, nivel, cantidad: cant, tramos, porcentaje, siguiente, requisitos, datos: d };
}
