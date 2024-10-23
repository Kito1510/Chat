import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import Login from './components/Login';
import Chat from './components/Chat';

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={user ? <Navigate to="/chat" /> : <Login />} 
        />
        <Route 
          path="/chat" 
          element={user ? <Chat /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
