import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { users } from '@/server/store';
import { config } from '@/config/env';

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, config.JWT_SECRET) as any;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ message: 'Token inválido ou expirado' }, { status: 401 });
    }

    const { oldPassword, newPassword } = await request.json();
    if (!oldPassword || !newPassword) {
      return NextResponse.json({ message: 'Campos obrigatórios ausentes' }, { status: 400 });
    }

    const user = users.find(u => u.id === decoded.userId);
    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });
    }

    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) {
      return NextResponse.json({ message: 'Senha atual incorreta' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    return NextResponse.json({ message: 'Senha alterada com sucesso' });
  } catch (e) {
    console.error('Erro ao trocar senha', e);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}

