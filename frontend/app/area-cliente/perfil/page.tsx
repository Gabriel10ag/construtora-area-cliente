"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = "http://localhost:4000";

type Profile = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  document?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export default function PerfilPage() {
  const router = useRouter();
  const [tokenChecked, setTokenChecked] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [document, setDocument] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Verifica token
  useEffect(() => {
    const storedToken =
      typeof window !== "undefined"
        ? window.localStorage.getItem("token")
        : null;

    if (!storedToken) {
      router.replace("/login");
      return;
    }

    setToken(storedToken);
    setTokenChecked(true);
  }, [router]);

  // Carrega perfil
  useEffect(() => {
    if (!tokenChecked || !token || !API_BASE_URL) return;

    async function loadProfile() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE_URL}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Não foi possível carregar seus dados.");
        }

        const data: Profile = await res.json();
        setProfile(data);
        setName(data.name || "");
        setPhone(data.phone || "");
        setDocument(data.document || "");
      } catch (err: any) {
        setError(err.message || "Erro ao carregar perfil.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [tokenChecked, token]);

  // Salva perfil
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !API_BASE_URL) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const body = {
        name: name || undefined,
        phone: phone || undefined,
        document: document || undefined,
      };

      const res = await fetch(`${API_BASE_URL}/profile/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(
          errBody.message || "Não foi possível salvar as alterações."
        );
      }

      const updated: Profile = await res.json();
      setProfile(updated);
      setSuccess("Dados atualizados com sucesso!");
    } catch (err: any) {
      setError(err.message || "Erro ao salvar alterações.");
    } finally {
      setSaving(false);
    }
  }

  // ========= RENDER ==========
  if (!tokenChecked) return <p>Carregando...</p>;

  if (!API_BASE_URL) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Meu Perfil</h1>
        <div className="bg-red-200 p-4 rounded">
          Você precisa definir NEXT_PUBLIC_API_BASE_URL.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Meu Perfil</h1>
        <p className="text-sm text-gray-600">
          Atualize seus dados cadastrais.
        </p>
      </header>

      {error && (
        <div className="bg-red-200 text-red-800 p-3 rounded">{error}</div>
      )}

      {success && (
        <div className="bg-green-200 text-green-800 p-3 rounded">
          {success}
        </div>
      )}

      <section className="bg-white shadow p-4 rounded-lg">
        {loading || !profile ? (
          <p>Carregando...</p>
        ) : (
          <form onSubmit={handleSave} className="space-y-4 max-w-xl">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                disabled
                className="w-full border bg-gray-100 text-gray-600 rounded px-3 py-2"
                value={profile.email}
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Telefone
              </label>
              <input
                className="w-full border rounded px-3 py-2"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* Documento */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Documento
              </label>
              <input
                className="w-full border rounded px-3 py-2"
                value={document}
                onChange={(e) => setDocument(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
