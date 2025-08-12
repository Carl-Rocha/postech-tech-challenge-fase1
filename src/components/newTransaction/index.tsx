'use client';

import React, { useState } from 'react';
import styles from './newTransaction.module.css';
import CustomDropdown from '../custonDropdown';
import { Button, Input, Typography } from '@/design-system';

const transactionOptions = [
  { value: 'DEPOSITO', label: 'Depósito' },
  { value: 'TRANSFERENCIA', label: 'Transferência' },
];

interface NewTransactionProps {
  initial?: { type: string; amount: string };
  onSubmit?: (data: { type: string; amount: string }) => void;
}

const NewTransaction: React.FC<NewTransactionProps> = ({ initial, onSubmit }) => {
  const [selectedTransaction, setSelectedTransaction] = useState(initial?.type ?? '');
  const [amount, setAmount] = useState(initial?.amount ?? '');

  const handleTransactionSelect = (value: string) => {
    setSelectedTransaction(value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleTransactionSubmit = () => {
    const data = { type: selectedTransaction, amount };
    if (onSubmit) {
      onSubmit(data);
    } else {
      console.log('Transação a ser concluída:', data);
    }
  };

  return (
    <div>
      <div className={`${styles.newTransaction} bg-white p-8 rounded-lg shadow-lg flex-1 mt-6`}>
        <Typography as="h3" variant="heading" className="mb-6 text-gray-800">
          Nova transação
        </Typography>

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
            <Input
              type="text"
              placeholder="00,00"
              value={amount}
              onChange={handleAmountChange}
              className="w-100 bg-gray-100 border p-3 rounded-lg text-2xl font-bold text-gray-700"
            />
          </div>
        </div>

        <Button className="w-100 mt-4" onClick={handleTransactionSubmit}>
          Concluir transação
        </Button>
      </div>
    </div>
  );
};

export default NewTransaction;
