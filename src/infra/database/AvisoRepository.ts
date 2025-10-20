// src/infra/database/JsonAvisoRepository.ts
import fs from "fs";
import path from "path";
import { Aviso } from "../../domain/entities/Aviso.js";
import { IAvisoRepository } from "../../domain/repo/IAvisoRepository.js";

export class AvisoRepository implements IAvisoRepository {
  private readonly filePath: string;

  constructor() {
    this.filePath = path.resolve("./src/storage.json");


    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]));
    }
  }

  private readFile(): Aviso[] {
    const data = fs.readFileSync(this.filePath, "utf-8");
    const json = JSON.parse(data);

    return json.map((item: any) => new Aviso(item.id, item.texto, item.data, item.grupo));
  }

  private writeFile(avisos: Aviso[]): void {
    fs.writeFileSync(this.filePath, JSON.stringify(avisos, null, 2));
  }

  async save(aviso: Aviso): Promise<void> {
    const avisos = this.readFile();
    avisos.push(aviso);
    this.writeFile(avisos);
  }

  async list(): Promise<Aviso[]> {
    return this.readFile();
  }
}
