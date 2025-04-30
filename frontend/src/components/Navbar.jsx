import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { signOut, user } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  const handleLogout = async () => {
    await signOut();
    nav('/login');
  };

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="bg-gray-800 text-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <span className="font-semibold text-lg">My&nbsp;AI&nbsp;App</span>

        {user && (
          <nav className="flex items-center gap-6 text-sm">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? 'underline' : 'hover:underline'
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/history"
              className={({ isActive }) =>
                isActive ? 'underline' : 'hover:underline'
              }
            >
              Historique
            </NavLink>

            {/* Menu “Mon compte” */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md"
              >
                Mon compte
                <svg
                  className={`w-4 h-4 transition-transform ${
                    open ? 'rotate-180' : 'rotate-0'
                  }`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {open && (
                <ul className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg z-10">
                  <li>
                    <NavLink
                      to="/settings"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setOpen(false)}
                    >
                      Paramètres avancées
                    </NavLink>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Se déconnecter
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
