import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";

import HomeFeed from "./pages/HomeFeed";
import CreateRecord from "./pages/CreateRecord";
import MapView from "./pages/MapView";
import RecordDetail from "./pages/RecordDetail";
import Profile from "./pages/Profile";
import Alerts from "./pages/Alerts";
import AdminReview from "./pages/AdminReview";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
          <Navbar />
          <main className="mx-auto max-w-2xl px-4 pt-2 pb-24">
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<HomeFeed />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/create" element={<CreateRecord />} />
              <Route path="/record/:id" element={<RecordDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/admin" element={<AdminReview />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </main>
          <BottomNav />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
