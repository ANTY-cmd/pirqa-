
import { useState, useEffect } from "react";
import { useElection } from "@/context/ElectionContext";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";

type VoteFormData = {
  [candidateId: string]: number;
};

export default function Votes() {
  const { 
    precincts, 
    candidates, 
    addVote, 
    getVotesByPrecinctAndTable, 
    getCandidateById 
  } = useElection();
  
  const [selectedPrecinctId, setSelectedPrecinctId] = useState<string>("");
  const [selectedTableNumber, setSelectedTableNumber] = useState<number | null>(null);
  const [voteData, setVoteData] = useState<VoteFormData>({});
  const [refresh, setRefresh] = useState<boolean>(false);
  
  const selectedPrecinct = precincts.find(p => p.id === selectedPrecinctId);

  useEffect(() => {
    // Reset vote data when precinct or table selection changes
    if (selectedPrecinctId && selectedTableNumber !== null) {
      const existingVotes = getVotesByPrecinctAndTable(selectedPrecinctId, selectedTableNumber);
      
      // Initialize form with existing votes or 0
      const initialVoteData: VoteFormData = {};
      candidates.forEach(candidate => {
        const existingVote = existingVotes.find(v => v.candidateId === candidate.id);
        initialVoteData[candidate.id] = existingVote ? existingVote.voteCount : 0;
      });
      
      setVoteData(initialVoteData);
    } else {
      setVoteData({});
    }
  }, [selectedPrecinctId, selectedTableNumber, candidates, getVotesByPrecinctAndTable, refresh]);

  const handleSelectPrecinct = (value: string) => {
    setSelectedPrecinctId(value);
    setSelectedTableNumber(null);
  };

  const handleSelectTable = (value: string) => {
    setSelectedTableNumber(parseInt(value));
  };

  const handleVoteChange = (candidateId: string, value: string) => {
    const voteCount = parseInt(value) || 0;
    setVoteData(prev => ({
      ...prev,
      [candidateId]: voteCount
    }));
  };

  const handleSubmitVotes = () => {
    if (!selectedPrecinctId || selectedTableNumber === null) {
      return;
    }

    // Save votes for each candidate
    for (const candidateId in voteData) {
      addVote({
        precinctId: selectedPrecinctId,
        tableNumber: selectedTableNumber,
        candidateId,
        voteCount: voteData[candidateId]
      });
    }
    
    // Forzar actualización para refrescar los datos mostrados
    setRefresh(prev => !prev);
    
    toast({
      title: "Votos guardados",
      description: "Los votos han sido registrados correctamente",
    });
  };

  const existingVotes = selectedPrecinctId && selectedTableNumber !== null
    ? getVotesByPrecinctAndTable(selectedPrecinctId, selectedTableNumber)
    : [];

  return (
    <div>
      <PageHeader 
        title="Registro de Votos" 
        description="Ingresa los resultados de votación por mesa y candidato"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="precinct-select" className="text-sm font-medium mb-2 block">
            Recinto Electoral
          </label>
          <Select value={selectedPrecinctId} onValueChange={handleSelectPrecinct}>
            <SelectTrigger className="w-full" id="precinct-select">
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

        <div>
          <label htmlFor="table-select" className="text-sm font-medium mb-2 block">
            Mesa Electoral
          </label>
          <Select 
            value={selectedTableNumber !== null ? selectedTableNumber.toString() : ""}
            onValueChange={handleSelectTable}
            disabled={!selectedPrecinct}
          >
            <SelectTrigger className="w-full" id="table-select">
              <SelectValue placeholder={selectedPrecinct ? "Selecciona una mesa" : "Primero selecciona un recinto"} />
            </SelectTrigger>
            <SelectContent>
              {selectedPrecinct && Array.from({ length: selectedPrecinct.tables }, (_, i) => (
                <SelectItem key={i} value={(i + 1).toString()}>
                  Mesa {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {precincts.length === 0 || candidates.length === 0 ? (
        <EmptyState
          title={precincts.length === 0 ? "Sin recintos electorales" : "Sin candidatos registrados"}
          description={
            precincts.length === 0 
              ? "Primero debes registrar recintos electorales para ingresar votos."
              : "Primero debes registrar candidatos para ingresar votos."
          }
          actionLabel={precincts.length === 0 ? "Ir a Recintos" : "Ir a Candidatos"}
          action={() => window.location.href = precincts.length === 0 ? "/recintos" : "/candidatos"}
        />
      ) : !selectedPrecinct || selectedTableNumber === null ? (
        <Card className="bg-muted/40">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Selecciona un recinto y una mesa para registrar los votos
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="form">
          <TabsList className="mb-4">
            <TabsTrigger value="form">Formulario de Votos</TabsTrigger>
            <TabsTrigger value="data">Datos Registrados</TabsTrigger>
          </TabsList>

          <TabsContent value="form">
            <Card>
              <CardHeader>
                <CardTitle>
                  Registro de Votos - {selectedPrecinct.name} - Mesa {selectedTableNumber}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmitVotes(); }}>
                  <div className="space-y-4">
                    {candidates.map((candidate) => (
                      <div key={candidate.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 border rounded-md">
                        <div className="md:col-span-2">
                          <div className="font-medium">{candidate.name}</div>
                          <div className="text-sm text-muted-foreground">{candidate.party}</div>
                        </div>
                        <div>
                          <label htmlFor={`vote-${candidate.id}`} className="sr-only">
                            Votos para {candidate.name}
                          </label>
                          <Input
                            id={`vote-${candidate.id}`}
                            type="number"
                            min="0"
                            value={voteData[candidate.id] || 0}
                            onChange={(e) => handleVoteChange(candidate.id, e.target.value)}
                            className="w-full"
                          />
                        </div>
                      </div>
                    ))}

                    <div className="pt-4">
                      <Button type="submit" className="w-full">
                        Guardar Votos
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle>
                  Votos Registrados - {selectedPrecinct.name} - Mesa {selectedTableNumber}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {existingVotes.length === 0 ? (
                  <p className="text-center text-muted-foreground py-6">
                    No hay votos registrados para esta mesa. Utiliza el formulario para ingresarlos.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Candidato</TableHead>
                        <TableHead>Partido</TableHead>
                        <TableHead className="text-right">Votos</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {existingVotes.map((vote) => {
                        const candidate = getCandidateById(vote.candidateId);
                        return candidate ? (
                          <TableRow key={vote.id}>
                            <TableCell className="font-medium">{candidate.name}</TableCell>
                            <TableCell>{candidate.party}</TableCell>
                            <TableCell className="text-right">{vote.voteCount}</TableCell>
                          </TableRow>
                        ) : null;
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
