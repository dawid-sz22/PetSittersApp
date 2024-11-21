import { BaseModalProps } from "../../types";
import { deleteUserAPI } from "../../apiConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export function DeleteUserModal({ isOpen, onClose }: BaseModalProps) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await deleteUserAPI();
      toast.success("Konto zostało usunięte!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        style: {
          fontSize: "1.2rem",
          fontWeight: "bold",
          width: "100%",
        },
      });
      localStorage.clear();
      navigate("/");
    } catch (err) {
      toast.error("Nie udało się usunąć konta :(", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        style: {
          fontSize: "1.2rem",
          fontWeight: "bold",
          width: "100%",
        },
      });
      console.error("Error deleting user account:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Usuń konto</h2>
        <p className="mb-4 text-gray-700">
          Czy na pewno chcesz usunąć swoje konto? Ta operacja jest nieodwracalna.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
          >
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