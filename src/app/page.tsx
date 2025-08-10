import NewTransaction from "@/components/newTransaction";
import CardExtrato from "../components/cardExtrato";
import CardSaldo from "../components/cardSaldo";
import { MenuCard } from "../components/menu";

interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  data: string;
  tipo: string;
}

interface Financeiro {
  nomeCliente: string;
  saldoTotal: number;
  dataAtualizacao: string;
  transacao: Transacao[];
}

async function buscarDadosFinanceiro(): Promise<Financeiro> {
  const res = await fetch(`https://api.npoint.io/d8d6b9bdffdf768a34ce`, {
    cache: 'no-store', // busca atualizado no SSR
  });

  if (!res.ok) {
    throw new Error('Erro ao buscar extrato');
  }

  return res.json();
}

export default async function Home() {
  const dadosFinanceiro: Financeiro = await buscarDadosFinanceiro();

  return (
    <div className="d-flex flex-column flex-md-row gap-3 mt-3">
      <div className="col-md-2">
        <MenuCard></MenuCard>
      </div>
      <div className="col-md-6">
        <CardSaldo saldoTotal={dadosFinanceiro.saldoTotal}></CardSaldo>
        <div className="mt-3">
          <NewTransaction></NewTransaction>
        </div>
      </div>
      <div className="col-md-4">
        <CardExtrato
          extrato={dadosFinanceiro.transacao.map((t) => ({
            ...t,
            tipo: t.tipo as "TRANSFERENCIA" | "DEPOSITO",
          }))}
        ></CardExtrato>
      </div>
    </div>
  );
}
