"use client";

import React, { useMemo, useState } from "react";
import styles from "./newTransaction.module.css";
import CustomDropdown from "../custonDropdown";
import { Button, Input, Typography, Modal } from "@/design-system";
import { TransactionService } from "@/services/TransactionService";
import { Transaction } from "@/models/Transaction";

type TipoTransacao = "DEPOSITO" | "TRANSFERENCIA";

const transactionOptions = [
  { value: "DEPOSITO", label: "Depósito" },
  { value: "TRANSFERENCIA", label: "Transferência" }
] as const;

// Regras de dinheiro (formatação/parse em pt-BR)
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
  comprovanteBase64?: string;

  constructor(init?: { type?: string; amount?: string; comprovanteBase64?: string }) {
    if (
      init?.type &&
      (["DEPOSITO", "TRANSFERENCIA"] as const).includes(
        init.type as TipoTransacao
      )
    ) {
      this.tipo = init.type as TipoTransacao;
    }
    if (init?.amount) this.valorTexto = init.amount;
    if (init?.comprovanteBase64) this.comprovanteBase64 = init.comprovanteBase64;
  }

  setTipo(novo: string) {
    this.tipo = (novo as TipoTransacao) || "";
    return this;
  }
  setValorTexto(novo: string) {
    this.valorTexto = novo;
    return this;
  }
  setComprovanteBase64(novo?: string) {
    this.comprovanteBase64 = novo;
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
  toDTO(): { type: string; amount: string; comprovanteBase64?: string } {
    return { type: this.tipo, amount: this.valorTexto, comprovanteBase64: this.comprovanteBase64 };
  }
}

interface NewTransactionProps {
  isOpen: boolean;
  onClose: () => void;
  initial?: { type: string; amount: string; comprovanteBase64?: string };
  editingTransaction?: { id: string; type: string; amount: string; date: string; comprovanteBase64?: string };
  onSubmit?: (data: { type: string; amount: string; id?: string; comprovanteBase64?: string }) => void | Promise<void>;
  disabled?: boolean;
}

const NewTransaction: React.FC<NewTransactionProps> = ({
  isOpen,
  onClose,
  initial,
  editingTransaction,
  onSubmit,
  disabled = false,
}) => {
  const initialData = editingTransaction || initial;
  const initialVM = useMemo(() => new NewTransactionVM(initialData), [initialData]);
  const [vm, setVM] = useState<NewTransactionVM>(initialVM);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [comprovanteBase64, setComprovanteBase64] = useState<string | undefined>(
    initialData?.comprovanteBase64
  );

  React.useEffect(() => {
    if (isOpen) {
      const newVM = new NewTransactionVM(initialData);
      setVM(newVM);
      setErro(null);
      setComprovanteBase64(initialData?.comprovanteBase64);
    }
  }, [isOpen, initialData]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setComprovanteBase64(reader.result as string);
      setVM(vm => new NewTransactionVM({
        type: vm.tipo,
        amount: vm.valorTexto,
        comprovanteBase64: reader.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setComprovanteBase64(undefined);
    setVM(vm => new NewTransactionVM({
      type: vm.tipo,
      amount: vm.valorTexto,
      comprovanteBase64: undefined
    }));
  };

  const handleTransactionSubmit = async () => {
    setErro(null);
    if (!vm.valido) {
      setErro("Preencha tipo e um valor válido (ex.: 123,45).");
      return;
    }
    try {
      setEnviando(true);
      const submitData = {
        ...vm.toDTO(),
        id: editingTransaction?.id,
        comprovanteBase64,
      };
      if (onSubmit) await onSubmit(submitData);
      else console.log("Transação a ser concluída:", submitData);

      const newTransaction = new Transaction({
        id: Date.now(),
        tipo: vm.tipo,
        valor: vm.valorNumero,
        data: new Date().toISOString().split("T")[0],
        comprovanteBase64,
      });
      await TransactionService.add(newTransaction);

      onClose();
    } catch {
      setErro("Não foi possível salvar. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  const modalTitle = editingTransaction ? "Editar transação" : "Nova transação";
  const buttonText = editingTransaction ? "Salvar alterações" : "Concluir transação";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <div className={styles.newTransaction}>
        <div className="mb-4">
          <CustomDropdown
            items={[...transactionOptions]}
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
              placeholder="00,00"
              required
              id="valor"
              type="number"
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

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="comprovante"
          >
            Comprovante (imagem)
          </label>
          <Input
            id="comprovante"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={disabled || enviando}
            className="w-100 bg-gray-100 border p-2 rounded-lg"
          />
          {comprovanteBase64 && (
            <div className="mt-2">
              <div className="position-relative d-inline-block">
                <img
                  src={comprovanteBase64}
                  alt="Comprovante"
                  style={{ maxWidth: "100%", maxHeight: 180, borderRadius: 8 }}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="btn btn-danger btn-sm position-absolute"
                  style={{ top: 5, right: 5 }}
                  disabled={disabled || enviando}
                  title="Remover imagem"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="d-flex justify-content-between">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={enviando}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleTransactionSubmit}
            disabled={disabled || enviando}
          >
            {enviando ? "Salvando…" : buttonText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default NewTransaction;
