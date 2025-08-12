"use client";

import React, { useMemo, useState } from "react";
import styles from "./newTransaction.module.css";
import CustomDropdown from "../custonDropdown";
import { Button, Input, Typography } from "@/design-system";

type TipoTransacao = "DEPOSITO" | "TRANSFERENCIA" | "DOC" | "PIX";

const transactionOptions = [
  { value: "DEPOSITO", label: "Depósito" },
  { value: "TRANSFERENCIA", label: "Transferência" },
  { value: "DOC", label: "DOC" },
  { value: "PIX", label: "PIX" },
] as const;

//adicionado regras de dinehiro Brasil
class Dinheiro {
  static parseBR(texto: string): number {
    if (!texto) return NaN;
    const limpo = texto.replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
    return Number(limpo);
  }
  static formatBR(valor: number): string {
    if (!Number.isFinite(valor)) return "";
    return valor.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}

class NewTransactionVM {
  tipo: TipoTransacao | "" = "";
  valorTexto = "";

  constructor(init?: { type?: string; amount?: string }) {
    if (
      init?.type &&
      (["DEPOSITO", "TRANSFERENCIA", "DOC", "PIX"] as const).includes(
        init.type as any
      )
    ) {
      this.tipo = init.type as TipoTransacao;
    }
    if (init?.amount) this.valorTexto = init.amount;
  }

  setTipo(novo: string) {
    this.tipo = (novo as TipoTransacao) || "";
    return this;
  }
  setValorTexto(novo: string) {
    this.valorTexto = novo;
    return this;
  }
  get valorNumero(): number {
    return Dinheiro.parseBR(this.valorTexto);
  }
  get valido(): boolean {
    return (
      !!this.tipo &&
      Number.isFinite(this.valorNumero) &&
      this.valorNumero >= 0.01
    );
  }
  toDTO(): { type: string; amount: string } {
    return { type: this.tipo, amount: this.valorTexto };
  }
}

interface NewTransactionProps {
  initial?: { type: string; amount: string };
  onSubmit?: (data: { type: string; amount: string }) => void | Promise<void>;
  disabled?: boolean;
}

const NewTransaction: React.FC<NewTransactionProps> = ({
  initial,
  onSubmit,
  disabled = false,
}) => {
  const initialVM = useMemo(() => new NewTransactionVM(initial), [initial]);
  const [vm, setVM] = useState<NewTransactionVM>(initialVM);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const handleTransactionSelect = (value: string) => {
    setVM(new NewTransactionVM({ type: value, amount: vm.valorTexto }));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVM(
      new NewTransactionVM({
        type: vm.tipo,
        amount: vm.valorTexto,
      }).setValorTexto(e.target.value)
    );
  };

  const handleTransactionSubmit = async () => {
    setErro(null);
    if (!vm.valido) {
      setErro("Preencha tipo e um valor válido (ex.: 123,45).");
      return;
    }
    try {
      setEnviando(true);
      if (onSubmit) await onSubmit(vm.toDTO());
      else console.log("Transação a ser concluída:", vm.toDTO());
    } catch {
      setErro("Não foi possível salvar. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div>
      <div
        className={`${styles.newTransaction} bg-white p-8 rounded-lg shadow-lg flex-1 mt-6`}
      >
        <Typography as="h3" variant="heading" className="mb-6 text-gray-800">
          Nova transação
        </Typography>

        <div className="mb-4">
          <CustomDropdown
            items={transactionOptions as any}
            placeholder="Selecione o tipo de transação"
            onSelect={handleTransactionSelect}
            value={vm.tipo}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="valor"
          >
            Valor
          </label>
          <div className="flex items-center">
            <Input
              id="valor"
              type="text"
              placeholder="0,00"
              value={vm.valorTexto}
              onChange={handleAmountChange}
              disabled={disabled || enviando}
              className="w-100 bg-gray-100 border p-3 rounded-lg text-2xl font-bold text-gray-700"
              aria-invalid={!!erro}
            />
          </div>
          {erro && (
            <Typography as="p" className="mt-2 text-red-600" role="alert">
              {erro}
            </Typography>
          )}
        </div>

        <Button
          className="w-100 mt-4"
          onClick={handleTransactionSubmit}
          disabled={disabled || enviando}
        >
          {enviando ? "Salvando…" : "Concluir transação"}
        </Button>
      </div>
    </div>
  );
};

export default NewTransaction;
