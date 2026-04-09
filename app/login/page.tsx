"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../src/application/authService";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await login(email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden
    bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">

      {/* luces difusas fondo */}
      <div className="absolute w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-3xl -top-40 -left-40"></div>
      <div className="absolute w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-3xl bottom-0 right-0"></div>

      {/* card */}
      <div className="relative w-full max-w-md p-10 rounded-2xl shadow-2xl
      bg-white/10 backdrop-blur-xl border border-white/20">

        <h1 className="text-3xl font-bold text-white text-center">
          LEVA Systems
        </h1>

        <p className="text-center text-gray-300 mt-2 mb-8">
          Inicia sesión para continuar
        </p>

        <form onSubmit={handleLogin} className="space-y-5">

          {/* email */}
          <div className="relative">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30
              text-white placeholder-gray-300
              focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* password */}
          <div className="relative">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30
              text-white placeholder-gray-300
              focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* button */}
          <button
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-white
            bg-purple-600 hover:bg-purple-700
            transition-all active:scale-95
            flex items-center justify-center gap-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}

            {loading ? "Entrando..." : "Iniciar sesión"}
          </button>

        </form>

        {error && (
          <p className="text-red-400 text-sm text-center mt-5">
            {error}
          </p>
        )}

      </div>

    </div>
  );
}