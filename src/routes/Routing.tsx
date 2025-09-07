import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from '@/pages/Auth/Register';
import Login from '@/pages/Auth/Login';
import Home from '@/pages/Home/Home';
import ClinicalNotesPage from '@/pages/ClinicalNotes';
import PatientQueueDashboard from '@/pages/PatientQueueDashboard';
import LiveTranscriptionFeed from '@/pages/LiveTranscriptionFeed/LiveTranscriptionFeed';

const Routing = () => {
  return (
    <Routes>
      <Route path="*" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/notes" element={<ClinicalNotesPage />} />
      <Route path="/patients" element={<PatientQueueDashboard />} />
      <Route path="/transcription" element={<LiveTranscriptionFeed />} />
    </Routes>
  );
};

export default Routing;
