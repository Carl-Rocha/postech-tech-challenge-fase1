'use client';

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
    <div className="card bg-primary text-white rounded-3 p-4 w-100">
      <div className="d-flex justify-content-between align-items-start flex-wrap">
        {/* Saudação */}
        <div>
          <h4>Olá, {nome}! :)</h4>
          <small>{dataFormatada}</small>
        </div>

        {/* Saldo */}
        <div className="text-end mt-3 mt-md-0">
          <div className="d-flex align-items-center gap-2 justify-content-end">
            <strong>Saldo</strong>
            <button
              className="btn btn-sm btn-outline-light"
              onClick={() => setMostrarSaldo(!mostrarSaldo)}
              title={mostrarSaldo ? 'Ocultar saldo' : 'Mostrar saldo'}
            >
                <i className={mostrarSaldo ? 'bi bi-eye' : 'bi bi-eye-slash'}></i>
            </button>
          </div>
          <hr className="border-light border-opacity-50 my-2" />
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
  );
}
