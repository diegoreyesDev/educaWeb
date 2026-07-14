export interface Activity {
  id: string;
  nivel: '1basico' | '2basico' | '3basico' | '4basico' | '5basico' | '6basico';
  asignatura: 'lenguaje' | 'matematicas' | 'ciencias' | 'historia';
  titulo: string;
  descripcion: string;
  url: string;
  embedUrl: string;
  miniatura: string;
  icono?: string;
}

export type Nivel = Activity['nivel'];
export type Asignatura = Activity['asignatura'];

export const NIVELES: { id: Nivel; label: string }[] = [
  { id: '1basico', label: '1° Básico' },
  { id: '2basico', label: '2° Básico' },
  { id: '3basico', label: '3° Básico' },
  { id: '4basico', label: '4° Básico' },
  { id: '5basico', label: '5° Básico' },
  { id: '6basico', label: '6° Básico' }
];

export const ASIGNATURAS: { id: Asignatura; label: string; color: string }[] = [
  { id: 'lenguaje', label: 'Lenguaje', color: 'bg-red-100 text-red-800' },
  { id: 'matematicas', label: 'Matemáticas', color: 'bg-blue-100 text-blue-800' },
  { id: 'ciencias', label: 'Ciencias', color: 'bg-green-100 text-green-800' },
  { id: 'historia', label: 'Historia', color: 'bg-amber-100 text-amber-800' }
];

export interface TeamMember {
  nombre: string;
  area?: string;
}

export interface TeamArea {
  area: string;
  miembros: TeamMember[];
}
