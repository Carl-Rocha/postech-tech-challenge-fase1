'use client';
import styles from './cardSaldo.module.css'
import { useState } from 'react';

export default function CardSaldo() {
  const nome = 'Joana';
  const dataAtual = new Date();
  const [mostrarSaldo, setMostrarSaldo] = useState(true);
  const saldo = 2500.0;

  const dataFormatada = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dataAtual);

  return (
    <div className={styles.card}>
      <div className="row justify-content-between">
        <div className='col-md-12'>
          <h4>Olá, {nome}! :)</h4>
          <small>{dataFormatada}</small>
        </div>

        <div  className={styles.card_saldo}>
          <div>
            <div>
                <strong>Saldo</strong>
                <button
                className="btn btn-sm btn-outline-light"
                onClick={() => setMostrarSaldo(!mostrarSaldo)}
                title={mostrarSaldo ? 'Ocultar saldo' : 'Mostrar saldo'}
                >
                    <span className="material-icons">{mostrarSaldo ? 'visibility' : 'visibility_off'}</span>
                </button>
            </div>
            <div>
                <hr className="border-light border-opacity-50 my-1" />
                <small>Conta Corrente</small>
                <div className="fs-4 fw-semibold">
                    {mostrarSaldo
                    ? `R$ ${saldo.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        })}`
                    : '••••••••'}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
