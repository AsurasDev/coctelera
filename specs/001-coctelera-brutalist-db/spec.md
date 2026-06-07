# Feature Specification: Coctelera — Base de Datos Brutalista de Cócteles

**Feature Branch**: `001-coctelera-brutalist-db`

**Created**: 2026-06-06

**Status**: Draft

**Input**: Sitio web estático de base de datos de cócteles con diseño brutalista (Simuu v2). Frontend Astro (SSG) + backend Directus en Railway. Datos desde bar-assistant/data.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Explorar la galería de cócteles (Priority: P1)

Un visitante llega al sitio y ve la galería completa de cócteles ordenados alfabéticamente. Cada tarjeta muestra el nombre, licor base, tipo de copa, temperatura de servicio, país de origen y graduación alcohólica. El visitante puede recorrer toda la colección sin ninguna acción previa.

**Why this priority**: Es la entrada principal al sitio. Sin galería funcional no existe el producto. Cubre el caso de uso más frecuente: descubrir cócteles disponibles.

**Independent Test**: Abrir la URL raíz y verificar que se muestran tarjetas de cócteles con datos visibles, con el contador total en el encabezado.

**Acceptance Scenarios**:

1. **Given** el visitante abre la página principal, **When** la página carga, **Then** ve una cuadrícula de tarjetas de cócteles, cada una con nombre, ilustración visual, licor base y metadatos clave.
2. **Given** la galería está cargada, **When** el visitante observa la cabecera, **Then** ve el nombre "Coctelera", el subtítulo "Recetario brutalista" y el conteo total de recetas.
3. **Given** la galería está cargada, **When** no hay filtros activos, **Then** se muestran todos los cócteles ordenados por nombre A–Z.

---

### User Story 2 — Buscar y filtrar cócteles (Priority: P2)

El visitante quiere encontrar cócteles específicos usando la barra de búsqueda o los filtros de licor base, categoría, temperatura de servicio y país de origen. Puede combinar múltiples filtros y ver los resultados actualizarse instantáneamente.

**Why this priority**: El valor principal del sitio como "base de datos" depende de poder encontrar recetas según criterios específicos.

**Independent Test**: Escribir "ron" en la búsqueda y verificar que solo aparecen cócteles con ron. Activar filtro "Cuba" y verificar que los resultados se reducen al subconjunto correcto.

**Acceptance Scenarios**:

1. **Given** la galería está cargada, **When** el visitante escribe un término en la búsqueda, **Then** las tarjetas se filtran instantáneamente mostrando solo cócteles cuyo nombre, licor base, categoría o ingredientes coincidan.
2. **Given** el visitante activa un filtro de licor base, **When** selecciona "Ginebra", **Then** solo se muestran cócteles con ginebra como base.
3. **Given** hay múltiples filtros activos, **When** el visitante hace clic en "Limpiar filtros", **Then** todos los filtros se restablecen y vuelven a aparecer todos los cócteles.
4. **Given** una búsqueda no produce resultados, **When** no hay coincidencias, **Then** se muestra un estado vacío con mensaje orientativo.
5. **Given** la galería está cargada, **When** el visitante selecciona el ordenamiento "ABV ▼", **Then** los cócteles se reordenan de mayor a menor graduación alcohólica.

---

### User Story 3 — Ver el detalle de un cóctel (Priority: P1)

El visitante hace clic en una tarjeta y accede a la página de detalle del cóctel, donde ve la receta completa: descripción, metadatos (graduación, tiempo, dificultad, servicio, origen, copa), lista de ingredientes con cantidades y pasos de preparación numerados. Puede navegar al cóctel anterior o siguiente.

**Why this priority**: Es el propósito central del sitio — consultar recetas completas. Comparte prioridad P1 con la galería porque sin detalle la galería no cumple su función.

**Independent Test**: Desde una tarjeta, hacer clic y verificar que la página de detalle muestra todos los campos: ingredientes con cantidades, pasos numerados y los 6 metadatos del metastrip.

**Acceptance Scenarios**:

1. **Given** el visitante está en la galería, **When** hace clic en una tarjeta de cóctel, **Then** navega a la página de detalle del cóctel con URL `/cocktails/[slug]`.
2. **Given** la página de detalle está cargada, **When** el visitante la examina, **Then** ve: ilustración o imagen del cóctel, eyebrow con base·categoría·país, título grande, descripción, metastrip de 6 celdas (graduación, tiempo, dificultad, servicio, origen, copa), lista de ingredientes con cantidades, y pasos de preparación numerados.
3. **Given** el visitante está en la página de detalle, **When** hace clic en "Volver a la galería", **Then** regresa a la galería principal.
4. **Given** hay más cócteles disponibles, **When** el visitante hace clic en "Siguiente", **Then** navega al próximo cóctel en orden; el botón "Anterior" está disponible si no es el primero.
5. **Given** el visitante está en el primer/último cóctel, **When** examina la navegación, **Then** el botón "Anterior"/"Siguiente" correspondiente está deshabilitado.

---

### User Story 4 — Cambiar paleta de colores (Priority: P3)

El visitante quiere personalizar la apariencia visual del sitio eligiendo entre 20 paletas de color. La selección se persiste entre visitas usando almacenamiento local del navegador.

**Why this priority**: Mejora la experiencia y el disfrute del sitio sin ser funcionalidad core.

**Independent Test**: Abrir el selector de paleta, elegir "Carbón" (modo oscuro), recargar la página y verificar que la paleta persiste.

**Acceptance Scenarios**:

1. **Given** el visitante accede al selector de paleta, **When** elige una paleta, **Then** todos los colores del sitio (fondo, superficie, tinta, acento) cambian de forma coordinada e instantánea.
2. **Given** el visitante seleccionó una paleta y recarga la página, **When** la página carga, **Then** la paleta seleccionada se aplica automáticamente.

---

### Edge Cases

- ¿Qué sucede si Directus no tiene cócteles en el momento del build? → El sitio se construye con 0 tarjetas y muestra un estado vacío informativo.
- ¿Qué ocurre si un cóctel no tiene imagen? → Se muestra la ilustración SVG brutalista como fallback.
- ¿Qué pasa si el slug de un cóctel no existe en la URL? → Se retorna una página 404 de Astro.
- ¿Cómo se comporta la búsqueda con caracteres especiales (acentos, ñ)? → La búsqueda normaliza texto y es insensible a mayúsculas/minúsculas y acentos.
- ¿Qué ocurre con cócteles que no tienen todos los campos opcionales completos? → Los campos ausentes se omiten silenciosamente de la UI sin romper el layout.

---

## Requirements *(mandatory)*

### Functional Requirements

**Galería**

- **FR-001**: El sistema DEBE mostrar todos los cócteles disponibles en una cuadrícula responsive al cargar la página principal.
- **FR-002**: El sistema DEBE mostrar en cada tarjeta: ilustración visual, nombre, licor base, tipo de copa, temperatura de servicio, país de origen, y opcionalmente la graduación alcohólica (ABV).
- **FR-003**: El sistema DEBE mostrar el contador total de recetas disponibles en la cabecera.
- **FR-004**: El sistema DEBE soportar tres modos de visualización de filtros: plegable (colapsable), menús desplegables, y completo (todos visibles).
- **FR-005**: El sistema DEBE permitir búsqueda de texto libre sobre nombre, licor base, categoría e ingredientes del cóctel.
- **FR-006**: El sistema DEBE permitir filtrado por licor base, categoría, temperatura de servicio y país de origen de forma combinable (AND).
- **FR-007**: El sistema DEBE permitir ordenar los resultados por nombre (A–Z), ABV descendente y ABV ascendente.
- **FR-008**: El estado de filtros activos DEBE persistir en el almacenamiento local del navegador entre visitas.
- **FR-009**: El sistema DEBE mostrar el conteo de resultados filtrados en tiempo real.
- **FR-010**: El sistema DEBE mostrar un estado vacío descriptivo cuando ningún cóctel coincide con los filtros.

**Detalle de cóctel**

- **FR-011**: El sistema DEBE generar una página estática por cada cóctel en la ruta `/cocktails/[slug]`.
- **FR-012**: La página de detalle DEBE mostrar: ilustración/imagen del cóctel, eyebrow (base · categoría · país), título en tamaño display, descripción, metastrip de 6 celdas, bloque de ingredientes y bloque de preparación.
- **FR-013**: El metastrip DEBE incluir: graduación alcohólica, tiempo de preparación, dificultad, tipo de servicio (temperatura), país de origen y tipo de copa.
- **FR-014**: Los ingredientes DEBE mostrarse con cantidad en tipografía monoespaciada y nombre del ingrediente.
- **FR-015**: Los pasos de preparación DEBE mostrarse numerados con cuadros de color asociados al licor base.
- **FR-016**: La página de detalle DEBE ofrecer navegación al cóctel anterior y siguiente.

**Backend e infraestructura**

- **FR-017**: El sistema DEBE usar un CMS headless (Directus) como única fuente de verdad para los datos de cócteles.
- **FR-018**: El frontend DEBE obtener todos los datos únicamente durante el proceso de construcción (build time), sin llamadas al backend en tiempo de ejecución del usuario.
- **FR-019**: El sistema DEBE incluir un script de importación que lea datos del repositorio bar-assistant/data y los cargue en Directus.
- **FR-020**: El sitio DEBE reconstruirse automáticamente cuando el contenido cambia en Directus (mediante webhook).
- **FR-021**: Las imágenes de cócteles DEBEN servirse desde URLs públicas de Directus Files.

**Diseño visual**

- **FR-022**: El sistema DEBE implementar el sistema de diseño brutalista Simuu v2: bordes sólidos 2–4px, sombras duras sin difuminado, tipografía Archivo Black para display.
- **FR-023**: El sistema DEBE soportar 20 paletas de color intercambiables que afecten de forma coordinada fondo, superficie, tinta, acento y advertencia.
- **FR-024**: La paleta seleccionada DEBE persistir en el almacenamiento local del navegador.
- **FR-025**: Las ilustraciones de vaso DEBEN ser SVG brutalistas con trazo negro grueso y color del líquido correspondiente al cóctel.

### Key Entities

- **Cóctel**: Unidad principal de contenido. Atributos: slug único, nombre, descripción, licor base, categoría, país, temperatura de servicio, graduación alcohólica, tiempo de preparación, dificultad, tipo de copa, tipo de ilustración de vaso, decoración (garnish), color de tono de panel, instrucciones, etiquetas, lista de ingredientes, imágenes.
- **Ingrediente**: Componente de una receta. Atributos: nombre, cantidad, unidad de medida, orden de presentación, indicador de opcionalidad.
- **Imagen de cóctel**: Archivo visual asociado a un cóctel. Atributos: URL pública, orden, información de copyright.
- **Paleta de color**: Esquema visual del sitio. Atributos: identificador, etiqueta, colores de fondo/superficie/tinta/acento/advertencia/inverso.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un visitante puede encontrar cualquier cóctel por nombre o ingrediente en menos de 10 segundos desde que llega al sitio.
- **SC-002**: La página principal carga y muestra todas las tarjetas de cócteles en menos de 3 segundos en conexión estándar.
- **SC-003**: La página de detalle de un cóctel se carga en menos de 2 segundos desde que el visitante hace clic en una tarjeta.
- **SC-004**: El sitio funciona correctamente sin JavaScript para la visualización de contenido (SSG puro); los filtros y la búsqueda se degradan graciosamente si JS no está disponible.
- **SC-005**: El 100% de los cócteles del repositorio bar-assistant/data se importan correctamente al backend sin pérdida de datos.
- **SC-006**: El sitio generado es completamente estático — ninguna petición de red al backend ocurre en el navegador del usuario durante la navegación normal.
- **SC-007**: Cambiar la paleta de colores tarda menos de 100ms en reflejarse visualmente en toda la interfaz.
- **SC-008**: El sitio pasa las Core Web Vitals de Google (LCP < 2.5s, FID < 100ms, CLS < 0.1) en condiciones de red normal.

---

## Assumptions

- Los datos del repositorio bar-assistant/data están en inglés; los metadatos de categorías, temperaturas y dificultad se traducen al español durante la importación.
- El sitio tiene una única audiencia (visitantes públicos); no hay autenticación ni roles de usuario en el frontend.
- El contenido del sitio es de solo lectura para los visitantes; la gestión de contenido se realiza exclusivamente a través del panel de administración de Directus.
- Las ilustraciones de vasos se generan programáticamente mediante SVG para los tipos de vaso más comunes (lowball, highball, coupe, martini, hurricane, wine/balloon).
- El sitio es inicialmente en español (es-CO); el soporte multi-idioma queda fuera del alcance de esta versión.
- El backend Directus se configura con PostgreSQL como base de datos, provisionado por Railway.
- El rebuild automático del sitio estático se dispara mediante un webhook de Directus que llama al deploy hook de Railway.
- Los dispositivos móviles son soporte de primera clase; el grid responsive se adapta a 1 columna en pantallas menores a 600px.
- El número inicial de cócteles está determinado por el repositorio bar-assistant/data (actualmente ~200+ recetas); el diseño de la galería soporta esta escala.
