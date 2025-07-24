'use client';
import styles from './cardExtrato.module.css'
import { useState } from 'react';

export default function CardExtrato() {
  const nome = 'Joana';
  const dataAtual = new Date();
  const [mostrarSaldo, setMostrarSaldo] = useState(true);
  const saldo = 2500.0;


  return (
    <div className={styles.card}>
      <div className="d-flex justify-content-between mb-2">
        <h4>Extrato</h4>
        <div>
          <button className="btn btn-sm btn-outline-light" title="Editar">
              <span className="material-icons">edit</span>
          </button>
          <button className="btn btn-sm btn-outline-light" title="Excluir">
              <span className="material-icons">delete</span>
          </button>
        </div>
      </div>
      <div className={styles.card_extrato}>
        <strong>Setembro</strong>
        <div className={styles.card_extrato_detalhe}>
          <div className={styles.card_extrato_valor}>
            <span>Transferencia</span>
            <span>RS 36,00</span>
          </div>
          <span>04/09</span>
        </div>
      </div>
    </div>
  );
}
