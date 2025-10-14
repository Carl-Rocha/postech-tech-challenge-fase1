import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';

// Simulando dados de transações (em produção, use um banco real)
const transactions: Array<{
  id: string;
  accountId: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: Date;
  balance: number;
}> = [];

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, config.JWT_SECRET) as any;
  } catch (error) {
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { accountId: string } }
) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { message: 'Token inválido ou expirado' },
        { status: 401 }
      );
    }

    const { accountId } = params;

    // Buscar transações da conta
    const accountTransactions = transactions
      .filter(transaction => transaction.accountId === accountId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Se não há transações, criar algumas de exemplo
    if (accountTransactions.length === 0) {
      const sampleTransactions = [
        {
          id: '1',
          accountId,
          type: 'credit' as const,
          amount: 1000.00,
          description: 'Depósito inicial',
          date: new Date(),
          balance: 1000.00,
        },
        {
          id: '2',
          accountId,
          type: 'debit' as const,
          amount: 50.00,
          description: 'Compra no supermercado',
          date: new Date(Date.now() - 86400000), // 1 dia atrás
          balance: 950.00,
        },
        {
          id: '3',
          accountId,
          type: 'credit' as const,
          amount: 200.00,
          description: 'Transferência recebida',
          date: new Date(Date.now() - 172800000), // 2 dias atrás
          balance: 1150.00,
        },
      ];

      transactions.push(...sampleTransactions);
      accountTransactions.push(...sampleTransactions);
    }

    return NextResponse.json({
      message: 'Extrato encontrado',
      result: accountTransactions,
    });

  } catch (error) {
    console.error('Erro ao buscar extrato:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
