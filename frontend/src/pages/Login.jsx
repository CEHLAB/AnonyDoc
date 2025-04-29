import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, getMe } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const nav = useNavigate();
  const { setUser } = useAuth();
  const [f, sF] = useState({ email: '', password: '' });
  const onChange = (e) => sF({ ...f, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    await login(f);
    const { data } = await getMe();
    setUser(data);
    nav('/dashboard');
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Connexion</h2>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              onChange={onChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mot de passe</label>
            <input
              name="password"
              type="password"
              onChange={onChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
          >
            Se connecter
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          T’as pas de compte ?{' '}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
