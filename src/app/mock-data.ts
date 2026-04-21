import { User, TicketType } from './app.models';

export const initialUsers: User[] = [
  { username: "admin", password: "admin123", name: "Administrador", role: "admin" as const },
  { username: "tecnico", password: "tecnico123", name: "Carlos Mendez", role: "tecnico" as const },
  { username: "tecnico2", password: "tecnico123", name: "Ana Torres", role: "tecnico" as const },
  { username: "tecnico3", password: "tecnico123", name: "Miguel Ruiz", role: "tecnico" as const },
  { username: "usuario", password: "usuario123", name: "Juan Pérez", role: "usuario" as const },
  { username: "maria", password: "maria123", name: "María García", role: "usuario" as const },
  { username: "pedro", password: "pedro123", name: "Pedro Martínez", role: "usuario" as const },
];

export const initialCategories = [
  { id: "hardware", name: "Hardware", label: "Hardware" },
  { id: "software", name: "Software", label: "Software" },
  { id: "red", name: "Red", label: "Red" },
  { id: "acceso", name: "Acceso", label: "Acceso" },
];

export const initialPriorities = [
  { id: "baja", name: "Baja", label: "Baja", color: "#10b981" },
  { id: "media", name: "Media", label: "Media", color: "#f59e0b" },
  { id: "alta", name: "Alta", label: "Alta", color: "#f97316" },
  { id: "critica", name: "Crítica", label: "Crítica", color: "#ef4444" },
];

export const initialTickets: TicketType[] = [
    {
    id: "TKT-2847",
    title: "Fallo en servidor de correo Exchange",
    description: "Los usuarios del departamento de ventas reportan que no pueden enviar correos desde hace 2 horas. El servidor Exchange muestra errores de conexión en los logs.",
    status: "en-proceso",
    priority: "critica",
    category: "red",
    assignedTo: "tecnico",
    createdBy: "usuario",
    createdAt: "2026-04-14 08:30",
    updatedAt: "2026-04-14 09:15",
    comments: [
      { id: "1", author: "usuario", authorRole: "usuario", message: "El problema persiste, necesito ayuda urgente", timestamp: "2026-04-14 09:15" }
    ],
    activities: [
      { id: "a1", type: "created", timestamp: "2026-04-14 08:30" },
      { id: "a2", type: "assigned", newValue: "tecnico", timestamp: "2026-04-14 08:35" },
      { id: "a3", type: "status_changed", oldValue: "nuevo", newValue: "en-proceso", timestamp: "2026-04-14 08:40" },
      { id: "a4", type: "comment", author: "usuario", authorRole: "usuario", message: "El problema persiste, necesito ayuda urgente", timestamp: "2026-04-14 09:15" }
    ]
  },
  {
    id: "TKT-2846",
    title: "Solicitud de acceso a carpeta compartida",
    description: "Usuario necesita permisos de lectura/escritura en la carpeta compartida 'Proyectos/Q2-2026' del servidor de archivos principal.",
    status: "en-proceso",
    priority: "baja",
    category: "acceso",
    assignedTo: "tecnico2",
    createdBy: "usuario",
    createdAt: "2026-04-14 07:45",
    updatedAt: "2026-04-14 08:00",
    comments: [],
    activities: [
      { id: "a5", type: "created", timestamp: "2026-04-14 07:45" },
      { id: "a6", type: "assigned", newValue: "tecnico2", timestamp: "2026-04-14 07:50" },
      { id: "a7", type: "status_changed", oldValue: "nuevo", newValue: "en-proceso", timestamp: "2026-04-14 08:00" }
    ]
  },
  {
    id: "TKT-2845",
    title: "Instalación de AutoCAD 2026",
    description: "El departamento de diseño requiere la instalación de AutoCAD 2026 en 5 estaciones de trabajo nuevas.",
    status: "nuevo",
    priority: "media",
    category: "software",
    createdBy: "usuario",
    createdAt: "2026-04-14 06:20",
    updatedAt: "2026-04-14 06:20",
    comments: [],
    activities: [
      { id: "a8", type: "created", timestamp: "2026-04-14 06:20" }
    ]
  },
  {
    id: "TKT-2844",
    title: "Teclado inalámbrico sin batería",
    description: "El teclado inalámbrico de la recepción necesita cambio de baterías. Modelo: Logitech MX Keys.",
    status: "resuelto",
    priority: "baja",
    category: "hardware",
    assignedTo: "tecnico3",
    createdBy: "usuario",
    createdAt: "2026-04-13 16:30",
    updatedAt: "2026-04-14 09:00",
    comments: [
      { id: "2", author: "tecnico3", authorRole: "tecnico", message: "Baterías reemplazadas. Problema resuelto.", timestamp: "2026-04-14 09:00" }
    ],
    activities: [
      { id: "a9", type: "created", timestamp: "2026-04-13 16:30" },
      { id: "a10", type: "assigned", newValue: "tecnico3", timestamp: "2026-04-13 16:35" },
      { id: "a11", type: "status_changed", oldValue: "nuevo", newValue: "en-proceso", timestamp: "2026-04-13 17:00" },
      { id: "a12", type: "comment", author: "tecnico3", authorRole: "tecnico", message: "Baterías reemplazadas. Problema resuelto.", timestamp: "2026-04-14 09:00" },
      { id: "a13", type: "status_changed", oldValue: "en-proceso", newValue: "resuelto", timestamp: "2026-04-14 09:00" }
    ]
  },
  {
    id: "TKT-2843",
    title: "VPN corporativa no conecta desde casa",
    description: "Empleado trabajando remotamente no puede establecer conexión VPN. Error: 'The remote connection was denied'. Ya se verificó usuario y contraseña.",
    status: "en-proceso",
    priority: "alta",
    category: "red",
    assignedTo: "tecnico2",
    createdBy: "usuario",
    createdAt: "2026-04-13 14:15",
    updatedAt: "2026-04-14 08:30",
    comments: [],
    activities: [
      { id: "a14", type: "created", timestamp: "2026-04-13 14:15" },
      { id: "a15", type: "assigned", newValue: "tecnico2", timestamp: "2026-04-14 08:00" },
      { id: "a16", type: "status_changed", oldValue: "nuevo", newValue: "en-proceso", timestamp: "2026-04-14 08:30" }
    ]
  },
  {
    id: "TKT-2842",
    title: "Actualización de RAM en workstation",
    description: "La estación de trabajo del departamento de video necesita upgrade de 16GB a 64GB de RAM para procesamiento de videos 4K.",
    status: "nuevo",
    priority: "media",
    category: "hardware",
    createdBy: "usuario",
    createdAt: "2026-04-13 11:00",
    updatedAt: "2026-04-13 11:00",
    comments: [],
    activities: [
      { id: "a17", type: "created", timestamp: "2026-04-13 11:00" }
    ]
  },
  {
    id: "TKT-2841",
    title: "Error en sistema de punto de venta",
    description: "Terminal 3 de punto de venta muestra error 'Database connection timeout' al procesar transacciones. Urgente, afecta ventas.",
    status: "en-proceso",
    priority: "critica",
    category: "software",
    assignedTo: "tecnico3",
    createdBy: "usuario",
    createdAt: "2026-04-13 10:45",
    updatedAt: "2026-04-14 08:15",
    comments: [],
    activities: [
      { id: "a18", type: "created", timestamp: "2026-04-13 10:45" },
      { id: "a19", type: "assigned", newValue: "tecnico3", timestamp: "2026-04-13 11:00" },
      { id: "a20", type: "status_changed", oldValue: "nuevo", newValue: "en-proceso", timestamp: "2026-04-14 08:15" }
    ]
  },
  {
    id: "TKT-2840",
    title: "Configuración de impresora de red",
    description: "Nueva impresora HP LaserJet Pro instalada en el piso 3. Necesita configuración de drivers y permisos de impresión para el departamento de marketing.",
    status: "resuelto",
    priority: "media",
    category: "hardware",
    assignedTo: "tecnico2",
    createdBy: "usuario",
    createdAt: "2026-04-12 15:30",
    updatedAt: "2026-04-13 10:00",
    comments: [],
    activities: [
      { id: "a21", type: "created", timestamp: "2026-04-12 15:30" },
      { id: "a22", type: "assigned", newValue: "tecnico2", timestamp: "2026-04-12 16:00" },
      { id: "a23", type: "status_changed", oldValue: "nuevo", newValue: "en-proceso", timestamp: "2026-04-12 16:30" },
      { id: "a24", type: "status_changed", oldValue: "en-proceso", newValue: "resuelto", timestamp: "2026-04-13 10:00" }
    ]
  },
  {
    id: "TKT-2839",
    title: "Contraseña de correo bloqueada",
    description: "Intenté iniciar sesión varias veces con mi contraseña y ahora mi cuenta de correo está bloqueada. No puedo acceder a mis emails.",
    status: "nuevo",
    priority: "alta",
    category: "acceso",
    createdBy: "maria",
    createdAt: "2026-04-14 10:15",
    updatedAt: "2026-04-14 10:15",
    comments: [],
    activities: [
      { id: "a25", type: "created", timestamp: "2026-04-14 10:15" }
    ]
  },
  {
    id: "TKT-2838",
    title: "Solicitud de licencia Microsoft Office",
    description: "Necesito una licencia de Microsoft Office para mi nueva estación de trabajo. Requiero Word, Excel y PowerPoint para mis tareas diarias.",
    status: "nuevo",
    priority: "media",
    category: "software",
    createdBy: "maria",
    createdAt: "2026-04-13 16:20",
    updatedAt: "2026-04-13 16:20",
    comments: [],
    activities: [
      { id: "a26", type: "created", timestamp: "2026-04-13 16:20" }
    ]
  },
  {
    id: "TKT-2837",
    title: "Monitor con pantalla parpadeante",
    description: "El monitor de mi escritorio comenzó a parpadear intermitentemente. Es muy molesto y me dificulta trabajar. Parece ser un problema de hardware.",
    status: "en-proceso",
    priority: "media",
    category: "hardware",
    assignedTo: "tecnico",
    createdBy: "pedro",
    createdAt: "2026-04-14 09:00",
    updatedAt: "2026-04-14 10:30",
    comments: [
      { id: "3", author: "tecnico", authorRole: "tecnico", message: "Revisando el monitor. Puede ser un problema del cable.", timestamp: "2026-04-14 10:30" }
    ],
    activities: [
      { id: "a27", type: "created", timestamp: "2026-04-14 09:00" },
      { id: "a28", type: "assigned", newValue: "tecnico", timestamp: "2026-04-14 09:15" },
      { id: "a29", type: "status_changed", oldValue: "nuevo", newValue: "en-proceso", timestamp: "2026-04-14 09:20" },
      { id: "a30", type: "comment", author: "tecnico", authorRole: "tecnico", message: "Revisando el monitor. Puede ser un problema del cable.", timestamp: "2026-04-14 10:30" }
    ]
  },
  {
    id: "TKT-2836",
    title: "Lentitud en el sistema operativo",
    description: "Mi computadora está muy lenta desde hace 2 días. Los programas tardan mucho en abrir y el sistema se congela constantemente.",
    status: "resuelto",
    priority: "baja",
    category: "software",
    assignedTo: "tecnico3",
    createdBy: "pedro",
    createdAt: "2026-04-12 14:00",
    updatedAt: "2026-04-13 11:30",
    comments: [
      { id: "4", author: "tecnico3", authorRole: "tecnico", message: "Realicé limpieza de disco y optimización. Sistema funcionando correctamente.", timestamp: "2026-04-13 11:30" },
      { id: "5", author: "pedro", authorRole: "usuario", message: "¡Muchas gracias! Funciona mucho mejor ahora.", timestamp: "2026-04-13 12:00" }
    ],
    activities: [
      { id: "a31", type: "created", timestamp: "2026-04-12 14:00" },
      { id: "a32", type: "assigned", newValue: "tecnico3", timestamp: "2026-04-12 15:00" },
      { id: "a33", type: "status_changed", oldValue: "nuevo", newValue: "en-proceso", timestamp: "2026-04-12 15:30" },
      { id: "a34", type: "comment", author: "tecnico3", authorRole: "tecnico", message: "Realicé limpieza de disco y optimización. Sistema funcionando correctamente.", timestamp: "2026-04-13 11:30" },
      { id: "a35", type: "status_changed", oldValue: "en-proceso", newValue: "resuelto", timestamp: "2026-04-13 11:30" },
      { id: "a36", type: "comment", author: "pedro", authorRole: "usuario", message: "¡Muchas gracias! Funciona mucho mejor ahora.", timestamp: "2026-04-13 12:00" }
    ]
  },
  {
    id: "TKT-2835",
    title: "No puedo conectarme a la red WiFi corporativa",
    description: "Desde esta mañana no puedo conectarme a la red WiFi de la oficina. Me aparece error de autenticación.",
    status: "cerrado",
    priority: "media",
    category: "red",
    assignedTo: "tecnico2",
    createdBy: "pedro",
    createdAt: "2026-04-11 08:45",
    updatedAt: "2026-04-11 10:15",
    comments: [
      { id: "6", author: "tecnico2", authorRole: "tecnico", message: "Ya restablecí las credenciales de red. Intenta conectarte de nuevo", timestamp: "2026-04-11 10:00" },
      { id: "7", author: "pedro", authorRole: "usuario", message: "Perfecto, ya estoy conectado. Gracias!", timestamp: "2026-04-11 10:15" }
    ],
    activities: [
      { id: "a37", type: "created", timestamp: "2026-04-11 08:45" },
      { id: "a38", type: "assigned", newValue: "tecnico2", timestamp: "2026-04-11 09:00" },
      { id: "a39", type: "status_changed", oldValue: "nuevo", newValue: "en-proceso", timestamp: "2026-04-11 09:15" },
      { id: "a40", type: "comment", author: "tecnico2", authorRole: "tecnico", message: "Ya restablecí las credenciales de red. Intenta conectarte de nuevo", timestamp: "2026-04-11 10:00" },
      { id: "a41", type: "status_changed", oldValue: "en-proceso", newValue: "resuelto", timestamp: "2026-04-11 10:00" },
      { id: "a42", type: "comment", author: "pedro", authorRole: "usuario", message: "Perfecto, ya estoy conectado. Gracias!", timestamp: "2026-04-11 10:15" },
      { id: "a43", type: "status_changed", oldValue: "resuelto", newValue: "cerrado", timestamp: "2026-04-11 10:15" }
    ]
  }
];