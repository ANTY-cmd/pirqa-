
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ElectionProvider } from "@/context/ElectionContext";
import PageLayout from "@/components/PageLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import Precincts from "./pages/Precincts";
import Candidates from "./pages/Candidates";
import Tables from "./pages/Tables";
import Votes from "./pages/Votes";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ElectionProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PageLayout><Dashboard /></PageLayout>} />
            <Route path="/recintos" element={<PageLayout><Precincts /></PageLayout>} />
            <Route path="/candidatos" element={<PageLayout><Candidates /></PageLayout>} />
            <Route path="/mesas" element={<PageLayout><Tables /></PageLayout>} />
            <Route path="/votos" element={<PageLayout><Votes /></PageLayout>} />
            <Route path="/resultados" element={<PageLayout><Results /></PageLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ElectionProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
