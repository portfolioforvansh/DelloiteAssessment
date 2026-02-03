import React from "react";
import "./styles/global.css";
import Dashboard from "./components/Dashboard";

const App: React.FC = () => (
  <div className="app-container">
    <header className="app-header professional-header">
      <div className="header-content">
        <h1 className="header-title">User Dashboard</h1>
        <span className="header-subtitle">Assessment & Data Visualization</span>
      </div>
    </header>
    <main>
      <Dashboard />
    </main>
  </div>
);

export default App;
