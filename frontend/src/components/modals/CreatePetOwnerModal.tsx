import { BaseModalProps } from "../../types";
import { useState } from "react";
import { createPetOwnerAPI } from "../../apiConfig";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

export function CreatePetOwnerModal({ isOpen, onClose }: BaseModalProps) {
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createPetOwnerAPI({
        description_bio: description,
      });
      
      toast.success("Profil właściciela został utworzony!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        style: {
          fontSize: "1.2rem",
          fontWeight: "bold",
          width: "100%",
        },
      });
      
      onClose();
      window.location.href = '/pet-owner-profile';
    } catch (err) {
      toast.error("Nie udało się utworzyć profilu właściciela :(", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        style: {
          fontSize: "1.2rem",
          fontWeight: "bold",
          width: "100%",
        },
      });
      console.error("Error creating pet owner profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Utwórz profil właściciela zwierząt</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Opis profilu
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded h-32 resize-none"
              placeholder="Napisz coś o sobie..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Anuluj
            </button>
            {isLoading ? (
              <CircularProgress size={24} />
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
              >
                Utwórz profil
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 