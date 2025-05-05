
import { useState } from "react";
import { useElection } from "@/context/ElectionContext";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default function Tables() {
  const { precincts, updatePrecinct } = useElection();
  const [selectedPrecinctId, setSelectedPrecinctId] = useState<string>("");
  const selectedPrecinct = precincts.find(p => p.id === selectedPrecinctId);
  const [newTablesCount, setNewTablesCount] = useState<number>(0);

  const handleSelectPrecinct = (value: string) => {
    setSelectedPrecinctId(value);
    const precinct = precincts.find(p => p.id === value);
    if (precinct) {
      setNewTablesCount(precinct.tables);
    }
  };

  const handleUpdateTables = () => {
    if (selectedPrecinctId && newTablesCount > 0) {
      updatePrecinct(selectedPrecinctId, { tables: newTablesCount });
    }
  };

  return (
    <div>
      <PageHeader 
        title="Mesas Electorales" 
        description="Administra las mesas electorales de cada recinto"
      />

      <div className="mb-6">
        <Select value={selectedPrecinctId} onValueChange={handleSelectPrecinct}>
          <SelectTrigger className="w-full md:w-80">
            <SelectValue placeholder="Selecciona un recinto electoral" />
          </SelectTrigger>
          <SelectContent>
            {precincts.map((precinct) => (
              <SelectItem key={precinct.id} value={precinct.id}>
                {precinct.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {precincts.length === 0 ? (
        <EmptyState
          title="Sin recintos electorales"
          description="Primero debes registrar recintos electorales para administrar sus mesas."
          actionLabel="Ir a Recintos"
          action={() => window.location.href = "/recintos"}
        />
      ) : !selectedPrecinct ? (
        <Card className="bg-muted/40">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Selecciona un recinto para ver y administrar sus mesas electorales
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{selectedPrecinct.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedPrecinct.location}
                  </p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Editar Mesas</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Número de Mesas</DialogTitle>
                      <DialogDescription>
                        Actualiza el número de mesas electorales en este recinto
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <label htmlFor="tables" className="text-sm font-medium">
                          Número de Mesas
                        </label>
                        <Input
                          id="tables"
                          type="number"
                          min="1"
                          value={newTablesCount}
                          onChange={(e) => setNewTablesCount(parseInt(e.target.value) || 1)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button onClick={handleUpdateTables}>Guardar</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {Array.from({ length: selectedPrecinct.tables }, (_, i) => (
                  <div 
                    key={i}
                    className="flex items-center justify-center w-20 h-20 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
                  >
                    <div className="text-center">
                      <div className="text-xl font-bold">{i + 1}</div>
                      <div className="text-xs text-muted-foreground">Mesa</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Información del Recinto</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 gap-y-4">
                  <div className="flex flex-col">
                    <dt className="text-sm font-medium text-muted-foreground">Nombre</dt>
                    <dd className="text-lg">{selectedPrecinct.name}</dd>
                  </div>
                  <div className="flex flex-col">
                    <dt className="text-sm font-medium text-muted-foreground">Ubicación</dt>
                    <dd className="text-lg">{selectedPrecinct.location}</dd>
                  </div>
                  <div className="flex flex-col">
                    <dt className="text-sm font-medium text-muted-foreground">Total de Mesas</dt>
                    <dd className="text-lg">{selectedPrecinct.tables}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumen de Mesas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Total Mesas:</span>
                    <Badge variant="secondary">{selectedPrecinct.tables}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">ID del Recinto:</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[200px]">{selectedPrecinct.id}</span>
                  </div>
                  <div className="andean-pattern-divider w-full"></div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Para ingresar votos en estas mesas, ve a la sección "Votos"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
