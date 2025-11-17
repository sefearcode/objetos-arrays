console.log("=== SISTEMA DE GESTIÓN DE BIBLIOTECA AVANZADO ===\n");

// Base de datos de libros
const libros = [
  { id: 1, titulo: "JavaScript: The Good Parts", autor: "Douglas Crockford", genero: "Programación", disponible: true, prestamos: 0 },
  { id: 2, titulo: "Clean Code", autor: "Robert C. Martin", genero: "Programación", disponible: false, prestamos: 5 },
  { id: 3, titulo: "The Pragmatic Programmer", autor: "Andrew Hunt", genero: "Programación", disponible: true, prestamos: 3 },
  { id: 4, titulo: "1984", autor: "George Orwell", genero: "Ficción", disponible: true, prestamos: 10 },
  { id: 5, titulo: "To Kill a Mockingbird", autor: "Harper Lee", genero: "Ficción", disponible: false, prestamos: 7 }
];

// Sistema de usuarios
const usuarios = [
  { id: 1, nombre: "Ana", historial: [] },
  { id: 2, nombre: "Luis", historial: [] }
];

// Constante de multa por día de retraso
const MULTA_DIARIA = 500; // moneda arbitraria

const biblioteca = {
  // Obtener libros disponibles
  obtenerDisponibles() {
    return libros.filter(({ disponible }) => disponible);
  },

  // Búsqueda avanzada por múltiples criterios
  buscar({ titulo = "", autor = "", genero = "" } = {}) {
    return libros.filter(({ titulo: t, autor: a, genero: g }) =>
      t.toLowerCase().includes(titulo.toLowerCase()) &&
      a.toLowerCase().includes(autor.toLowerCase()) &&
      g.toLowerCase().includes(genero.toLowerCase())
    );
  },

  // Prestar libro a un usuario
  prestar(idLibro, idUsuario) {
    const libro = libros.find(l => l.id === idLibro);
    const usuario = usuarios.find(u => u.id === idUsuario);
    if (!libro) return { exito: false, mensaje: "Libro no encontrado" };
    if (!usuario) return { exito: false, mensaje: "Usuario no encontrado" };
    if (!libro.disponible) return { exito: false, mensaje: "Libro no disponible" };

    libro.disponible = false;
    libro.prestamos++;
    usuario.historial.push({ libroId: libro.id, fechaPrestamo: new Date(), devuelto: false });

    return { exito: true, mensaje: `Libro "${libro.titulo}" prestado a ${usuario.nombre}` };
  },

  // Devolver libro y calcular multa si hay retraso
  devolver(idLibro, idUsuario, diasRetraso = 0) {
    const libro = libros.find(l => l.id === idLibro);
    const usuario = usuarios.find(u => u.id === idUsuario);
    if (!libro) return { exito: false, mensaje: "Libro no encontrado" };
    if (!usuario) return { exito: false, mensaje: "Usuario no encontrado" };
    if (libro.disponible) return { exito: false, mensaje: "Este libro ya está disponible" };

    libro.disponible = true;
    const registro = usuario.historial.find(h => h.libroId === idLibro && !h.devuelto);
    if (registro) registro.devuelto = true;
    const multa = diasRetraso * MULTA_DIARIA;

    return { 
      exito: true, 
      mensaje: `Libro "${libro.titulo}" devuelto por ${usuario.nombre}. Multa: ${multa}` 
    };
  },

  // Estadísticas generales
  obtenerEstadisticas() {
    const total = libros.length;
    const disponibles = libros.filter(l => l.disponible).length;
    const prestados = total - disponibles;

    const porGenero = libros.reduce((acc, { genero }) => {
      acc[genero] = (acc[genero] || 0) + 1;
      return acc;
    }, {});

    return { total, disponibles, prestados, porGenero };
  },

  // Reporte de popularidad de libros
  reportePopularidad() {
    return [...libros]
      .sort((a, b) => b.prestamos - a.prestamos)
      .map(({ titulo, prestamos }) => `${titulo} - Prestado ${prestamos} veces`);
  }
};

// DEMOSTRACIÓN
console.log("📚 LIBROS DISPONIBLES:");
biblioteca.obtenerDisponibles().forEach(({ titulo }) => console.log(`- ${titulo}`));

console.log("\n🔍 BÚSQUEDA AVANZADA (Programación):");
biblioteca.buscar({ genero: "Programación" }).forEach(({ titulo }) => console.log(`- ${titulo}`));

console.log("\n📖 OPERACIONES DE PRÉSTAMO:");
console.log(biblioteca.prestar(1, 1).mensaje); // Ana toma JS
console.log(biblioteca.devolver(1, 1, 2).mensaje); // Ana devuelve con 2 días de retraso

console.log("\n📊 ESTADÍSTICAS:");
const stats = biblioteca.obtenerEstadisticas();
console.log(`Total: ${stats.total}, Disponibles: ${stats.disponibles}, Prestados: ${stats.prestados}`);
console.log("Por género:", stats.porGenero);

console.log("\n🏆 REPORTE DE POPULARIDAD:");
biblioteca.reportePopularidad().forEach(linea => console.log(linea));
