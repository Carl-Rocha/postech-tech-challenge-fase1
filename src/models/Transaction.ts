export class Transaction {
  id: number;
  tipo: string;
  valor: number;
  data: string;
  categoria?: string;
  comprovanteBase64?: string;

  constructor({ id, tipo, valor, data, categoria, comprovanteBase64}: { id: number; tipo: string; valor: number; data: string; categoria?: string; comprovanteBase64?: string }) {
    this.id = id;
    this.tipo = tipo;
    this.valor = valor;
    this.data = data;
    this.categoria = categoria;
    this.comprovanteBase64 = comprovanteBase64;
  }
}
