import { BaseModalProps } from "../../types";
import { deletePetSitterAPI } from "../../apiConfig";
import { toast } from "react-toastify";

export function DeletePetSitterModal({ isOpen, onClose }: BaseModalProps) {

  const handleDelete = async () => {
    try {
      await deletePetSitterAPI();
      toast.success("Konto opiekuna zostało usunięte!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        style: {
          fontSize: "1.2rem",
          fontWeight: "bold",
          width: "100%",
        },
        onClose: () => {
          window.location.reload();
        },
      });
    } catch (err) {
      toast.error("Nie udało się usunąć konta opiekuna", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        style: {
          fontSize: "1.2rem",
          fontWeight: "bold",
          width: "100%",
        },
      });
      console.error("Error deleting petsitter account:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Usuń konto opiekuna</h2>
        <p className="mb-4 text-gray-700">
          Czy na pewno chcesz usunąć konto opiekuna? Ta operacja jest
          nieodwracalna.
        </p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
            Anuluj
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Usuń konto
          </button>
        </div>
      </div>
    </div>
  );
}
