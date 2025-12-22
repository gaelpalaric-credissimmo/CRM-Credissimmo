import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import Clients from './components/Clients';
import Prospects from './components/Prospects';
import Opportunites from './components/Opportunites';
import Outlook from './components/Outlook';
import Apporteurs from './components/Apporteurs';
import GoogleSheets from './components/GoogleSheets';
import Rappels from './components/Rappels';
import EmailTemplates from './components/EmailTemplates';
import { FiHome, FiUsers, FiUser, FiBriefcase, FiMail, FiMenu, FiX, FiUserCheck, FiFileText, FiChevronDown, FiChevronUp, FiSettings, FiBell, FiSearch } from 'react-icons/fi';
import SearchGlobal from './components/SearchGlobal';

function Navigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Fermer le menu déroulant quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isIntegrationsOpen && !event.target.closest('.nav-dropdown')) {
        setIsIntegrationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isIntegrationsOpen]);

  const navItems = [
    { path: '/', label: 'Tableau de bord', icon: FiHome },
    { path: '/rappels', label: 'Rappels', icon: FiBell },
    { path: '/clients', label: 'Clients', icon: FiUsers },
    { path: '/prospects', label: 'Prospects', icon: FiUser },
    { path: '/opportunites', label: 'Opportunités', icon: FiBriefcase },
    { path: '/apporteurs', label: 'Apporteurs', icon: FiUserCheck },
  ];

  const integrationItems = [
    { path: '/googlesheets', label: 'Google Sheets', icon: FiFileText },
    { path: '/outlook', label: 'Outlook', icon: FiMail },
    { path: '/email-templates', label: 'Templates emails', icon: FiMail },
  ];

  const isIntegrationActive = integrationItems.some(item => location.pathname === item.path);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <h1>CRM</h1>
          </div>
          <div className="nav-search-trigger">
            <button
              className="search-trigger-btn"
              onClick={() => setIsSearchOpen(true)}
              title="Recherche globale (Ctrl+K)"
            >
              <FiSearch />
              <span className="search-trigger-text">Rechercher...</span>
              <kbd className="search-shortcut-key">Ctrl+K</kbd>
            </button>
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
          <li className="nav-dropdown">
            <button
              className={`nav-dropdown-toggle ${isIntegrationActive ? 'active' : ''}`}
              onClick={() => setIsIntegrationsOpen(!isIntegrationsOpen)}
            >
              <FiSettings />
              <span>Intégrations</span>
              {isIntegrationsOpen ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {isIntegrationsOpen && (
              <ul className="nav-dropdown-menu">
                {integrationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={location.pathname === item.path ? 'active' : ''}
                        onClick={() => {
                          setIsIntegrationsOpen(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        </ul>
      </div>
    </nav>
    <SearchGlobal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
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
            <Route path="/rappels" element={<Rappels />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/prospects" element={<Prospects />} />
            <Route path="/opportunites" element={<Opportunites />} />
            <Route path="/apporteurs" element={<Apporteurs />} />
            <Route path="/googlesheets" element={<GoogleSheets />} />
            <Route path="/outlook" element={<Outlook />} />
            <Route path="/email-templates" element={<EmailTemplates />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
