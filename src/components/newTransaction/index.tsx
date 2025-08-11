'use client';

import React, { useState } from 'react';
import styles from './newTransaction.module.css';
import CustomDropdown from '../custonDropdown';

const transactionOptions = [
  { value: 'cambio', label: 'Câmbio de Moeda' },
  { value: 'docted', label: 'DOC/TED' },
  { value: 'emprestimo', label: 'Empréstimo e Financiamento' },
];

const NewTransaction: React.FC = () => {
  const [selectedTransaction, setSelectedTransaction] = useState('');
  const [amount, setAmount] = useState('');

  const handleTransactionSelect = (value: string) => {
    setSelectedTransaction(value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleTransactionSubmit = () => {
    console.log("Transação a ser concluída:", { selectedTransaction, amount });
    // Lógica para enviar a transação para o backend
  };

  return (
   <div>
      <div className={`${styles.newTransaction} bg-white p-8 rounded-lg shadow-lg flex-1 mt-6`}>
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Nova transação</h3>

      <div className="mb-4">
        <CustomDropdown
          items={transactionOptions}
          placeholder="Selecione o tipo de transação"
          onSelect={handleTransactionSelect}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Valor</label>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="00,00"
            value={amount}
            onChange={handleAmountChange}
            className={`${styles.inputValue} w-full bg-gray-100 border p-3 rounded-lg text-2xl font-bold text-gray-700`}
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