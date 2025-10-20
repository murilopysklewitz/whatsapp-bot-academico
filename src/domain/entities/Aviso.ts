
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

dayjs.extend(customParseFormat);

export class Aviso {
  constructor(
    public readonly id: number, 
    public readonly texto: string,
    public readonly data: string, 
    public readonly grupo: string,
    public readonly criadoEm: Date = new Date(), 
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.texto.trim()) {
      throw new Error('O texto do aviso não pode estar vazio.');
    }
    
    if (!this.isDataValida(this.data)) {
      throw new Error(`Data inválida: ${this.data}. Use o formato DD/MM`);
    }

    if (!this.grupo.trim()) {
      throw new Error('O grupo não pode estar vazio.');
    }
  }

  private isDataValida(data: string): boolean {

    const regex = /^(\d{1,2})\/(\d{1,2})$/;
    if (!regex.test(data)) return false;

    const [dia, mes] = data.split('/').map(Number);
    

    if (!dia || !mes || dia < 1 || dia > 31 || mes < 1 || mes > 12) {
      return false;
    }

    const ano = dayjs().year();
    const dataCompleta = dayjs(`${ano}-${mes}-${dia}`, 'YYYY-M-D', true);
    
    return dataCompleta.isValid();
  }

  static create(props: { 
    texto: string; 
    data: string; 
    grupo: string;
  }): Aviso {
    const id = Date.now(); 
    return new Aviso(id, props.texto, props.data, props.grupo);
  }

  getDataCompleta(): dayjs.Dayjs {
    const [dia, mes] = this.data.split('/').map(Number);
    const ano = dayjs().year();
    
    let data = dayjs(`${ano}-${mes}-${dia}`, 'YYYY-M-D');
    

    if (data.isBefore(dayjs(), 'day')) {
      data = data.add(1, 'year');
    }
    
    return data;
  }

  getDiasRestantes(): number {
    return this.getDataCompleta().diff(dayjs(), 'days');
  }

  isAtrasado(): boolean {
    return this.getDiasRestantes() < 0;
  }

  toJSON() {
    return {
      id: this.id,
      texto: this.texto,
      data: this.data,
      grupo: this.grupo,
      criadoEm: this.criadoEm.toISOString(),
    };
  }

  static fromJSON(json: any): Aviso {
    return new Aviso(
      json.id,
      json.texto,
      json.data,
      json.grupo,
      new Date(json.criadoEm),
    );
  }
}