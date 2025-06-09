import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PatientRegistration from './pages/PatientRegistration';
import ClinicalEvolution from './pages/ClinicalEvolution';
import WoundGallery from './pages/WoundGallery';
import Reports from './pages/Reports';
import QuickConsultation from './pages/QuickConsultation';
import ProfessionalProfile from './pages/ProfessionalProfile';
import Settings from './pages/Settings';
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patient-registration" element={<PatientRegistration />} />
            <Route path="/clinical-evolution" element={<ClinicalEvolution />} />
            <Route path="/wound-gallery" element={<WoundGallery />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/quick-consultation" element={<QuickConsultation />} />
            <Route path="/professional-profile" element={<ProfessionalProfile />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
        <Navigation />
      </div>
    </Router>
  );
}

export default App;