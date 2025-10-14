import { Transaction } from '@/models/Transaction';

const STORAGE_KEY = 'transactions';
const API_URL = 'https://api.npoint.io/d8d6b9bdffdf768a34ce';

type TransactionDTO = {
  id: number;
  tipo: string;
  valor: number;
  data: string;
  categoria?: string;
  comprovanteBase64?: string;
};

export class TransactionService {
  private static normalizeCategoria(tipo: string, categoria?: string): string | undefined {
    if (categoria && categoria.trim().length > 0) {
      return categoria.trim();
    }

    if (tipo === 'DEPOSITO') {
      return 'Receitas gerais';
    }

    if (tipo === 'TRANSFERENCIA') {
      return 'Despesas gerais';
    }

    return categoria;
  }

  private static toTransaction(dto: TransactionDTO): Transaction {
    return new Transaction({
      id: dto.id,
      tipo: dto.tipo,
      valor: dto.valor,
      data: dto.data,
      categoria: this.normalizeCategoria(dto.tipo, dto.categoria),
      comprovanteBase64: dto.comprovanteBase64,
    });
  }

  private static async fetchFromApi(): Promise<Transaction[]> {
    const res = await fetch(API_URL, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Erro ao buscar transações');
    }
    const data = await res.json();
    return (data.transacao || []).map((t: TransactionDTO) => this.toTransaction(t));
  }

  static async getAll(): Promise<Transaction[]> {
    if (typeof window === 'undefined') {
      return this.fetchFromApi();
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: TransactionDTO[] = JSON.parse(stored);
      return parsed.map((dto) => this.toTransaction(dto));
    }
    const initial = await this.fetchFromApi();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        initial.map((transaction) => ({
          id: transaction.id,
          tipo: transaction.tipo,
          valor: transaction.valor,
          data: transaction.data,
          categoria: transaction.categoria,
          comprovanteBase64: transaction.comprovanteBase64,
        }))
      )
    );
    return initial;
  }

  static async getById(id: number): Promise<Transaction | undefined> {
    const all = await this.getAll();
    return all.find((t) => t.id === id);
  }

  static async add(transaction: Transaction): Promise<void> {
    const all = await this.getAll();
    all.push(transaction);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        all.map((t) => ({
          id: t.id,
          tipo: t.tipo,
          valor: t.valor,
          data: t.data,
          categoria: t.categoria,
          comprovanteBase64: t.comprovanteBase64,
        }))
      )
    );
  }

  static async update(transaction: Transaction): Promise<void> {
    const all = await this.getAll();
    const index = all.findIndex((t) => t.id === transaction.id);
    if (index !== -1) {
      all[index] = transaction;
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          all.map((t) => ({
            id: t.id,
            tipo: t.tipo,
            valor: t.valor,
            data: t.data,
            categoria: t.categoria,
            comprovanteBase64: t.comprovanteBase64,
          }))
        )
      );
    }
  }

  static async remove(id: number): Promise<void> {
    const all = await this.getAll();
    const filtered = all.filter((t) => t.id !== id);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        filtered.map((t) => ({
          id: t.id,
          tipo: t.tipo,
          valor: t.valor,
          data: t.data,
          categoria: t.categoria,
          comprovanteBase64: t.comprovanteBase64,
        }))
      )
    );
  }
}
