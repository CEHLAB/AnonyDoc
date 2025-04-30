import { downloadUrl, downloadOriginalUrl, deleteFile, deleteDoc } from '../services/doc.service';
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
    <li className="bg-white shadow-md rounded-xl p-6 space-y-4">
      {/* Header: filename + actions */}
      <div className="flex justify-between items-center">
        {doc.filePath ? (
          <a
            href={downloadOriginalUrl(doc.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-lg text-gray-800 hover:underline transition"
          >
            {doc.originalname}
          </a>
        ) : (
          <span className="font-semibold text-lg text-gray-400 line-through cursor-not-allowed">
            {doc.originalname}
          </span>
        )}

        <div className="flex gap-3">
        <a
            href={downloadUrl(doc.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition"
          >
            Télécharger le fichier anonymisé
          </a>
          <Link
            to={`/doc/${doc.id}`}
            className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition"
          >
            Détail
          </Link>
          
        </div>
      </div>

      {/* Previews */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-gray-600">Original</h4>
          <div className="bg-gray-50 p-3 rounded h-24 overflow-auto text-xs whitespace-pre-wrap">
            {cut(doc.original)}
          </div>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-green-700">Anonymisé</h4>
          <div className="bg-green-50 p-3 rounded h-24 overflow-auto text-xs whitespace-pre-wrap">
            {cut(doc.anonymized)}
          </div>
        </div>
      </div>

      {/* Footer: date + delete buttons */}
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>{new Date(doc.createdAt).toLocaleString()}</span>
        <div className="flex gap-3">
          {doc.filePath && (
            <button
              onClick={handleDeleteFile}
              className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition text-sm"
            >
              Suppr. fichier original
            </button>
          )}
          <button
            onClick={handleDeleteDoc}
            className="px-2 py-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition text-sm"
          >
            Suppr. enregistrement
          </button>
        </div>
      </div>
    </li>
  );
}
