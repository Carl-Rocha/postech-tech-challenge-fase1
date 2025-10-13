export class Transaction {
  id: number;
  tipo: string;
  valor: number;
  data: string;
  comprovanteBase64?: string;

  constructor({ id, tipo, valor, data, comprovanteBase64}: { id: number; tipo: string; valor: number; data: string; comprovanteBase64?: string }) {
    this.id = id;
    this.tipo = tipo;
    this.valor = valor;
    this.data = data;
    this.comprovanteBase64 = comprovanteBase64;
  }
}
