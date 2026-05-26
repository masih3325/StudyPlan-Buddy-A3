import React, { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import CreateStudyPlan from "./components/CreateStudyPlan";
import SavedStudyPlans from "./components/SavedStudyPlans";
import Confirmation from "./components/Confirmation";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  function handleLogin(email) {
    setUser({ email });
    navigate("/create");
  }

  function handleLogout() {
    setUser(null);
    navigate("/");
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>StudyPlan Buddy v2</h1>
        {user && (
          <div className="nav-bar">
            <Link to="/create">Create Plan</Link>
            <Link to="/saved">Saved Plans</Link>
            <button className="btn-link" onClick={handleLogout}>
              Logout ({user.email})
            </button>
          </div>
        )}
      </header>

      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <p style={{ textAlign: "center", marginTop: "2rem" }}>
                  Welcome! Go to <Link to="/create">Create Plan</Link> or{" "}
                  <Link to="/saved">Saved Plans</Link>.
                </p>
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/create"
            element={
              user ? (
                <CreateStudyPlan user={user} />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/saved"
            element={
              user ? <SavedStudyPlans /> : <Login onLogin={handleLogin} />
            }
          />
          <Route path="/confirmation" element={<Confirmation />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;