
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

// Type definitions
export interface Precinct {
  id: string;
  name: string;
  location: string;
  tables: number;
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
}

export interface Vote {
  id: string;
  precinctId: string;
  tableNumber: number;
  candidateId: string;
  voteCount: number;
}

// Context type
interface ElectionContextType {
  precincts: Precinct[];
  candidates: Candidate[];
  votes: Vote[];
  addPrecinct: (precinct: Omit<Precinct, 'id'>) => void;
  updatePrecinct: (id: string, precinct: Partial<Omit<Precinct, 'id'>>) => void;
  deletePrecinct: (id: string) => void;
  addCandidate: (candidate: Omit<Candidate, 'id'>) => void;
  updateCandidate: (id: string, candidate: Partial<Omit<Candidate, 'id'>>) => void;
  deleteCandidate: (id: string) => void;
  addVote: (vote: Omit<Vote, 'id'>) => void;
  updateVote: (id: string, vote: Partial<Omit<Vote, 'id'>>) => void;
  deleteVote: (id: string) => void;
  getPrecinctById: (id: string) => Precinct | undefined;
  getCandidateById: (id: string) => Candidate | undefined;
  getVotesByPrecinctAndTable: (precinctId: string, tableNumber: number) => Vote[];
  getTotalVotesByCandidate: (candidateId: string) => number;
}

// Create context
const ElectionContext = createContext<ElectionContextType | undefined>(undefined);

// Provider component
export function ElectionProvider({ children }: { children: ReactNode }) {
  const [precincts, setPrecincts] = useState<Precinct[]>(() => {
    const saved = localStorage.getItem('precincts');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem('candidates');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [votes, setVotes] = useState<Vote[]>(() => {
    const saved = localStorage.getItem('votes');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('precincts', JSON.stringify(precincts));
    localStorage.setItem('candidates', JSON.stringify(candidates));
    localStorage.setItem('votes', JSON.stringify(votes));
  }, [precincts, candidates, votes]);

  // Precincts methods
  const addPrecinct = (precinct: Omit<Precinct, 'id'>) => {
    const newPrecinct = {
      ...precinct,
      id: crypto.randomUUID(),
    };
    setPrecincts([...precincts, newPrecinct]);
    toast({
      title: "Recinto agregado",
      description: `Se ha agregado el recinto ${precinct.name}`,
    });
  };

  const updatePrecinct = (id: string, precinct: Partial<Omit<Precinct, 'id'>>) => {
    setPrecincts(precincts.map(p => 
      p.id === id ? { ...p, ...precinct } : p
    ));
    toast({
      title: "Recinto actualizado",
      description: "Se ha actualizado la información del recinto",
    });
  };

  const deletePrecinct = (id: string) => {
    setPrecincts(precincts.filter(p => p.id !== id));
    // Also delete related votes
    setVotes(votes.filter(v => v.precinctId !== id));
    toast({
      title: "Recinto eliminado",
      description: "Se ha eliminado el recinto y sus datos asociados",
    });
  };

  // Candidates methods
  const addCandidate = (candidate: Omit<Candidate, 'id'>) => {
    const newCandidate = {
      ...candidate,
      id: crypto.randomUUID(),
    };
    setCandidates([...candidates, newCandidate]);
    toast({
      title: "Candidato agregado",
      description: `Se ha agregado ${candidate.name} del partido ${candidate.party}`,
    });
  };

  const updateCandidate = (id: string, candidate: Partial<Omit<Candidate, 'id'>>) => {
    setCandidates(candidates.map(c => 
      c.id === id ? { ...c, ...candidate } : c
    ));
    toast({
      title: "Candidato actualizado",
      description: "Se ha actualizado la información del candidato",
    });
  };

  const deleteCandidate = (id: string) => {
    setCandidates(candidates.filter(c => c.id !== id));
    // Also delete related votes
    setVotes(votes.filter(v => v.candidateId !== id));
    toast({
      title: "Candidato eliminado",
      description: "Se ha eliminado el candidato y sus votos asociados",
    });
  };

  // Votes methods
  const addVote = (vote: Omit<Vote, 'id'>) => {
    // Check if a vote for this precinct, table and candidate already exists
    const existingVote = votes.find(v => 
      v.precinctId === vote.precinctId && 
      v.tableNumber === vote.tableNumber &&
      v.candidateId === vote.candidateId
    );

    if (existingVote) {
      // Update the existing vote
      updateVote(existingVote.id, { voteCount: vote.voteCount });
      return;
    }

    const newVote = {
      ...vote,
      id: crypto.randomUUID(),
    };
    setVotes([...votes, newVote]);
    toast({
      title: "Votos registrados",
      description: `Se han registrado ${vote.voteCount} votos para la mesa ${vote.tableNumber}`,
    });
  };

  const updateVote = (id: string, vote: Partial<Omit<Vote, 'id'>>) => {
    setVotes(votes.map(v => 
      v.id === id ? { ...v, ...vote } : v
    ));
    toast({
      title: "Votos actualizados",
      description: "Se ha actualizado el registro de votos",
    });
  };

  const deleteVote = (id: string) => {
    setVotes(votes.filter(v => v.id !== id));
    toast({
      title: "Registro eliminado",
      description: "Se ha eliminado el registro de votos",
    });
  };

  // Helper methods
  const getPrecinctById = (id: string) => {
    return precincts.find(p => p.id === id);
  };

  const getCandidateById = (id: string) => {
    return candidates.find(c => c.id === id);
  };

  const getVotesByPrecinctAndTable = (precinctId: string, tableNumber: number) => {
    return votes.filter(
      v => v.precinctId === precinctId && v.tableNumber === tableNumber
    );
  };

  const getTotalVotesByCandidate = (candidateId: string) => {
    return votes
      .filter(v => v.candidateId === candidateId)
      .reduce((sum, vote) => sum + vote.voteCount, 0);
  };

  return (
    <ElectionContext.Provider
      value={{
        precincts,
        candidates,
        votes,
        addPrecinct,
        updatePrecinct,
        deletePrecinct,
        addCandidate,
        updateCandidate,
        deleteCandidate,
        addVote,
        updateVote,
        deleteVote,
        getPrecinctById,
        getCandidateById,
        getVotesByPrecinctAndTable,
        getTotalVotesByCandidate,
      }}
    >
      {children}
    </ElectionContext.Provider>
  );
}

// Custom hook to use the context
export function useElection() {
  const context = useContext(ElectionContext);
  if (context === undefined) {
    throw new Error('useElection must be used within an ElectionProvider');
  }
  return context;
}
