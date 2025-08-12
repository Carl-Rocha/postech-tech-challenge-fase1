export class Transaction {
  id: number;
  tipo: string;
  valor: number;
  data: string;

  constructor({ id, tipo, valor, data }: { id: number; tipo: string; valor: number; data: string; }) {
    this.id = id;
    this.tipo = tipo;
    this.valor = valor;
    this.data = data;
  }
}
