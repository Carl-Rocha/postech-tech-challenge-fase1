import {
  IconButton,
  Divider,
  Box,
  Chip,
  Stack,
  Modal,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Button, Card, Typography } from '@/design-system';

export interface IExtrato {
  id: string;
  valor: number;
  data: string;
  tipo: 'TRANSFERENCIA' | 'DEPOSITO';
}

interface IExtratoComDataPtBr extends IExtrato {
  dataPtBr?: string;
}

interface IExtratoMes {
  mesExtrato: string;
  extratos: IExtratoComDataPtBr[];
}

function ordenarExtartoMes(extrato: Array<IExtrato>): IExtratoMes[] {
  const extratoMes = extrato.reduce((listaExtratoMes: IExtratoMes[], extrato: IExtrato) => {
    const date = new Date(extrato.data);
    const mesExtrato = date.toLocaleString('pt-BR', { month: 'long' });
    const grupoMes = listaExtratoMes.find((item) => item.mesExtrato === mesExtrato);
    const [ano, mes, dia] = extrato.data.split('-');
    const extratoComDataPtBr: IExtratoComDataPtBr = {
      ...extrato,
      dataPtBr: `${dia}/${mes}/${ano}`
    };

    if (grupoMes) {
      grupoMes.extratos.push(extratoComDataPtBr);
    } else {
      listaExtratoMes.push({
        mesExtrato,
        extratos: [extratoComDataPtBr]
      });
    }

    return listaExtratoMes;
  }, []);

  return extratoMes;
}

interface CardExtratoProps {
  extrato: Array<IExtrato>;
  onDelete?: (id: string) => void;
  onEdit?: (transaction: IExtrato) => void;
  pageSize?: number;
}

export default function CardExtrato({ extrato, onDelete, onEdit, pageSize = 10 }: CardExtratoProps) {
  const listaExtrato = ordenarExtartoMes(extrato) ?? [];
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const [openFilterModal, setOpenFilterModal] = useState(false);

  const allExtratos = listaExtrato.flatMap(mes => mes.extratos);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setVisibleCount((prev) => Math.min(prev + pageSize, allExtratos.length));
    }
  }, [allExtratos.length, pageSize]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver]);

  // Agrupa os extratos visíveis por mês novamente
  const visibleExtratos = allExtratos.slice(0, visibleCount);
  const visibleExtratoMes = ordenarExtartoMes(visibleExtratos);

  // Função de filtro (exemplo)
  const handleFilter = (filters: { tipo?: string; dataInicio?: string; dataFim?: string }) => {
    // Implemente a lógica de filtro conforme necessário
    // Exemplo: console.log(filters);
  };

  return (
    <Card>
      <Typography variant="heading">
        Extrato
      </Typography>
      <Box sx={{ mb: 2, maxHeight: 500, overflowY: 'auto' }}>
        <Stack spacing={2}>
          {visibleExtratoMes.map((extratoMes, idx) => (
            <Box key={extratoMes.mesExtrato + idx} sx={{ mb: 2 }}>
              <Stack spacing={1}>
                {extratoMes.extratos.map((extrato, i) => (
                  <Box
                    key={extrato.data + i}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1,
                      bgcolor: '#f5f5f5',
                      borderRadius: 1,
                      boxShadow: 1,
                    }}
                  >
                    <Box>
                      <Typography variant="body" color="text.secondary" style={{ marginBottom: 1 }}>
                        {extrato.tipo}
                      </Typography>
                      <Typography variant="caption" style={{color: 'grey', marginBottom: 6}}>{extrato.dataPtBr}</Typography>
                      <span style={{ color: extrato.tipo === 'DEPOSITO' ? 'green' : 'red', fontWeight: 'bold' }}>
                        {extrato.tipo === 'DEPOSITO' ? 'R$ ' : '- R$ '}
                        {extrato.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </Box>
                    <Box>
                      {onEdit && (
                        <IconButton 
                          size="small" 
                          color="primary" 
                          title="Editar"
                          onClick={() => onEdit(extrato)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                      {onDelete && (
                        <IconButton
                          size="small"
                          color="error"
                          title="Excluir"
                          onClick={() => onDelete(extrato.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
        <div ref={loaderRef} />
        {visibleCount < allExtratos.length && (
          <Typography align="center" variant="body2" sx={{ mt: 2 }}>
            Carregando mais...
          </Typography>
        )}
      </Box>
    </Card>
  );
}
