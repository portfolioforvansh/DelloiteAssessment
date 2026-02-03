import React from "react";
import "./styles/global.css";
import Dashboard from "./components/Dashboard";

const App: React.FC = () => (
  <div className="app-container">
    <header className="app-header">
      <h1>User Dashboard Assessment</h1>
    </header>
    <main>
      <Dashboard />
    </main>
  </div>
);

export default App;
