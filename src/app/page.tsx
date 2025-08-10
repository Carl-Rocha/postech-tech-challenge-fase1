import CardExtrato from "../components/cardExtrato";
import CardSaldo from "../components/cardSaldo";

interface Financeiro {
  nomeCliente: string;
  saldoTotal: number;
  dataAtualizacao: string;
  transacao: any;
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
      <div className="col-md-8">
        <CardSaldo saldoTotal={dadosFinanceiro.saldoTotal} nomeCliente={dadosFinanceiro.nomeCliente}></CardSaldo>
      </div>
      <div className="col-md-4">
        <CardExtrato extrato={dadosFinanceiro.transacao}></CardExtrato>
      </div>
    </div>
  );
}
