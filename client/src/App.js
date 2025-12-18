import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import Clients from './components/Clients';
import Contacts from './components/Contacts';
import Opportunites from './components/Opportunites';
import Outlook from './components/Outlook';
import Apporteurs from './components/Apporteurs';
import GoogleSheets from './components/GoogleSheets';
import { FiHome, FiUsers, FiUser, FiBriefcase, FiMail, FiMenu, FiX, FiUserCheck, FiFileText } from 'react-icons/fi';

function Navigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Tableau de bord', icon: FiHome },
    { path: '/clients', label: 'Clients', icon: FiUsers },
    { path: '/contacts', label: 'Contacts', icon: FiUser },
    { path: '/opportunites', label: 'Opportunités', icon: FiBriefcase },
    { path: '/apporteurs', label: 'Apporteurs', icon: FiUserCheck },
    { path: '/googlesheets', label: 'Google Sheets', icon: FiFileText },
    { path: '/outlook', label: 'Outlook', icon: FiMail },
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <h1>CRM</h1>
        </div>
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
        <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={location.pathname === item.path ? 'active' : ''}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/opportunites" element={<Opportunites />} />
            <Route path="/apporteurs" element={<Apporteurs />} />
            <Route path="/googlesheets" element={<GoogleSheets />} />
            <Route path="/outlook" element={<Outlook />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
