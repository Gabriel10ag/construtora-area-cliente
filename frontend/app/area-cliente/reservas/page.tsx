'use client';

import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:4000';

export default function ReservasPage() {
  const [reservas, setReservas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/common-areas/reservations/my`, {
          credentials: 'include',
        });
        const data = await res.json();
        setReservas(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Carregando reservas...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Minhas reservas</h1>
      {reservas.length === 0 && <p>Você ainda não possui reservas.</p>}
      <ul className="space-y-3">
        {reservas.map((r) => (
          <li
            key={r.id}
            className="border rounded-md p-3 flex flex-col gap-1"
          >
            <span className="font-medium">{r.commonArea?.name}</span>
            <span>
              {new Date(r.startDateTime).toLocaleString()} -{' '}
              {new Date(r.endDateTime).toLocaleString()}
            </span>
            <span className="text-sm text-gray-600">
              Status: {r.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
