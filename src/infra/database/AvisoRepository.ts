
import fs from "fs/promises"; 
import fsSync from "fs";
import path from "path";
import { Aviso } from "../../domain/entities/Aviso.js";
import { IAvisoRepository } from "../../domain/repo/IAvisoRepository.js";

export class JsonAvisoRepository implements IAvisoRepository {
  private readonly filePath: string;

  constructor(filePath: string = "./storage/avisos.json") {
    this.filePath = path.resolve(filePath);
    this.ensureFileExists();
  }

  private ensureFileExists(): void {
    const dir = path.dirname(this.filePath);
    
    if (!fsSync.existsSync(dir)) {
      fsSync.mkdirSync(dir, { recursive: true });
    }

    if (!fsSync.existsSync(this.filePath)) {
      fsSync.writeFileSync(this.filePath, JSON.stringify([], null, 2));
    }
  }

  private async readFile(): Promise<Aviso[]> {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      const json = JSON.parse(data);
      return json.map((item: any) => Aviso.fromJSON(item));
    } catch (error) {
      console.error('Erro ao ler arquivo:', error);
      return [];
    }
  }

  private async writeFile(avisos: Aviso[]): Promise<void> {
    try {
      const json = avisos.map(a => a.toJSON());
      await fs.writeFile(this.filePath, JSON.stringify(json, null, 2));
    } catch (error) {
      console.error('Erro ao escrever arquivo:', error);
      throw new Error('Falha ao salvar aviso');
    }
  }

  async save(aviso: Aviso): Promise<void> {
    const avisos = await this.readFile();
    avisos.push(aviso);
    await this.writeFile(avisos);
  }

  async list(): Promise<Aviso[]> {
    return this.readFile();
  }

  async listByGrupo(grupoId: string): Promise<Aviso[]> {
    const avisos = await this.readFile();
    return avisos.filter(a => a.grupo === grupoId);
  }

  async delete(id: number): Promise<boolean> {
    const avisos = await this.readFile();
    const index = avisos.findIndex(a => a.id === id);
    
    if (index === -1) return false;
    
    avisos.splice(index, 1);
    await this.writeFile(avisos);
    return true;
  }

  async findById(id: number): Promise<Aviso | null> {
    const avisos = await this.readFile();
    return avisos.find(a => a.id === id) || null;
  }

  async deleteOldAvisos(diasAtras: number = 30): Promise<number> {
    const avisos = await this.readFile();
    const limite = new Date();
    limite.setDate(limite.getDate() - diasAtras);
    
    const avisosAtivos = avisos.filter(a => {
      const criadoEm = new Date(a.criadoEm);
      return criadoEm > limite;
    });
    
    const deletados = avisos.length - avisosAtivos.length;
    
    if (deletados > 0) {
      await this.writeFile(avisosAtivos);
    }
    
    return deletados;
  }
}