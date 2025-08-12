import { Transaction } from '@/models/Transaction';

const STORAGE_KEY = 'transactions';
const API_URL = 'https://api.npoint.io/d8d6b9bdffdf768a34ce';

export class TransactionService {
  private static async fetchFromApi(): Promise<Transaction[]> {
    const res = await fetch(API_URL, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Erro ao buscar transações');
    }
    const data = await res.json();
    type TransactionDTO = { id: number; tipo: string; valor: number; data: string };
    return (data.transacao || []).map(
      (t: TransactionDTO) => new Transaction({ id: t.id, tipo: t.tipo, valor: t.valor, data: t.data })
    );
  }

  static async getAll(): Promise<Transaction[]> {
    if (typeof window === 'undefined') {
      return this.fetchFromApi();
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    const initial = await this.fetchFromApi();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  static async getById(id: number): Promise<Transaction | undefined> {
    const all = await this.getAll();
    return all.find((t) => t.id === id);
  }

  static async add(transaction: Transaction): Promise<void> {
    const all = await this.getAll();
    all.push(transaction);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }

  static async update(transaction: Transaction): Promise<void> {
    const all = await this.getAll();
    const index = all.findIndex((t) => t.id === transaction.id);
    if (index !== -1) {
      all[index] = transaction;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    }
  }

  static async remove(id: number): Promise<void> {
    const all = await this.getAll();
    const filtered = all.filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
}
