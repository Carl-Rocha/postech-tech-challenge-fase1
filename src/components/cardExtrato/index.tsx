import {
  IconButton,
  Box,
  Chip,
  Stack,
  Typography as MuiTypography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRef, useState, useEffect, useMemo } from 'react';
import { Card, Typography } from '@/design-system';

export interface IExtrato {
  id: string;
  valor: number;
  data: string;
  tipo: 'TRANSFERENCIA' | 'DEPOSITO';
  categoria?: string;
  comprovanteBase64?: string;
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
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const sortedExtrato = useMemo(
    () =>
      [...extrato].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()),
    [extrato]
  );

  const visibleExtratos = useMemo(
    () => sortedExtrato.slice(0, visibleCount),
    [sortedExtrato, visibleCount]
  );

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [extrato, pageSize]);

  const hasMore = visibleExtratos.length < sortedExtrato.length;

  useEffect(() => {
    const container = containerRef.current;
    const sentinel = sentinelRef.current;
    if (!hasMore || !container || !sentinel) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + pageSize, sortedExtrato.length));
        }
      },
      {
        root: container,
        threshold: 1,
      }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, pageSize, sortedExtrato.length]);

  const listaExtrato = ordenarExtartoMes(visibleExtratos) ?? [];

  return (
    <Card>
      <Typography variant="heading">
        Extrato
      </Typography>
      <Box sx={{ mb: 2, maxHeight: 500, overflowY: 'auto' }} ref={containerRef}>
        <Stack spacing={2}>
          {listaExtrato.map((extratoMes, idx) => (
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
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <Typography variant="body" color="text.secondary">
                          {extrato.tipo}
                        </Typography>
                        {extrato.categoria && (
                          <Chip
                            label={extrato.categoria}
                            size="small"
                            sx={{
                              backgroundColor: extrato.tipo === 'DEPOSITO' ? 'rgba(76, 175, 80, 0.12)' : 'rgba(244, 67, 54, 0.12)',
                              color: extrato.tipo === 'DEPOSITO' ? '#2e7d32' : '#c62828',
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Stack>
                      <Typography variant="caption" style={{color: 'grey', marginBottom: 6}}>{extrato.dataPtBr}</Typography>
                      <span style={{ color: extrato.tipo === 'DEPOSITO' ? 'green' : 'red', fontWeight: 'bold' }}>
                        {extrato.tipo === 'DEPOSITO' ? 'R$ ' : '- R$ '}
                        {extrato.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      {extrato.comprovanteBase64 && (
                        <Box sx={{ mt: 1 }}>
                          <a
                            href={extrato.comprovanteBase64}
                            download={`comprovante-${extrato.id}.png`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={extrato.comprovanteBase64}
                              alt="Comprovante"
                              style={{
                                width: 48,
                                height: 48,
                                objectFit: "cover",
                                borderRadius: 4,
                                border: "1px solid #ccc",
                                cursor: "pointer"
                              }}
                            />
                          </a>
                        </Box>
                      )}
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
        <div ref={sentinelRef} />
      </Box>
      <MuiTypography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', pt: 1 }}>
        {hasMore
          ? 'Role até o final da lista para carregar mais transações.'
          : `Exibindo ${visibleExtratos.length} de ${sortedExtrato.length} transações.`}
      </MuiTypography>
    </Card>
  );
}
