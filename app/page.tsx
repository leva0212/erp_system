"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { supabase } from "@/src/infrastructure/supabaseClient";

export default function Page() {

  const { user, loading } = useAuth();

  const [fechaHora, setFechaHora] = useState<Date | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    setFechaHora(new Date());

    const timer = setInterval(() => {
      setFechaHora(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (user) {
      setDisplayName(user.user_metadata?.display_name ?? "");
      setPhotoUrl(user.user_metadata?.photo_url ?? "");
    }
  }, [user]);

  async function uploadAvatar(e: any) {

    const file = e.target.files?.[0];
    if (!file || !user) return;

    const fileName = `${user.id}-${Date.now()}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file);

    if (error) {
      console.error(error);
      return;
    }

    const { data } = supabase
      .storage
      .from("avatars")
      .getPublicUrl(fileName);

    setPhotoUrl(data.publicUrl);
  }

  async function updateProfile() {

    await supabase.auth.updateUser({
      data: {
        display_name: displayName,
        photo_url: photoUrl
      }
    });

    setEditOpen(false);
  }

  if (!fechaHora || loading) return null;

  const fechaFormateada = fechaHora.toLocaleDateString("es-CR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const horaFormateada = fechaHora.toLocaleTimeString("es-CR");

  return (
    <div className="flex items-center justify-center h-screen bg-purple-50">

      <div className="p-10 bg-white rounded-3xl shadow-xl text-center w-full max-w-md">

        {/* FOTO */}
        <div className="flex justify-center mb-4">

          {photoUrl ? (
            <img
              src={photoUrl}
              className="w-28 h-28 rounded-2xl object-cover shadow-md cursor-pointer"
              onClick={() => setEditOpen(true)}
            />
          ) : (
            <div
              onClick={() => setEditOpen(true)}
              className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer text-3xl"
            >
              👤
            </div>
          )}

        </div>

        {/* NOMBRE */}
        {user && (
          <>
            <p className="text-xl font-semibold text-gray-800">
              {displayName || "Usuario"}
            </p>

            <p className="text-gray-500">
              {user.email}
            </p>
          </>
        )}

        <p className="mt-6 text-gray-700">
          {fechaFormateada}
        </p>

        <p className="text-purple-500 text-lg font-mono">
          {horaFormateada}
        </p>

      </div>

      {/* MODAL */}
      {editOpen && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-96">

            <h2 className="text-xl font-semibold mb-4">
              Editar perfil
            </h2>

            <input
              className="w-full border p-2 mb-3 rounded"
              placeholder="Display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />

            <input
              type="file"
              accept="image/*"
              onChange={uploadAvatar}
              className="mb-4"
            />

            <div className="flex justify-end gap-2">

              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => setEditOpen(false)}
              >
                Cancelar
              </button>

              <button
                className="px-4 py-2 bg-purple-600 text-white rounded"
                onClick={updateProfile}
              >
                Guardar
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}