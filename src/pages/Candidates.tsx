
import { useState } from "react";
import { useElection } from "@/context/ElectionContext";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
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
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Candidates() {
  const { candidates, addCandidate, updateCandidate, deleteCandidate } = useElection();
  const [newCandidate, setNewCandidate] = useState({ name: "", party: "" });
  const [editCandidate, setEditCandidate] = useState<{ id: string; name: string; party: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddCandidate = () => {
    if (newCandidate.name && newCandidate.party) {
      addCandidate(newCandidate);
      setNewCandidate({ name: "", party: "" });
    }
  };

  const handleUpdateCandidate = () => {
    if (editCandidate && editCandidate.name && editCandidate.party) {
      updateCandidate(editCandidate.id, {
        name: editCandidate.name,
        party: editCandidate.party,
      });
      setEditCandidate(null);
    }
  };

  const handleDeleteCandidate = (id: string) => {
    deleteCandidate(id);
  };

  const filteredCandidates = candidates.filter(
    candidate => 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.party.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <PageHeader 
        title="Candidatos" 
        description="Administra los candidatos que participan en las elecciones"
      />

      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Buscar candidatos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Añadir Candidato</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Candidato</DialogTitle>
              <DialogDescription>
                Ingresa la información del candidato
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nombre Completo
                </label>
                <Input
                  id="name"
                  value={newCandidate.name}
                  onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                  placeholder="Ej: Juan Carlos Pérez"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="party" className="text-sm font-medium">
                  Partido Político
                </label>
                <Input
                  id="party"
                  value={newCandidate.party}
                  onChange={(e) => setNewCandidate({ ...newCandidate, party: e.target.value })}
                  placeholder="Ej: Movimiento Nacional"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={handleAddCandidate}>Guardar</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {candidates.length === 0 ? (
        <EmptyState
          title="Sin candidatos"
          description="Aún no hay candidatos registrados. Añade tu primer candidato para comenzar."
          actionLabel="Añadir Candidato"
          action={() => document.querySelector<HTMLButtonElement>('button[data-state="closed"]')?.click()}
        />
      ) : filteredCandidates.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No se encontraron candidatos que coincidan con "{searchTerm}"</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Partido Político</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell className="font-medium">{candidate.name}</TableCell>
                  <TableCell>{candidate.party}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditCandidate(candidate)}
                          >
                            Editar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Candidato</DialogTitle>
                            <DialogDescription>
                              Actualiza la información del candidato
                            </DialogDescription>
                          </DialogHeader>
                          {editCandidate && (
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <label htmlFor="edit-name" className="text-sm font-medium">
                                  Nombre Completo
                                </label>
                                <Input
                                  id="edit-name"
                                  value={editCandidate.name}
                                  onChange={(e) => setEditCandidate({ ...editCandidate, name: e.target.value })}
                                />
                              </div>
                              <div className="grid gap-2">
                                <label htmlFor="edit-party" className="text-sm font-medium">
                                  Partido Político
                                </label>
                                <Input
                                  id="edit-party"
                                  value={editCandidate.party}
                                  onChange={(e) => setEditCandidate({ ...editCandidate, party: e.target.value })}
                                />
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancelar</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button onClick={handleUpdateCandidate}>Guardar</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            Eliminar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar este candidato?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción eliminará permanentemente al candidato "{candidate.name}" y todos sus datos asociados.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteCandidate(candidate.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
