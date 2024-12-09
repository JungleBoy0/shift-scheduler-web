import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TosDialog } from "./components/TosDialog";
import Index from "./pages/Index";
import Preview from "./pages/Preview";
import ScheduleEditor from "./pages/ScheduleEditor";
import FullSchedule from "./pages/FullSchedule";
import Login from "./pages/Login";
import { ErrorBoundary } from "react-error-boundary";

const queryClient = new QueryClient();

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Coś poszło nie tak</h2>
        <p className="text-muted-foreground">{error.message}</p>
        <Button onClick={() => window.location.reload()}>
          Odśwież stronę
        </Button>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">404 - Strona nie znaleziona</h2>
        <p className="text-muted-foreground">
          Przepraszamy, ale strona której szukasz nie istnieje.
        </p>
        <Button onClick={() => window.history.back()}>
          Wróć do poprzedniej strony
        </Button>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin } = useAuth();
  if (!admin) return <Navigate to="/login" />;
  return <>{children}</>;
}

function AppRoutes() {
  const { admin } = useAuth();

  return (
    <>
      {admin && (
        <>
          <Navigation />
          <TosDialog />
        </>
      )}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/preview" element={<ProtectedRoute><Preview /></ProtectedRoute>} />
        <Route path="/editor" element={<ProtectedRoute><ScheduleEditor /></ProtectedRoute>} />
        <Route path="/full-schedule" element={<ProtectedRoute><FullSchedule /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} SchedFlow by Kacper.S</p>
      </footer>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <TooltipProvider>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
                <Toaster />
                <Sonner />
                <AppRoutes />
              </div>
            </ErrorBoundary>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;