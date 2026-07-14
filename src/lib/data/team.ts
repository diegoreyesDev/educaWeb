import type { TeamArea } from '$lib/types';

/**
 * Datos reales del equipo del proyecto original.
 * 27 integrantes + Profesora supervisora + Desarrollador.
 */
export const teamData: TeamArea[] = [
  {
    area: 'LENGUAJE',
    miembros: [
      { nombre: 'Aylin Alfaro' },
      { nombre: 'Javiera Barriga' },
      { nombre: 'Constanza Castro' },
      { nombre: 'Catalina Mena' },
      { nombre: 'Evelin Timana' },
      { nombre: 'Estefany Toledo' }
    ]
  },
  {
    area: 'MATEMATICAS',
    miembros: [
      { nombre: 'Fernanda García' },
      { nombre: 'Dannae Gomez' },
      { nombre: 'Constanza Lara' },
      { nombre: 'Denisse Lara' },
      { nombre: 'Constantine Pizarro' },
      { nombre: 'Diego Reyes' }
    ]
  },
  {
    area: 'CIENCIAS',
    miembros: [
      { nombre: 'Jocelyn Alvarez' },
      { nombre: 'Adriana Duran' },
      { nombre: 'Valentina Fernández' },
      { nombre: 'Joselina Garrido' },
      { nombre: 'Pia Ortega' },
      { nombre: 'Marta Rayo' },
      { nombre: 'Claudia Segura' }
    ]
  },
  {
    area: 'HISTORIA',
    miembros: [
      { nombre: 'Krishna Andaur' },
      { nombre: 'Lisbeth Cornejo' },
      { nombre: 'Ambar Diaz' },
      { nombre: 'Therana Dubre' },
      { nombre: 'Pierangela Figueroa' },
      { nombre: 'Emilia Gonzalez' },
      { nombre: 'Kiara Morales' }
    ]
  }
];

export const profesora = 'Isabel Monsalvez';
export const desarrollador = 'Diego Reyes';
