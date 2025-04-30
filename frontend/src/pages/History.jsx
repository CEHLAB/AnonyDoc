import { useEffect, useState } from 'react';
import api from '../services/api';
import HistoryItem from '../components/HistoryItem';

export default function History() {
  const [docs, setDocs] = useState([]);

  const refresh = () => {
    api.get('/doc').then(({ data }) => setDocs(data));
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-2xl mb-6">Mes documents</h1>

      {docs.length === 0 ? (
        <p className="text-gray-600">Aucun document traité pour le moment.</p>
      ) : (
        <ul className="space-y-6">
          {docs.map((d) => (
            <HistoryItem key={d.id} doc={d} refresh={refresh} />
          ))}
        </ul>
      )}
    </div>
  );
}
