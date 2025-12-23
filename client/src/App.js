import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
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
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FiHome, FiUsers, FiUser, FiBriefcase, FiMail, FiMenu, FiX, FiUserCheck, FiFileText, FiChevronDown, FiChevronUp, FiSettings, FiBell, FiSearch, FiLogOut } from 'react-icons/fi';
import SearchGlobal from './components/SearchGlobal';

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

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
            {user && (
              <span className="nav-user-info">
                {user.prenom} {user.nom}
                {user.role === 'admin' && <span className="nav-role-badge">Admin</span>}
              </span>
            )}
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
          {user && (
            <li className="nav-user-menu">
              <button onClick={handleLogout} className="nav-logout-btn" title="Déconnexion">
                <FiLogOut />
                <span>Déconnexion</span>
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
    <SearchGlobal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

function AppContent() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rappels"
              element={
                <ProtectedRoute>
                  <Rappels />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients"
              element={
                <ProtectedRoute>
                  <Clients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/prospects"
              element={
                <ProtectedRoute>
                  <Prospects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/opportunites"
              element={
                <ProtectedRoute>
                  <Opportunites />
                </ProtectedRoute>
              }
            />
            <Route
              path="/apporteurs"
              element={
                <ProtectedRoute>
                  <Apporteurs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/googlesheets"
              element={
                <ProtectedRoute>
                  <GoogleSheets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/outlook"
              element={
                <ProtectedRoute>
                  <Outlook />
                </ProtectedRoute>
              }
            />
            <Route
              path="/email-templates"
              element={
                <ProtectedRoute>
                  <EmailTemplates />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
