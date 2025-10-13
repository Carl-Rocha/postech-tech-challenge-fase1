import { Card, CardContent, TextField, MenuItem, Button, Stack } from "@mui/material";

export default function ExtratoFilterCard({ filter, setFilter }: {
  filter: { tipo?: string; dataInicio?: string; dataFim?: string };
  setFilter: (f: any) => void;
}) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
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