import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { PageTransition } from "./components/PageTransition";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { lazy, Suspense } from "react";

// Lazy load all route components for code splitting
const Landing = lazy(() => import("./pages/Landing"));
const About = lazy(() => import("./pages/About"));
const Generate = lazy(() => import("./pages/Generate"));
const Auth = lazy(() => import("./pages/Auth"));
const History = lazy(() => import("./pages/History"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Minimal loading fallback to avoid layout shift
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <Suspense fallback={<PageLoader />}>
      <PageTransition key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
    </Suspense>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SpeedInsights />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
