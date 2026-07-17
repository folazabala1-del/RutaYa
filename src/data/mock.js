// Centro de Trujillo (Plaza de Armas) como referencia
export const TRUJILLO_CENTER = [-8.1116, -79.0288];

export const savedPlaces = [
  { id: 'casa', label: 'Casa', address: 'Calle Los Pinos 123', icon: 'home', coords: [-8.1050, -79.0400] },
  { id: 'trabajo', label: 'Trabajo', address: 'Centro Histórico', icon: 'briefcase', coords: [-8.1116, -79.0288] },
  { id: 'universidad', label: 'Universidad Nacional', address: 'Av. Juan Pablo II, Trujillo', icon: 'cap', coords: [-8.0950, -79.0450] },
  { id: 'mall', label: 'Mall', address: 'Mall Plaza Trujillo', icon: 'bag', coords: [-8.1250, -79.0150] },
];

export const recentPlaces = [
  { id: 'r1', label: 'Plaza de Armas de Trujillo', address: 'Cercado de Trujillo, Trujillo 13001', coords: TRUJILLO_CENTER },
  { id: 'r2', label: 'Universidad Privada Antenor Orrego', address: 'Av. América Sur 3145', coords: [-8.1180, -79.0330] },
  { id: 'r3', label: 'Mallplaza Trujillo', address: 'Av. América Oeste', coords: [-8.1260, -79.0400] },
];

export const routes = [
  {
    id: 'h',
    code: 'H',
    name: "Micro 'Huanchaco' - H",
    hacia: 'Universidad Privada Antenor Orrego',
    time: 25,
    cost: 1.00,
    walk: 4.1,
    paradero: 'Av. América Sur 3145',
    color: '#EE9315',
    live: true,
    fastest: true,
    path: [
      [-8.1116, -79.0288],
      [-8.1140, -79.0310],
      [-8.1165, -79.0330],
      [-8.1180, -79.0330],
    ],
  },
  {
    id: 'c2',
    code: 'C2',
    name: "Micro 'Libertad' - C2",
    hacia: 'Universidad Privada Antenor Orrego',
    time: 25,
    cost: 1.30,
    walk: 4.1,
    paradero: 'Av. América Sur 3145',
    color: '#64748B',
    live: false,
    fastest: false,
    path: [
      [-8.1116, -79.0288],
      [-8.1130, -79.0350],
      [-8.1160, -79.0360],
      [-8.1180, -79.0330],
    ],
  },
  {
    id: 'ni',
    code: 'M-14',
    name: "Micro 'El Ícaro'",
    hacia: 'Vía Av. Los Incas - Chicago',
    time: 18,
    cost: 1.00,
    walk: 2.3,
    paradero: 'Jr. Pizarro 450',
    color: '#0F1B3D',
    live: true,
    fastest: false,
    path: [
      [-8.1116, -79.0288],
      [-8.1080, -79.0250],
      [-8.1040, -79.0220],
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
