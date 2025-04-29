import { downloadUrl } from '../services/doc.service';
import { deleteFile, deleteDoc } from '../services/doc.service';
import { Link } from 'react-router-dom';

export default function HistoryItem({ doc, refresh }) {
  const cut = (t) => (t.length > 120 ? t.slice(0, 117) + '…' : t);

  const handleDeleteFile = async () => {
    await deleteFile(doc.id);
    refresh();
  };
  const handleDeleteDoc = async () => {
    if (confirm('Supprimer cet enregistrement ?')) {
      await deleteDoc(doc.id);
      refresh();
    }
  };

  return (
    <li className="border rounded p-4 space-y-3">
      <div className="flex justify-between items-center">
        <span className={`${doc.filePath ? '' : 'line-through text-gray-400'}`}>
          {doc.originalname}
        </span>
        <div className="flex gap-4">
          <Link to={`/doc/${doc.id}`} className="text-blue-600 underline">
            Voir détail
          </Link>
          <a
            href={downloadUrl(doc.id)}
            target="_blank"
            className="text-blue-600 underline"
          >
            Télécharger
          </a>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 text-xs whitespace-pre-wrap">
        <div>
          <h4 className="font-semibold mb-1">Original</h4>
          <p className="bg-gray-50 p-2 rounded h-24 overflow-auto">{cut(doc.original)}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-1 text-green-700">Anonymisé</h4>
          <p className="bg-green-50 p-2 rounded h-24 overflow-auto">{cut(doc.anonymized)}</p>
        </div>
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <span>{new Date(doc.createdAt).toLocaleString()}</span>

        <div className="flex gap-4">
          {doc.filePath && (
            <button
              onClick={handleDeleteFile}
              className="text-red-600 hover:underline"
            >
              Supprimer fichier
            </button>
          )}
          <button
            onClick={handleDeleteDoc}
            className="text-red-600 hover:underline"
          >
            Supprimer ligne
          </button>
        </div>
      </div>
    </li>
  );
}
