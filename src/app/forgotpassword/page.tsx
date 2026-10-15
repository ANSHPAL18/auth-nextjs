"use client";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";

export default function forgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  const forgotPassword = async () => {
    try {
      const response = await axios.post("/api/users/forgotpassword", { email });

      setSuccess(true);
      setMessage(
        response.data.message || "Check your email for the reset link",
      );
    } catch (error: any) {
      setError(true);
      setMessage(error.response?.data?.error || "Something went wrong");
      console.log(error.response?.data);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(false);
    setSuccess(false);
    setMessage("");

    if (!email) {
      setError(true);
      setMessage("Please enter your email");
      return;
    }

    await forgotPassword();
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen py-2">
      <h1 className="text-4xl">Forgot Password</h1>

      {!success && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 p-4 w-full max-w-sm"
        >
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border p-2 rounded"
          />

          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Send Reset Link
          </button>
        </form>
      )}

      {success && (
        <div className="text-center">
          <h2 className="text-xl text-green-600">{message}</h2>
        </div>
      )}

      {error && (
        <div>
          <h2 className="text-xl text-red-500">{message}</h2>
        </div>
      )}

      <Link href="/login" className="text-blue-600 underline mt-4">
        Back to Login
      </Link>
    </div>
  );
}
