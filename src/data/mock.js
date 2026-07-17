// Centro de Trujillo (Plaza de Armas) como referencia
export const TRUJILLO_CENTER = [-8.1116, -79.0288];

// Bounding box aproximado del área metropolitana de Trujillo (lon1,lat1,lon2,lat2),
// usado para restringir la búsqueda por geocodificación a la ciudad.
export const TRUJILLO_VIEWBOX = '-79.22,-8.02,-78.94,-8.24';

export const savedPlaces = [
  { id: 'casa', label: 'Casa', address: 'Calle Los Pinos 123', icon: 'home', coords: [-8.1050, -79.0400] },
  { id: 'trabajo', label: 'Trabajo', address: 'Centro Histórico', icon: 'briefcase', coords: [-8.1116, -79.0288] },
  { id: 'universidad', label: 'Universidad Nacional de Trujillo', address: 'Av. Juan Pablo II, Trujillo', icon: 'cap', coords: [-8.0961, -79.0392] },
  { id: 'mall', label: 'Mallplaza Trujillo', address: 'Av. América Oeste, Trujillo', icon: 'bag', coords: [-8.1260, -79.0400] },
];

export const recentPlaces = [
  { id: 'r1', label: 'Plaza de Armas de Trujillo', address: 'Cercado de Trujillo, Trujillo 13001', coords: TRUJILLO_CENTER },
  { id: 'r2', label: 'Universidad Privada Antenor Orrego', address: 'Av. América Sur 3145, Trujillo', coords: [-8.1180, -79.0330] },
  { id: 'r3', label: 'Mallplaza Trujillo', address: 'Av. América Oeste, Trujillo', coords: [-8.1260, -79.0400] },
];

// Lugares frecuentes de Trujillo con coordenadas de referencia (aproximadas), para que la
// búsqueda encuentre resultados al instante sin depender de la red. Si el usuario escribe
// algo que no está aquí, se completa con geocodificación real (ver src/lib/geocode.js).
export const trujilloPlaces = [
  { id: 'plaza-armas', label: 'Plaza de Armas de Trujillo', address: 'Cercado de Trujillo', coords: TRUJILLO_CENTER },
  { id: 'upao', label: 'Universidad Privada Antenor Orrego (UPAO)', address: 'Av. América Sur 3145, Trujillo', coords: [-8.1180, -79.0330] },
  { id: 'unt', label: 'Universidad Nacional de Trujillo (UNT)', address: 'Av. Juan Pablo II, Trujillo', coords: [-8.0961, -79.0392] },
  { id: 'ucv', label: 'Universidad César Vallejo (UCV)', address: 'Av. Larco 1770, Trujillo', coords: [-8.1231, -79.0328] },
  { id: 'mallplaza', label: 'Mallplaza Trujillo', address: 'Av. América Oeste, Trujillo', coords: [-8.1260, -79.0400] },
  { id: 'real-plaza', label: 'Real Plaza Trujillo', address: 'Av. Juan Pablo II 132, Trujillo', coords: [-8.1187, -79.0233] },
  { id: 'terminal', label: 'Terminal Terrestre', address: 'Av. Túpac Amaru, Trujillo', coords: [-8.1050, -79.0180] },
  { id: 'huanchaco', label: 'Huanchaco', address: 'Balneario de Huanchaco, La Libertad', coords: [-8.0817, -79.1181] },
  { id: 'el-porvenir', label: 'El Porvenir', address: 'Distrito El Porvenir, Trujillo', coords: [-8.0972, -79.0083] },
  { id: 'la-esperanza', label: 'La Esperanza', address: 'Distrito La Esperanza, Trujillo', coords: [-8.0700, -79.0400] },
  { id: 'victor-larco', label: 'Víctor Larco Herrera', address: 'Distrito Víctor Larco, Trujillo', coords: [-8.1372, -79.0345] },
  { id: 'buenos-aires', label: 'Buenos Aires (playa)', address: 'Malecón Buenos Aires, Víctor Larco', coords: [-8.1550, -79.0500] },
  { id: 'florencia-mora', label: 'Florencia de Mora', address: 'Distrito Florencia de Mora, Trujillo', coords: [-8.0908, -79.0119] },
  { id: 'moche', label: 'Moche', address: 'Distrito Moche, Trujillo', coords: [-8.1900, -78.9950] },
  { id: 'salaverry', label: 'Salaverry', address: 'Distrito Salaverry, La Libertad', coords: [-8.2264, -78.9756] },
  { id: 'hospital-belen', label: 'Hospital Belén de Trujillo', address: 'Bolívar 350, Trujillo', coords: [-8.1130, -79.0270] },
  { id: 'hospital-regional', label: 'Hospital Regional Docente de Trujillo', address: 'Av. Mansiche 795, Trujillo', coords: [-8.1030, -79.0370] },
  { id: 'mercado-mayorista', label: 'Mercado Mayorista', address: 'Av. Túpac Amaru, Trujillo', coords: [-8.1010, -79.0170] },
];

// Rutas de transporte urbano con nombres de empresas reales que operan en Trujillo
// (fuente: registros públicos de transporte urbano de la ciudad). Los trazos (path) son
// aproximados para fines de visualización del prototipo — no son el trazo oficial exacto,
// pero sí conectan el centro con el distrito/destino real de cada empresa.
export const routes = [
  {
    id: 'huanchaco',
    code: 'H',
    company: 'Empresa de Transporte Huanchaco S.A. (ETHSA)',
    name: "Combi 'Huanchaco'",
    hacia: 'Huanchaco',
    destinations: ['huanchaco', 'balneario de huanchaco', 'malecón huanchaco', 'av. húsares de junín'],
    time: 35,
    cost: 2.0,
    walk: 3.2,
    paradero: 'Av. Húsares de Junín cdra. 5',
    color: '#EE9315',
    live: true,
    endpoint: [-8.0817, -79.1181],
    path: [
      [-8.1116, -79.0288],
      [-8.1050, -79.0450],
      [-8.0980, -79.0700],
      [-8.0900, -79.0950],
      [-8.0817, -79.1181],
    ],
  },
  {
    id: 'california',
    code: 'C',
    company: 'Empresa de Transporte California S.A. (E.T.C.S.A.)',
    name: "Micro 'California'",
    hacia: 'El Porvenir',
    destinations: ['el porvenir', 'av. cahuide', 'mercado el porvenir'],
    time: 20,
    cost: 1.5,
    walk: 2.0,
    paradero: 'Av. Cahuide cdra. 3',
    color: '#0F1B3D',
    live: false,
    endpoint: [-8.0972, -79.0083],
    path: [
      [-8.1116, -79.0288],
      [-8.1060, -79.0220],
      [-8.1010, -79.0150],
      [-8.0972, -79.0083],
    ],
  },
  {
    id: 'nuevos-girasoles',
    code: 'NG',
    company: 'Empresa de Transporte Nuevos Girasoles S.A.',
    name: "Micro 'Nuevos Girasoles'",
    hacia: 'La Esperanza',
    destinations: ['la esperanza', 'av. miguel grau', 'hospital regional'],
    time: 22,
    cost: 1.5,
    walk: 2.6,
    paradero: 'Av. Miguel Grau cdra. 10',
    color: '#64748B',
    live: true,
    endpoint: [-8.0700, -79.0400],
    path: [
      [-8.1116, -79.0288],
      [-8.1000, -79.0330],
      [-8.0850, -79.0370],
      [-8.0700, -79.0400],
    ],
  },
  {
    id: 'libertad',
    code: 'L',
    company: 'Empresa de Transporte y Servicios Libertad S.A.',
    name: "Micro 'Libertad'",
    hacia: 'Víctor Larco - Buenos Aires',
    destinations: ['victor larco', 'víctor larco', 'buenos aires', 'malecón buenos aires'],
    time: 28,
    cost: 2.0,
    walk: 3.0,
    paradero: 'Av. Larco cdra. 8',
    color: '#EE9315',
    live: false,
    endpoint: [-8.1550, -79.0500],
    path: [
      [-8.1116, -79.0288],
      [-8.1250, -79.0350],
      [-8.1400, -79.0430],
      [-8.1550, -79.0500],
    ],
  },
  {
    id: 'el-aguila',
    code: 'AG',
    company: 'Empresa de Transporte y Servicios Múltiples El Águila S.A.',
    name: "Micro 'El Águila'",
    hacia: 'UPAO - Av. América Sur',
    destinations: ['upao', 'universidad privada antenor orrego', 'av. américa sur', 'av. america sur'],
    time: 15,
    cost: 1.5,
    walk: 1.5,
    paradero: 'Av. América Sur cdra. 31',
    color: '#0F1B3D',
    live: true,
    endpoint: [-8.1180, -79.0330],
    path: [
      [-8.1116, -79.0288],
      [-8.1140, -79.0310],
      [-8.1165, -79.0330],
      [-8.1180, -79.0330],
    ],
  },
  {
    id: 'miramar',
    code: 'MR',
    company: 'Empresa de Transporte Miramar S.A.',
    name: "Micro 'Miramar'",
    hacia: 'Mallplaza - Av. América Oeste',
    destinations: ['mall', 'mallplaza', 'real plaza', 'av. américa oeste', 'av america oeste'],
    time: 18,
    cost: 1.5,
    walk: 2.1,
    paradero: 'Av. América Oeste cdra. 5',
    color: '#64748B',
    live: false,
    endpoint: [-8.1260, -79.0400],
    path: [
      [-8.1116, -79.0288],
      [-8.1170, -79.0340],
      [-8.1220, -79.0380],
      [-8.1260, -79.0400],
    ],
  },
  {
    id: 'salaverry-express',
    code: 'SE',
    company: 'Empresa de Transporte Salaverry Express S.A.',
    name: "Micro 'Salaverry Express'",
    hacia: 'Moche - Salaverry',
    destinations: ['moche', 'salaverry', 'huaca del sol', 'complejo arqueológico moche'],
    time: 30,
    cost: 2.5,
    walk: 2.8,
    paradero: 'Terminal Terrestre - Av. Túpac Amaru',
    color: '#EE9315',
    live: true,
    endpoint: [-8.19, -78.995],
    path: [
      [-8.1116, -79.0288],
      [-8.135, -79.018],
      [-8.165, -79.006],
      [-8.19, -78.995],
    ],
  },
];

export const savedRoutes = [
  { id: 'sr1', badge: 'LIBERTAD', title: 'Trabajo - El Porvenir - Victor Larco', avgTime: 25, live: true, savedLabel: 'EN VIVO' },
  { id: 'sr2', badge: 'EL ÍCARO', title: 'Casa - Esperanza - La Merced', avgTime: 40, live: false, savedLabel: 'GUARDADO HACE 2 DÍAS' },
  { id: 'sr3', badge: 'NUEVO CALIFORNIA', title: 'Universidad - UCV', avgTime: 15, live: false, savedLabel: 'FRECUENTE' },
];

export const incidentTypes = [
  { id: 'congestion', label: 'Congestión', icon: 'traffic' },
  { id: 'desvio', label: 'Desvío', icon: 'fork' },
  { id: 'lleno', label: 'Micro lleno', icon: 'users' },
  { id: 'trabajando', label: 'Hombres trabajando', icon: 'cone' },
  { id: 'accidente', label: 'Accidente', icon: 'alert' },
  { id: 'no_paso', label: 'No pasó', icon: 'clock' },
];

export const mockUser = {
  name: 'Usuario RutaYa',
  dni: '74218903',
  location: 'Trujillo, Perú',
  reportsSent: 12,
  savedRoutesCount: 8,
};
