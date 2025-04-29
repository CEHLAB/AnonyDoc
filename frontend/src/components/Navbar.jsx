import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { signOut, user } = useAuth();
  const nav = useNavigate();

  const handleLogout = async () => {
    await signOut();
    nav('/login');
  };

  return (
    <header className="bg-gray-800 text-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <span className="font-semibold text-lg">My&nbsp;AI&nbsp;App</span>

        {/* Liens seulement si l'utilisateur est connecté */}
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

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md"
            >
              Déconnexion
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
