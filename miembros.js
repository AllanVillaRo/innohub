// =====================================================================
//  INNOHUB · Datos de miembros y niveles
//  Este es el ÚNICO archivo que hay que editar para actualizar niveles.
// =====================================================================

// 1) Dirección donde vas a publicar la página (GitHub Pages, Netlify, etc.)
//    Los QR de los gafetes apuntan a:  URL_BASE + "perfil.html?id=" + id
const URL_BASE = "https://allanvillaro.github.io/innohub/";

// 2) Áreas del INNOHUB. Por ahora solo Soldadura; las demás se agregan igual.
const AREAS = {
  soldadura: {
    nombre: "Soldadura",
    icono: "🔥",
    horasExperto: 50,     // horas validadas después del taller para llegar a Experto
    horasAutonomo: 100,   // horas ADICIONALES con Experto activo para llegar a Autónomo
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
  }
  // impresion3d: { ... }   ← próximamente
};

// 3) Miembros. "id" va en la URL del QR: sin espacios, tildes ni mayúsculas.
//    En cada área:
//      quizTeorico    true/false  → Básico
//      quizPractico   true/false  → Intermedio
//      horas          número      → horas validadas después del taller
//                                   (50 = Experto, 50 + 100 = 150 → listo para Autónomo)
//      revisionCierre true/false  → revisión informal hecha (necesaria para Autónomo)
const MIEMBROS = [
  {
    id: "tu-nombre",
    nombre: "Tu Nombre",
    rol: "Coordinador del INNOHUB",
    actualizado: "2026-09-28",
    areas: {
      soldadura: { quizTeorico: true, quizPractico: true, horas: 72, revisionCierre: false }
    }
  },
  {
    id: "ejemplo-ana",
    nombre: "Ana Ejemplo",
    rol: "Estudiante · Taller de electrónica",
    actualizado: "2026-09-28",
    areas: {
      soldadura: { quizTeorico: true, quizPractico: true, horas: 18, revisionCierre: false }
    }
  },
  {
    id: "ejemplo-luis",
    nombre: "Luis Ejemplo",
    rol: "Estudiante",
    actualizado: "2026-09-28",
    areas: {
      soldadura: { quizTeorico: true, quizPractico: false, horas: 0, revisionCierre: false }
    }
  }
];

// ---------------------------------------------------------------------
//  Cálculo de nivel y progreso (no hace falta tocar esto)
// ---------------------------------------------------------------------
function calcularArea(areaId, d) {
  const a = AREAS[areaId];
  d = d || {};
  const horas = Math.max(0, Number(d.horas) || 0);
  const hE = a.horasExperto, hA = a.horasAutonomo;

  const hechos = [
    !!d.quizTeorico,
    !!d.quizTeorico && !!d.quizPractico,
    !!d.quizTeorico && !!d.quizPractico && horas >= hE,
    !!d.quizTeorico && !!d.quizPractico && horas >= hE + hA && !!d.revisionCierre
  ];
  let nivel = -1;
  hechos.forEach((ok, i) => { if (ok) nivel = i; });

  // Relleno de cada uno de los 4 tramos de la barra (0 a 1)
  const tramos = [
    hechos[0] ? 1 : 0,
    hechos[1] ? 1 : 0,
    hechos[1] ? Math.min(horas / hE, 1) : 0,
    hechos[2] ? Math.min((horas - hE) / hA, 1) * (d.revisionCierre ? 1 : 0.97) : 0
  ];
  if (hechos[3]) tramos[3] = 1;
  const porcentaje = Math.round(tramos.reduce((s, t) => s + t, 0) / 4 * 100);

  // Qué falta para el siguiente nivel
  let siguiente = null;
  if (nivel === -1) siguiente = { texto: "Pasar el quiz teórico del taller" };
  else if (nivel === 0) siguiente = { texto: "Pasar el quiz práctico de componentes" };
  else if (nivel === 1) siguiente = { actual: horas, meta: hE, texto: `${horas} / ${hE} h validadas` };
  else if (nivel === 2) {
    const extra = horas - hE;
    siguiente = extra >= hA
      ? { actual: hA, meta: hA, texto: "Horas completas · falta la revisión de cierre" }
      : { actual: extra, meta: hA, texto: `${extra} / ${hA} h adicionales` };
  }
  return { area: a, nivel, horas, tramos, porcentaje, siguiente, datos: d };
}
