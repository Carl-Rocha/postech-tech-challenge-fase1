// components/NewTransaction.tsx
import React from 'react';

const NewTransaction: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg flex-1 mt-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Nova transação</h3>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Selecione o tipo de transação</label>
        <select className="block w-full bg-gray-100 border border-gray-300 p-3 rounded-lg">
          <option>Transferência</option>
          <option>Depósito</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Valor</label>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="00,00"
            className="w-full bg-gray-100 border border-gray-300 p-3 rounded-lg text-2xl font-bold text-gray-700"
          />
        </div>
      </div>
      <button className="bg-[#1f3f50] text-white font-bold py-3 px-6 rounded-lg w-full mt-4">
        Concluir transação
      </button>
    </div>
  );
};

export default NewTransaction;