
import { useState } from "react";
import { useElection } from "@/context/ElectionContext";
import { PageHeader } from "@/components/PageHeader";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
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
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { EmptyState } from "@/components/EmptyState";

export default function Results() {
  const { precincts, candidates, votes, getPrecinctById, getCandidateById, getTotalVotesByCandidate } = useElection();
  const [selectedPrecinctId, setSelectedPrecinctId] = useState<string>("all");
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>("all");

  // Colors for charts
  const COLORS = ['#C75146', '#E49B45', '#4682B4', '#5A7D63', '#8A7E72'];

  // Calculate vote totals
  const totalVotes = votes.reduce((sum, vote) => sum + vote.voteCount, 0);

  // Filter votes based on selections
  const filteredVotes = votes.filter(vote => {
    if (selectedPrecinctId !== "all" && vote.precinctId !== selectedPrecinctId) return false;
    if (selectedCandidateId !== "all" && vote.candidateId !== selectedCandidateId) return false;
    return true;
  });

  // Data for overall candidates chart
  const candidateVotes = candidates.map(candidate => {
    const voteCount = selectedPrecinctId === "all" 
      ? getTotalVotesByCandidate(candidate.id)
      : filteredVotes
          .filter(vote => vote.candidateId === candidate.id)
          .reduce((sum, vote) => sum + vote.voteCount, 0);
            
    return {
      name: candidate.name,
      party: candidate.party,
      votes: voteCount,
      percentage: totalVotes > 0 ? ((voteCount / totalVotes) * 100).toFixed(2) : "0.00"
    };
  }).sort((a, b) => b.votes - a.votes);

  // Data for precinct results
  const precinctResults = precincts.map(precinct => {
    const precinctVotes = filteredVotes.filter(vote => vote.precinctId === precinct.id);
    const totalPrecinctVotes = precinctVotes.reduce((sum, vote) => sum + vote.voteCount, 0);
    
    return {
      name: precinct.name,
      location: precinct.location,
      totalVotes: totalPrecinctVotes
    };
  }).sort((a, b) => b.totalVotes - a.totalVotes);

  // Data for pie chart
  const pieData = candidateVotes.map(item => ({
    name: item.name,
    value: item.votes
  }));

  return (
    <div>
      <PageHeader 
        title="Resultados Electorales" 
        description="Visualiza los resultados de las elecciones mediante gráficos y tablas"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="precinct-filter" className="text-sm font-medium mb-2 block">
            Filtrar por Recinto
          </label>
          <Select 
            value={selectedPrecinctId} 
            onValueChange={setSelectedPrecinctId}
          >
            <SelectTrigger className="w-full" id="precinct-filter">
              <SelectValue placeholder="Todos los recintos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los recintos</SelectItem>
              {precincts.map((precinct) => (
                <SelectItem key={precinct.id} value={precinct.id}>
                  {precinct.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="candidate-filter" className="text-sm font-medium mb-2 block">
            Filtrar por Candidato
          </label>
          <Select 
            value={selectedCandidateId} 
            onValueChange={setSelectedCandidateId}
          >
            <SelectTrigger className="w-full" id="candidate-filter">
              <SelectValue placeholder="Todos los candidatos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los candidatos</SelectItem>
              {candidates.map((candidate) => (
                <SelectItem key={candidate.id} value={candidate.id}>
                  {candidate.name} - {candidate.party}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {votes.length === 0 ? (
        <EmptyState
          title="Sin datos de votación"
          description="Aún no hay votos registrados. Diríjase a la sección 'Votos' para ingresar resultados."
          actionLabel="Ir a Votos"
          action={() => window.location.href = "/votos"}
        />
      ) : (
        <Tabs defaultValue="summary">
          <TabsList className="mb-6">
            <TabsTrigger value="summary">Resumen</TabsTrigger>
            <TabsTrigger value="tables">Tablas</TabsTrigger>
            <TabsTrigger value="charts">Gráficos</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total de Votos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {selectedPrecinctId === "all" && selectedCandidateId === "all"
                      ? totalVotes
                      : filteredVotes.reduce((sum, vote) => sum + vote.voteCount, 0)}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total de Recintos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {selectedPrecinctId === "all" 
                      ? precincts.length 
                      : 1}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total de Candidatos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {selectedCandidateId === "all" 
                      ? candidates.length 
                      : 1}
                  </div>
                </CardContent>
              </Card>
            </div>

            {candidateVotes.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Ranking de Candidatos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {candidateVotes.slice(0, 5).map((candidate, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{candidate.name}</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              ({candidate.party})
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold">{candidate.votes}</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              ({candidate.percentage}%)
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${candidate.percentage}%`,
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedPrecinctId === "all" && (
              <Card>
                <CardHeader>
                  <CardTitle>Recintos con Mayor Participación</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {precinctResults.slice(0, 5).map((precinct, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{precinct.name}</span>
                            <span className="text-sm text-muted-foreground ml-2 hidden md:inline">
                              ({precinct.location})
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold">{precinct.totalVotes}</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              votos
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${(precinct.totalVotes / Math.max(...precinctResults.map(p => p.totalVotes))) * 100}%`,
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="tables">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Resultados por Candidato</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Candidato</TableHead>
                        <TableHead>Partido</TableHead>
                        <TableHead className="text-right">Votos</TableHead>
                        <TableHead className="text-right">Porcentaje</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {candidateVotes.map((candidate, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{candidate.name}</TableCell>
                          <TableCell>{candidate.party}</TableCell>
                          <TableCell className="text-right">{candidate.votes}</TableCell>
                          <TableCell className="text-right">{candidate.percentage}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {selectedPrecinctId === "all" && (
              <Card>
                <CardHeader>
                  <CardTitle>Resultados por Recinto</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Recinto</TableHead>
                          <TableHead>Ubicación</TableHead>
                          <TableHead className="text-right">Total Votos</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {precinctResults.map((precinct, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{precinct.name}</TableCell>
                            <TableCell>{precinct.location}</TableCell>
                            <TableCell className="text-right">{precinct.totalVotes}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="charts">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Votos</CardTitle>
                </CardHeader>
                <CardContent className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={candidateVotes}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end" 
                        height={80}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name, props) => [
                          `${value} votos (${props.payload.percentage}%)`, 
                          props.payload.name
                        ]}
                        labelFormatter={() => ''}
                      />
                      <Legend />
                      <Bar 
                        dataKey="votes" 
                        name="Votos" 
                        fill="#C75146" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Porcentaje de Votos</CardTitle>
                </CardHeader>
                <CardContent className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={130}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [
                          `${value} votos`, 
                          props.payload.name
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
