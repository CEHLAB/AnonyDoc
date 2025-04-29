import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/auth.service';

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    await register(form);
    nav('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Inscription</h2>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Prénom</label>
              <input
                name="firstName"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                onChange={onChange}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Nom</label>
              <input
                name="lastName"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              name="email"
              type="email"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              onChange={onChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Mot de passe</label>
            <input
              name="password"
              type="password"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              onChange={onChange}
              required
            />
          </div>

          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition">
            S’inscrire
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Déjà un compte&nbsp;?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
