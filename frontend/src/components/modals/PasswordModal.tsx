import { BaseModalProps } from "../../types";
import { useState, useEffect } from "react";
import { handleLoginAPI, handleUpdateUserAPI } from "../../apiConfig";
import { toast } from "react-toastify";

export function PasswordModal({ isOpen, onClose }: BaseModalProps, email: string) {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState("");
  useEffect(() => {
    if (newPassword && newPassword.length < 8) {
      setPasswordError("Minimalna wymagana ilość znaków: 8");
    } else if (newPasswordConfirm && newPassword !== newPasswordConfirm) {
      setPasswordError("Podane hasła nie są identyczne");
    } else {
      setPasswordError("");
    }
  }, [newPassword, newPasswordConfirm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await handleLoginAPI(email, password);
      await handleUpdateUserAPI({ password: newPassword });
      onClose();
      toast.success("Hasło zostało zmienione!", {
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
      setPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
    } catch (err) {
      toast.error("Nie udało się zmienić hasła :(", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        style: {
          fontSize: "1.2rem",
          fontWeight: "bold",
          width: "100%",
        },
      });
      console.error("Error updating password:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Zmień hasło</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label
              htmlFor="current-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Obecne hasło
            </label>
            <input
              id="current-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nowe hasło
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Powtórz nowe hasło
            </label>
            <input
              id="confirm-password"
              type="password"
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          {passwordError && (
            <p className="text-red-500 text-sm mb-4">{passwordError}</p>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:cursor-pointer hover:bg-gray-300"
            >
              Anuluj
            </button>
            <input
              type="submit"
              value="Zmień hasło"
              className="px-4 py-2 hover:cursor-pointer hover:bg-blue-800 bg-blue-700 text-white rounded disabled:bg-gray-400"
              disabled={!!passwordError}
            />
          </div>
        </form>
      </div>
    </div>
  );
} 