"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import type { FormEvent } from "react";

export default function resetPasswordPage() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  const resetUserPassword = async () => {
    try {
      await axios.post("/api/users/resetpassword", { token, password });
      setSuccess(true);
    } catch (error: any) {
      setError(true);
      setMessage(error.response?.data?.error || "Password reset failed");
      console.log(error.response?.data);
    }
  };
  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(false);
    setMessage("");
    if (!token) {
      setError(true);
      setMessage("Reset token is missing");
      return;
    }

    if (password !== confirmPassword) {
      setError(true);
      setMessage("Passwords do not match");
      return;
    }
    await resetUserPassword();
  }
  return (
    <div className="flex flex-col justify-center items-center min-h-screen py-2">
      <h1 className="text-4xl">Reset Password</h1>

      {!success && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 p-4 w-full max-w-sm"
        >
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border p-2 rounded"
          />

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="border p-2 rounded"
          />

          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Reset Password
          </button>
        </form>
      )}

      {success && (
        <div className="text-center">
          <h2 className="text-2xl">Password reset successful</h2>
          <Link href="/login" className="text-blue-600 underline">
            Login
          </Link>
        </div>
      )}

      {error && (
        <div>
          <h2 className="text-xl text-red-500">{message}</h2>
        </div>
      )}
    </div>
  );
}
