import styles from './cardExtrato.module.css'

export interface IExtrato {
  valor: number;
  data: string;
  tipo: 'TRANSFERENCIA' | 'DEPOSITO';
}

function ordenarExtartoMes(extrato: Array<IExtrato>) {
  const extratoMes = extrato.reduce((listaExtratoMes: any, extrato: any) => {
    const date = new Date(extrato.data);
    const mesExtrato = date.toLocaleString('pt-BR', { month: 'long' });
    const grupoMes = listaExtratoMes.find((extrato: any) => extrato.mesExtrato == mesExtrato);
    const [ano, mes, dia] = extrato.data.split('-');
    extrato.dataPtBr = `${dia}/${mes}/${ano}`
    
    if(grupoMes){
      grupoMes.extratos.push(extrato);
    } else{
      listaExtratoMes.push({
        mesExtrato, extratos: [extrato]
      })
    }

    return listaExtratoMes;
  }, [])

  return extratoMes;
}

export default function CardExtrato(props: {extrato: Array<IExtrato>}) {
  const listaExtrato = ordenarExtartoMes(props.extrato) ?? [];
  return (
    <div className={styles.card}>
      <div className="d-flex justify-content-between mb-2">
        <h4>Extrato</h4>
        <div>
          <button className="btn btn-sm rounded-pill me-2" title="Editar">
              <span className="material-icons">edit</span>
          </button>
          <button className="btn btn-sm rounded-pill" title="Excluir">
              <span className="material-icons">delete</span>
          </button>
        </div>
      </div>
          {listaExtrato.map((extratoMes: any) => (
            <div className={styles.card_extrato}>
              <strong>{extratoMes.mesExtrato}</strong>
                {extratoMes.extratos.map((extrato: any) => (
                    <div className={styles.card_extrato_detalhe}>
                      <div className={styles.card_extrato_valor}>
                        <span>{extrato.tipo}</span>
                        <h6>{extrato.tipo == 'Depósito' ? '- R$ ' : 'R$ '}{extrato.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h6>
                      </div>
                      <span className='text-secondary'>{extrato.dataPtBr}</span>
                    </div>
                ))}
            </div>
          ))}
    </div>
  );
}
