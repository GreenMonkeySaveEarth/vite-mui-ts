import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from '@/pages/Auth/Register';
import Login from '@/pages/Auth/Login';
import Home from '@/pages/Home/Home';
import ClinicalNotesPage from '@/pages/ClinicalNotes';
import PatientQueueDashboard from '@/pages/PatientQueueDashboard';
import LiveTranscriptionFeed from '@/pages/LiveTranscriptionFeed/LiveTranscriptionFeed';
import ListUsers from '@/pages/ListUsers';


const testUsers = [
  { firstName: "John", lastName: "Smith" },
  { firstName: "Jane", lastName: "Doe" },
  { firstName: "Robert", lastName: "Johnson" },
  { firstName: "Emily", lastName: "Williams" },
  { firstName: "Michael", lastName: "Brown" },
  { firstName: "Sarah", lastName: "Davis" },
  { firstName: "David", lastName: "Miller" },
  { firstName: "Jennifer", lastName: "Wilson" },
  { firstName: "James", lastName: "Taylor" },
  { firstName: "Lisa", lastName: "Anderson" },
  { firstName: "William", lastName: "Thomas" },
  { firstName: "Elizabeth", lastName: "Jackson" },
  { firstName: "Richard", lastName: "White" },
  { firstName: "Mary", lastName: "Harris" },
  { firstName: "Thomas", lastName: "Martin" },
  { firstName: "Patricia", lastName: "Thompson" },
  { firstName: "Charles", lastName: "Garcia" },
  { firstName: "Jessica", lastName: "Martinez" },
  { firstName: "Daniel", lastName: "Robinson" },
  { firstName: "Nancy", lastName: "Clark" }
];
const Routing = () => {
  return (
    <Routes>
      <Route path="*" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/notes" element={<ClinicalNotesPage />} />
      <Route path="/patients" element={<PatientQueueDashboard />} />
      <Route path="/transcription" element={<LiveTranscriptionFeed />} />
      <Route path="/list" element={<ListUsers users={testUsers} />} />
    </Routes>
  );
};

export default Routing;
