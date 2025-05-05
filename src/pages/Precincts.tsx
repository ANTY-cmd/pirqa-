
import { useState } from "react";
import { useElection } from "@/context/ElectionContext";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Lista de departamentos de Bolivia
const BOLIVIA_DEPARTMENTS = [
  "La Paz",
  "Cochabamba",
  "Santa Cruz",
  "Oruro",
  "Potosí",
  "Chuquisaca",
  "Tarija",
  "Beni",
  "Pando"
];

export default function Precincts() {
  const { precincts, addPrecinct, updatePrecinct, deletePrecinct } = useElection();
  const [newPrecinct, setNewPrecinct] = useState({ 
    name: "", 
    location: "", 
    tables: 1, 
    department: "" 
  });
  const [editPrecinct, setEditPrecinct] = useState<{ 
    id: string; 
    name: string; 
    location: string; 
    tables: number;
    department: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddPrecinct = () => {
    if (newPrecinct.name && newPrecinct.department) {
      addPrecinct(newPrecinct);
      setNewPrecinct({ name: "", location: "", tables: 1, department: "" });
    }
  };

  const handleUpdatePrecinct = () => {
    if (editPrecinct && editPrecinct.name && editPrecinct.department) {
      updatePrecinct(editPrecinct.id, {
        name: editPrecinct.name,
        location: editPrecinct.location,
        tables: editPrecinct.tables,
        department: editPrecinct.department
      });
      setEditPrecinct(null);
    }
  };

  const handleDeletePrecinct = (id: string) => {
    deletePrecinct(id);
  };

  const filteredPrecincts = precincts.filter(
    precinct => 
      precinct.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (precinct.department && precinct.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <PageHeader 
        title="Recintos Electorales" 
        description="Administra los recintos donde se realizará la votación"
      />

      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Buscar recintos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Añadir Recinto</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Recinto Electoral</DialogTitle>
              <DialogDescription>
                Ingresa la información del recinto electoral
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nombre del Recinto
                </label>
                <Input
                  id="name"
                  value={newPrecinct.name}
                  onChange={(e) => setNewPrecinct({ ...newPrecinct, name: e.target.value })}
                  placeholder="Ej: Unidad Educativa Bolivia"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="department" className="text-sm font-medium">
                  Departamento
                </label>
                <Select
                  value={newPrecinct.department}
                  onValueChange={(value) => setNewPrecinct({ ...newPrecinct, department: value })}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Selecciona un departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {BOLIVIA_DEPARTMENTS.map((department) => (
                      <SelectItem key={department} value={department}>
                        {department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="tables" className="text-sm font-medium">
                  Número de Mesas
                </label>
                <Input
                  id="tables"
                  type="number"
                  min="1"
                  value={newPrecinct.tables}
                  onChange={(e) => setNewPrecinct({ ...newPrecinct, tables: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button 
                  onClick={handleAddPrecinct}
                  disabled={!newPrecinct.name || !newPrecinct.department}
                >
                  Guardar
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {precincts.length === 0 ? (
        <EmptyState
          title="Sin recintos electorales"
          description="Aún no hay recintos registrados. Añade tu primer recinto para comenzar."
          actionLabel="Añadir Recinto"
          action={() => document.querySelector<HTMLButtonElement>('button[data-state="closed"]')?.click()}
        />
      ) : filteredPrecincts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No se encontraron recintos que coincidan con "{searchTerm}"</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead className="text-center">Mesas</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrecincts.map((precinct) => (
                <TableRow key={precinct.id}>
                  <TableCell className="font-medium">{precinct.name}</TableCell>
                  <TableCell>{precinct.department || "—"}</TableCell>
                  <TableCell className="text-center">{precinct.tables}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditPrecinct(precinct)}
                          >
                            Editar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Recinto Electoral</DialogTitle>
                            <DialogDescription>
                              Actualiza la información del recinto electoral
                            </DialogDescription>
                          </DialogHeader>
                          {editPrecinct && (
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <label htmlFor="edit-name" className="text-sm font-medium">
                                  Nombre del Recinto
                                </label>
                                <Input
                                  id="edit-name"
                                  value={editPrecinct.name}
                                  onChange={(e) => setEditPrecinct({ ...editPrecinct, name: e.target.value })}
                                />
                              </div>
                              <div className="grid gap-2">
                                <label htmlFor="edit-department" className="text-sm font-medium">
                                  Departamento
                                </label>
                                <Select
                                  value={editPrecinct.department}
                                  onValueChange={(value) => setEditPrecinct({ ...editPrecinct, department: value })}
                                >
                                  <SelectTrigger id="edit-department">
                                    <SelectValue placeholder="Selecciona un departamento" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {BOLIVIA_DEPARTMENTS.map((department) => (
                                      <SelectItem key={department} value={department}>
                                        {department}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid gap-2">
                                <label htmlFor="edit-tables" className="text-sm font-medium">
                                  Número de Mesas
                                </label>
                                <Input
                                  id="edit-tables"
                                  type="number"
                                  min="1"
                                  value={editPrecinct.tables}
                                  onChange={(e) => setEditPrecinct({ ...editPrecinct, tables: parseInt(e.target.value) || 1 })}
                                />
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancelar</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button 
                                onClick={handleUpdatePrecinct}
                                disabled={!editPrecinct?.name || !editPrecinct?.department}
                              >
                                Guardar
                              </Button>
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
                            <AlertDialogTitle>¿Eliminar este recinto?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción eliminará permanentemente el recinto "{precinct.name}" y todos sus datos asociados.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeletePrecinct(precinct.id)}
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
