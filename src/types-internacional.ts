export type Moneda = 'EUR' | 'GBP' | 'USD';

export interface ProgramaInternacional {
  id: string;
  universidad: string;
  pais: 'España' | 'Reino Unido' | 'Estados Unidos';
  tipoInstitucion: 'Pública' | 'Privada';
  modalidad: 'Online' | 'Híbrida';
  duracionAnios: number | null;
  costoTotal: number | null;
  costoAnual: number | null;
  moneda: Moneda;
  acreditacion: string | null;
  urlPrograma: string;
  tematica: string;
  verificado: string;
  notas?: string;
}
