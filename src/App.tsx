
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { MainLayout } from "@/components/layout/MainLayout";
import Home from "@/pages/Home";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Mentorship from "@/pages/Mentorship";
import Network from "@/pages/Network";
import AIAssistant from "@/pages/AIAssistant";
import Chat from "@/pages/Chat";
import Events from "@/pages/Events";
import AuthCallback from "@/pages/AuthCallback";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster richColors position="top-right" />
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="home" element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="profile/:userId" element={<Profile />} />
              <Route path="mentorship" element={<Mentorship />} />
              <Route path="network" element={<Network />} />
              <Route path="assistant" element={<AIAssistant />} />
              <Route path="chat" element={<Chat />} />
              <Route path="events" element={<Events />} />
              <Route path="auth/callback" element={<AuthCallback />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
