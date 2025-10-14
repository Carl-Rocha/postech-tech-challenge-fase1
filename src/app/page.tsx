"use client";

import { useEffect, useState } from "react";
import { Transaction } from "@/models/Transaction";
import { TransactionService } from "@/services/TransactionService";
import Link from 'next/link';
import Image from "next/image";
import { Button, Card } from "@/design-system";
import InsertChartOutlinedRoundedIcon from '@mui/icons-material/InsertChartOutlinedRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import FeedRoundedIcon from '@mui/icons-material/FeedRounded';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    TransactionService.getAll().then(setTransactions);
  }, []);

  const saldo = transactions.reduce(
    (acc, t) => acc + (t.tipo === "DEPOSITO" ? t.valor : -t.valor),
    0
  );

  const handleNewTransaction = async ({
    type,
    amount,
  }: {
    type: string;
    amount: string;
  }) => {
    const newTransaction = new Transaction({
      id: Date.now(),
      tipo: type,
      valor: parseFloat(amount),
      data: new Date().toISOString().split("T")[0],
    });
    await TransactionService.add(newTransaction);
    setTransactions((prev) => [...prev, newTransaction]);
  };

  const handleDelete = async (id: number) => {
    await TransactionService.remove(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-12 col-md-6 text-center text-md-start mb-4 mb-md-0">
            <h1 className="fw-bold text-primary mb-3">Bytebank</h1>
            <h4 className="mb-3">
              Experimente mais liberdade no controle da sua vida financeira.
            </h4>
            <p className="mb-4">
              Gerencie suas transações financeiras de forma rápida e intuitiva.
              Sem complicações, sem taxas escondidas e totalmente do seu jeito.
            </p>
            <Button className=" btn-lg fw-bold px-4 shadow" onClick={() => {
              window.location.href = '/register';
            }}>
              Abrir Minha Conta
            </Button>
          </div>

          {/* Imagem */}
          <div className="col-12 col-md-6 text-center">
            <div className="d-flex align-items-center justify-content-center" style={{ height: 400 }}>
              <div className="text-center">
                <Image
                  src="/images/online-banking.svg"
                  alt="Online Banking"
                  width={400}
                  height={400}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Serviços */}
        <div className="text-center">
          <h2 className="mb-4">Nossos Serviços</h2>
          <div className="row g-4">
            <div className="col-12 col-md-4">
              <Card className="p-4 shadow">
                <div className="mb-3">
                  <FeedRoundedIcon color="primary" style={{ fontSize: 64 }} />
                </div>
                <h5 className="mb-2">Gestão de Gastos e Receitas</h5>
                <p>
                  Registre e organize suas transações com categorias personalizadas e 
                  acompanhe tudo em um só lugar.
                </p>
              </Card>
            </div>

            <div className="col-12 col-md-4">
              <Card className="p-4 shadow">
                <div className="mb-3">
                  <InsertChartOutlinedRoundedIcon color="primary" style={{ fontSize: 64 }} />
                </div>
                <h5 className="mb-2">Relatórios e Gráficos Inteligentes</h5>
                <p>
                  Visualize suas finanças com relatórios detalhados e gráficos claros.
                </p>
              </Card>
            </div>

            <div className="col-12 col-md-4">
              <Card className="p-4 shadow">
                <div className="mb-3">
                  <PaidRoundedIcon color="primary" style={{ fontSize: 64 }} />
                </div>
                <h5 className="mb-2">Planejamento Financeiro</h5>
                <p>
                  Defina metas de economia e acompanhe seu progresso para alcançar seus objetivos
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <footer className="bg-light py-5 mt-5">
        <div className="container">
          <div className="row">
            {/* Logo e descrição */}
            <div className="col-12 col-md-4 mb-4 mb-md-0">
              <h3 className="text-primary fw-bold mb-3">Bytebank</h3>
            </div>
            
            {/* Links úteis */}
            <div className="col-12 col-md-4 mb-4 mb-md-0">
              <h5 className="fw-bold mb-3">Serviços</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="#" className="text-decoration-none text-muted">Conta Corrente</a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-decoration-none text-muted">Conta PJ</a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-decoration-none text-muted">Canal de Ética</a>
                </li>
              </ul>
            </div>
            
            {/* Contato */}
            <div className="col-12 col-md-4">
              <h5 className="fw-bold mb-3">Contato</h5>
              <ul className="list-unstyled">
                <li className="mb-2 text-muted">
                  <i className="bi bi-envelope me-2"></i>
                  meajuda@bytebank.com.br
                </li>
                <li className="mb-2 text-muted">
                  <i className="bi bi-link-45deg me-2"></i>
                  ouvidoria@bytebank.com.br
                </li>
              </ul>
            </div>
          </div>
          
          <hr className="my-4" />
          
          {/* Direitos autorais */}
          <div className="row align-items-center">
            <div className="col-12 col-md-6 text-center text-md-start mb-3 mb-md-0">
              <p className="text-muted mb-0">© Bytebank - Todos os direitos reservados</p>
            </div>
            <div className="col-12 col-md-6 text-center text-md-end">
              <p className="text-muted mb-0">800004 25008</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
