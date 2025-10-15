import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';

// Simulando dados de conta (em produção, use um banco real)
const accounts: Array<{
  id: string;
  userId: string;
  balance: number;
  accountNumber: string;
  createdAt: Date;
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

export async function GET(request: NextRequest) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { message: 'Token inválido ou expirado' },
        { status: 401 }
      );
    }

    // Buscar ou criar conta para o usuário
    let account = accounts.find(acc => acc.userId === decoded.userId);
    
    if (!account) {
      // Criar nova conta se não existir
      account = {
        id: Date.now().toString(),
        userId: decoded.userId,
        balance: 1000.00, // Saldo inicial
        accountNumber: `000${Date.now().toString().slice(-6)}`,
        createdAt: new Date(),
      };
      accounts.push(account);
    }

    return NextResponse.json({
      message: 'Conta encontrada',
      result: {
        id: account.id,
        balance: account.balance,
        accountNumber: account.accountNumber,
        userId: account.userId,
      },
    });

  } catch (error) {
    console.error('Erro ao buscar conta:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
