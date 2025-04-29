import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDoc, downloadUrl } from "../services/doc.service";

export default function DocumentDetail() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    getDoc(id).then(({ data }) => setDoc(data));
  }, [id]);

  if (!doc) return <p className="p-8">Chargement…</p>;

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-6">
      <h1 className="text-xl font-semibold">{doc.originalname}</h1>

      <section>
        <h3 className="font-semibold mb-2">Texte original</h3>
        <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap max-h-96 overflow-auto">
          {doc.original}
        </pre>
      </section>

      <section>
        <h3 className="font-semibold mb-2 text-green-700">Texte anonymisé</h3>
        <pre className="bg-green-50 p-4 rounded whitespace-pre-wrap max-h-96 overflow-auto">
          {doc.anonymized}
        </pre>
      </section>

      <a
        href={downloadUrl(doc.id)}
        target="_blank"
        className="text-blue-600 underline"
      >
        Télécharger le fichier anonymisé
      </a>
    </div>
  );
}
