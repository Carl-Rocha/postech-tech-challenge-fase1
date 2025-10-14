import { Typography, Card } from "@/design-system";
import { CardContent, TextField, MenuItem, Button, Stack, Autocomplete, InputAdornment } from "@mui/material";

interface CardExtratoFilterProps {
  filter: {
    tipo?: string;
    dataInicio?: string;
    dataFim?: string;
    search?: string;
    categoria?: string;
    minValor?: string;
    maxValor?: string;
  };
  setFilter: (f: any) => void;
  availableCategories: string[];
}

export default function CardExtratoFilter({ filter, setFilter, availableCategories }: CardExtratoFilterProps) {
  return (
    <Card>
      <Typography variant="heading" style={{marginBottom: '0' }}>
        Filtro
      </Typography>
      <CardContent>
        <Stack spacing={2}>
          <TextField
            label="Buscar"
            placeholder="Procure por tipo, categoria ou valor"
            value={filter.search || ""}
            onChange={e => setFilter((f: any) => ({ ...f, search: e.target.value }))}
            fullWidth
          />
          <Autocomplete
            freeSolo
            options={availableCategories}
            value={filter.categoria || ""}
            onChange={(_, value) => setFilter((f: any) => ({ ...f, categoria: value || undefined }))}
            onInputChange={(_, value) => setFilter((f: any) => ({ ...f, categoria: value || undefined }))}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Categoria"
                placeholder="Filtrar por categoria"
              />
            )}
          />
          <TextField
            select
            label="Tipo"
            value={filter.tipo || ""}
            onChange={e => setFilter((f: any) => ({ ...f, tipo: e.target.value }))}
            fullWidth
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="DEPOSITO">Depósito</MenuItem>
            <MenuItem value="TRANSFERENCIA">Transferência</MenuItem>
          </TextField>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <TextField
              label="Valor mínimo"
              value={filter.minValor || ""}
              onChange={e => setFilter((f: any) => ({ ...f, minValor: e.target.value }))}
              fullWidth
              inputProps={{ inputMode: 'decimal', pattern: '^\\d{0,9}([,.]\\d{0,2})?$' }}
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              }}
            />
            <TextField
              label="Valor máximo"
              value={filter.maxValor || ""}
              onChange={e => setFilter((f: any) => ({ ...f, maxValor: e.target.value }))}
              fullWidth
              inputProps={{ inputMode: 'decimal', pattern: '^\\d{0,9}([,.]\\d{0,2})?$' }}
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              }}
            />
          </Stack>
          <TextField
            label="Data Início"
            type="date"
            value={filter.dataInicio || ""}
            onChange={e => setFilter((f: any) => ({ ...f, dataInicio: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="Data Fim"
            type="date"
            value={filter.dataFim || ""}
            onChange={e => setFilter((f: any) => ({ ...f, dataFim: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <Button
            variant="outlined"
            onClick={() => setFilter({})}
          >
            Limpar Filtros
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
