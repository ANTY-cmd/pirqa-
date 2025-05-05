
import { PageHeader } from "@/components/PageHeader";
import { useElection } from "@/context/ElectionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Trophy } from "lucide-react";

export default function Dashboard() {
  const { precincts, candidates, votes, getTotalVotesByCandidate } = useElection();

  // Total counts
  const totalPrecincts = precincts.length;
  const totalCandidates = candidates.length;
  const totalVotes = votes.reduce((sum, vote) => sum + vote.voteCount, 0);
  const totalTables = precincts.reduce((sum, precinct) => sum + precinct.tables, 0);

  // Data for the bar chart
  const candidateVotes = candidates.map(candidate => ({
    name: candidate.name,
    votes: getTotalVotesByCandidate(candidate.id),
    party: candidate.party
  })).sort((a, b) => b.votes - a.votes);

  // Data for the pie chart
  const pieData = candidateVotes.map(item => ({
    name: item.name,
    value: item.votes
  }));

  // Colors for charts
  const COLORS = ['#C75146', '#E49B45', '#4682B4', '#5A7D63', '#8A7E72'];

  // Determine who is winning
  const leadingCandidate = candidateVotes.length > 0 ? candidateVotes[0] : null;
  const totalVotesCount = candidateVotes.reduce((sum, candidate) => sum + candidate.votes, 0);
  const leadingPercentage = leadingCandidate && totalVotesCount > 0 
    ? ((leadingCandidate.votes / totalVotesCount) * 100).toFixed(2) 
    : "0";

  return (
    <div>
      <PageHeader 
        title="La Pirqa - Control Electoral" 
        description="Bienvenido al sistema de registro y visualización electoral"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recintos Electorales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPrecincts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mesas de Votación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTables}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Candidatos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCandidates}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Votos Registrados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVotes}</div>
          </CardContent>
        </Card>
      </div>

      {leadingCandidate && votes.length > 0 && (
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-andes-terra">
              <Trophy className="h-6 w-6" /> Candidato en Primer Lugar
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h3 className="text-2xl font-bold text-andes-terra">{leadingCandidate.name}</h3>
                <p className="text-muted-foreground">{leadingCandidate.party}</p>
              </div>
              <div className="mt-2 md:mt-0 flex flex-col items-center md:items-end">
                <div className="text-3xl font-bold">{leadingCandidate.votes}</div>
                <div className="text-sm text-muted-foreground">
                  {leadingPercentage}% de los votos
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {candidates.length > 0 && votes.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Distribución de Votos por Candidato</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
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
                    height={60}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name, props) => [`${value} votos`, props.payload.name]}
                    labelFormatter={() => ''}
                  />
                  <Bar dataKey="votes" fill="#C75146" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Porcentaje de Votos por Candidato</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} votos`, 'Cantidad']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {(candidates.length === 0 || votes.length === 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Sistema de Control Electoral</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center p-6">
            <p className="text-center text-muted-foreground mb-4">
              Para comenzar, registre recintos electorales, candidatos y mesas de votación.
            </p>
            <div className="andean-pattern-divider w-full"></div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
