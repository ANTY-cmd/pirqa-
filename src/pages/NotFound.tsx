
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="inline-block mb-6">
          <div className="h-24 w-24 rounded bg-andes-terra flex items-center justify-center text-white text-6xl mx-auto">
            ?
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-andes-terra">Página no encontrada</h1>
        <p className="text-xl text-muted-foreground mb-8">
          La página que estás buscando no existe o ha sido movida.
        </p>
        <div className="andean-pattern-divider w-40 mx-auto mb-8"></div>
        <Button asChild>
          <Link to="/">Volver al Inicio</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
