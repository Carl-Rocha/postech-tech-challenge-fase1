'use client'
import React from 'react';
import styles from './newTransaction.module.css';

const NewTransaction: React.FC = () => {
  return (
    <div>
      <div className={`${styles.newTransaction} bg-white p-8 rounded-lg shadow-lg flex-1 mt-6`}>
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Nova transação</h3>
        <div className="mb-4">
          <select className={`${styles.selectTransaction} block w-full bg-gray-100 border border-gray-300 p-3 rounded-lg`}>
            <option defaultValue={"Selecione o tipo de transação"}>Selecione o tipo de transação</option>
            <option value="transferencia">Câmbio de moeda</option>
            <option value="deposito">DOC/TED</option>
            <option value="empréstimo">Empréstimo e Financiamento</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Valor</label>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="00,00"
              className={`${styles.inputValue} w-full bg-gray-100 border border-gray-300 p-3 rounded-lg text-2xl font-bold text-gray-700`}
            />
          </div>
        </div>
        <button className={`${styles.button} font-bold py-3 px-6 rounded-lg w-full mt-4`}>
          Concluir transação
        </button>
      </div>
    </div>
  );
};

export default NewTransaction;