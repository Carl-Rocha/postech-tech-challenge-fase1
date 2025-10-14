"use client";

import React, { useMemo, useState } from "react";
import styles from "./newTransaction.module.css";
import CustomDropdown from "../custonDropdown";
import { Button, Input, Typography, Modal } from "@/design-system";
import { TransactionService } from "@/services/TransactionService";
import { Transaction } from "@/models/Transaction";
import { Autocomplete, TextField } from "@mui/material";

type TipoTransacao = "DEPOSITO" | "TRANSFERENCIA";

const transactionOptions = [
  { value: "DEPOSITO", label: "Depósito" },
  { value: "TRANSFERENCIA", label: "Transferência" }
] as const;

const CATEGORY_SUGGESTIONS: Record<TipoTransacao, string[]> = {
  DEPOSITO: [
    "Salário",
    "Investimentos",
    "Reembolsos",
    "Venda de bens",
    "Outras receitas",
  ],
  TRANSFERENCIA: [
    "Alimentação",
    "Moradia",
    "Transporte",
    "Lazer",
    "Educação",
    "Saúde",
    "Serviços",
  ],
};

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
  categoria = "";
  comprovanteBase64?: string;

  constructor(init?: { type?: string; amount?: string; categoria?: string; comprovanteBase64?: string }) {
    if (
      init?.type &&
      (["DEPOSITO", "TRANSFERENCIA"] as const).includes(
        init.type as any
      )
    ) {
      this.tipo = init.type as TipoTransacao;
    }
    if (init?.amount) this.valorTexto = init.amount;
    if (init?.categoria) this.categoria = init.categoria;
    if (init?.comprovanteBase64) this.comprovanteBase64 = init.comprovanteBase64;
  }

  copy() {
    return new NewTransactionVM({
      type: this.tipo,
      amount: this.valorTexto,
      categoria: this.categoria,
      comprovanteBase64: this.comprovanteBase64,
    });
  }

  setTipo(novo: string) {
    this.tipo = (novo as TipoTransacao) || "";
    return this;
  }
  setValorTexto(novo: string) {
    this.valorTexto = novo;
    return this;
  }
  setCategoria(novo?: string) {
    this.categoria = novo?.trim() || "";
    return this;
  }
  setComprovanteBase64(novo?: string) {
    this.comprovanteBase64 = novo;
    return this;
  }
  get valorNumero(): number {
    return Dinheiro.parseBR(this.valorTexto);
  }
  get erro(): string | null {
    if (!this.tipo) {
      return "Selecione o tipo da transação.";
    }
    const valorLimpo = this.valorTexto.trim();
    if (!valorLimpo) {
      return "Informe o valor da transação.";
    }
    if (!/^\d{1,9}([,.]\d{0,2})?$/.test(valorLimpo)) {
      return "Utilize apenas números com até duas casas decimais.";
    }
    if (!Number.isFinite(this.valorNumero) || this.valorNumero <= 0) {
      return "Informe um valor maior que zero.";
    }
    if (this.valorNumero > 1_000_000) {
      return "Valor máximo permitido é R$ 1.000.000,00.";
    }
    if (!this.categoria || this.categoria.trim().length < 3) {
      return "Informe uma categoria com pelo menos 3 caracteres.";
    }
    return null;
  }
  get valido(): boolean {
    return this.erro === null;
  }
  toDTO(): { type: string; amount: string; categoria?: string; comprovanteBase64?: string } {
    return {
      type: this.tipo,
      amount: this.valido ? Dinheiro.formatBR(this.valorNumero) : this.valorTexto,
      categoria: this.categoria,
      comprovanteBase64: this.comprovanteBase64,
    };
  }
}

interface NewTransactionProps {
  isOpen: boolean;
  onClose: () => void;
  initial?: { type?: string; amount?: string; categoria?: string; comprovanteBase64?: string };
  editingTransaction?: { id: string; type: string; amount: string; date: string; categoria?: string; comprovanteBase64?: string };
  onSubmit?: (data: { type: string; amount: string; categoria?: string; id?: string; comprovanteBase64?: string }) => void | Promise<void>;
  disabled?: boolean;
  availableCategories?: string[];
}

const NewTransaction: React.FC<NewTransactionProps> = ({
  isOpen,
  onClose,
  initial,
  editingTransaction,
  onSubmit,
  disabled = false,
  availableCategories = [],
}) => {
  const initialData = editingTransaction || initial;
  const initialVM = useMemo(() => new NewTransactionVM(initialData), [initialData]);
  const [vm, setVM] = useState<NewTransactionVM>(initialVM);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [comprovanteBase64, setComprovanteBase64] = useState<string | undefined>(
    initialData?.comprovanteBase64
  );

  const categorySuggestions = useMemo(() => {
    const fromType = vm.tipo ? CATEGORY_SUGGESTIONS[vm.tipo] || [] : Object.values(CATEGORY_SUGGESTIONS).flat();
    const combined = new Set<string>([...fromType, ...availableCategories]);
    if (vm.categoria) {
      combined.add(vm.categoria);
    }
    return Array.from(combined).filter(Boolean).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [vm.tipo, vm.categoria, availableCategories]);

  const validationMessage = erro ?? ((vm.tipo || vm.valorTexto || vm.categoria) && !vm.valido ? vm.erro : null);
  const isSubmitDisabled = disabled || enviando || !vm.valido;

  React.useEffect(() => {
    if (isOpen) {
      const newVM = new NewTransactionVM(initialData);
      if (newVM.tipo && !newVM.categoria) {
        const suggestions = CATEGORY_SUGGESTIONS[newVM.tipo] || [];
        if (suggestions.length) {
          newVM.setCategoria(suggestions[0]);
        }
      }
      setVM(newVM);
      setErro(null);
      setComprovanteBase64(newVM.comprovanteBase64);
    }
  }, [isOpen, initialData]);

  const handleTransactionSelect = (value: string) => {
    setVM((prev) => {
      const next = prev.copy().setTipo(value);
      const typedValue = value as TipoTransacao;
      const suggestions = CATEGORY_SUGGESTIONS[typedValue] || [];
      if (!next.categoria || suggestions.includes(next.categoria)) {
        next.setCategoria(suggestions[0]);
      }
      return next;
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    if (/^[0-9.,]*$/.test(rawValue)) {
      setVM((prev) => prev.copy().setValorTexto(rawValue));
    }
  };

  const handleAmountBlur = () => {
    setVM((prev) => {
      const clone = prev.copy();
      if (!clone.valorTexto) {
        return clone;
      }
      const parsed = clone.valorNumero;
      if (Number.isFinite(parsed) && parsed > 0) {
        clone.setValorTexto(Dinheiro.formatBR(parsed));
      }
      return clone;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setComprovanteBase64(reader.result as string);
      setVM((prev) => prev.copy().setComprovanteBase64(reader.result as string));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setComprovanteBase64(undefined);
    setVM((prev) => prev.copy().setComprovanteBase64(undefined));
  };

  const handleTransactionSubmit = async () => {
    setErro(null);
    const validationError = vm.erro;
    if (validationError) {
      setErro(validationError);
      return;
    }
    try {
      setEnviando(true);
      const submitData = {
        ...vm.toDTO(),
        id: editingTransaction?.id,
        comprovanteBase64,
      };
      if (onSubmit) {
        await onSubmit(submitData);
      } else {
        const baseTransaction = new Transaction({
          id: editingTransaction ? parseInt(editingTransaction.id, 10) : Date.now(),
          tipo: vm.tipo as TipoTransacao,
          valor: vm.valorNumero,
          data: editingTransaction?.date || new Date().toISOString().split("T")[0],
          categoria: vm.categoria,
          comprovanteBase64,
        });
        if (editingTransaction) {
          await TransactionService.update(baseTransaction);
        } else {
          await TransactionService.add(baseTransaction);
        }
      }

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
              placeholder="00,00"
              required
              id="valor"
              type="text"
              inputMode="decimal"
              pattern="^\\d{1,9}([,.]\\d{0,2})?$"
              value={vm.valorTexto}
              onChange={handleAmountChange}
              onBlur={handleAmountBlur}
              disabled={disabled || enviando}
              className="w-100 bg-gray-100 border p-3 rounded-lg text-2xl font-bold text-gray-700"
              aria-invalid={!!validationMessage}
            />
          </div>
        </div>

        <div className="mb-4">
          <Autocomplete
            freeSolo
            options={categorySuggestions}
            value={vm.categoria}
            onChange={(_, newValue) => setVM((prev) => prev.copy().setCategoria(newValue || ""))}
            onInputChange={(_, newInputValue) => setVM((prev) => prev.copy().setCategoria(newInputValue))}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Categoria"
                placeholder="Digite ou selecione a categoria"
                InputLabelProps={{ shrink: true }}
              />
            )}
            disabled={disabled || enviando}
            sx={{ backgroundColor: '#f8f9fa', borderRadius: 1 }}
          />
          <Typography variant="caption" className="mt-1 d-block text-muted">
            Sugestões personalizadas aparecem conforme o tipo selecionado e seu histórico.
          </Typography>
          {validationMessage && (
            <Typography as="p" className="mt-2 text-red-600" role="alert">
              {validationMessage}
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
            disabled={isSubmitDisabled}
          >
            {enviando ? "Salvando…" : buttonText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default NewTransaction;
