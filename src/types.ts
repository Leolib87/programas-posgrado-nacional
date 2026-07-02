export interface ProgramaDoctorado {
  id: string;
  universidad: string;
  tipoInstitucion: 'Pública' | 'Privada';
  ciudad: string;
  region: string;
  modalidad: 'Presencial' | 'Online' | 'Híbrida';
  duracionSemestres: number;
  duracionAnios: number;
  arancelAnual: number | null;
  matricula: number | null;
  acreditadoHasta: string | null;
  vacantes: number | null;
  jornada: 'Completa' | 'Parcial';
  urlPrograma: string;
  tematica: string;
  verificado: string;
}
