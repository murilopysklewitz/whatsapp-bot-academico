import dayjs from "dayjs";

export class Aviso {
    constructor(
        public id: number,
        public data: string,
        public texto: string,
        public grupo: string,
    ){
        if (!texto.trim()) throw new Error('O texto do aviso não pode estar vazio.');
        if (!this.isDataValida(data)) throw new Error(`Data inválida: ${data}`);
    }
    private isDataValida(data: string): boolean {
        const [dia, mes] = data.split('/').map(Number);
        return (
          !isNaN(dia!) &&
          !isNaN(mes!) &&
          dia! >= 1 &&
          dia! <= 31 &&
          mes! >= 1 &&
          mes! <= 12
        );
      }
    
      static create({ texto, data, grupo }: { texto: string; data: string; grupo: string }): Aviso {
        return new Aviso(Date.now(), texto, data, grupo);
      }
}