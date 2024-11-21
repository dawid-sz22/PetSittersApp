import { BaseModalProps } from "../../types";
import { useState } from "react";
import { handleLoginAPI, handleUpdateUserAPI } from "../../apiConfig";
import { toast } from "react-toastify";

export function EmailModal({ isOpen, onClose }: BaseModalProps) {
  const [email, setEmail] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleLoginAPI(email, password);
      await handleUpdateUserAPI({ email: email });
      onClose();
      toast.success("Email został zmieniony!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        style: {
          fontSize: "1.2rem",
          fontWeight: "bold",
          width: "100%",
        },
      });

      // Reset form
      setEmail("");
      setEmailConfirm("");
      setPassword("");
    } catch (err) {
      toast.error("Nie udało się zmienić emaila :(", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        style: {
          fontSize: "1.2rem",
          fontWeight: "bold",
          width: "100%",
        },
      });
      console.error("Error updating email:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Zmień email</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label
              htmlFor="new-email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nowy email
            </label>
            <input
              id="new-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="confirm-email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Powtórz email
            </label>
            <input
              id="confirm-email"
              type="email"
              value={emailConfirm}
              onChange={(e) => setEmailConfirm(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="verify-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Podaj hasło w ramach weryfikacji
            </label>
            <input
              id="verify-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-700 text-white rounded"
            >
              Zmień email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 