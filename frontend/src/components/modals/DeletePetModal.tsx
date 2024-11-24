import { deletePetAPI } from "../../apiConfig";
import { toast } from "react-toastify";
import { Pet } from "../../types";

interface DeletePetModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: Pet;
  onPetDeleted: () => void;
}

export function DeletePetModal({ isOpen, onClose, pet, onPetDeleted }: DeletePetModalProps) {
  const handleDelete = async () => {
    try {
      await deletePetAPI(pet.id);
      toast.success("Zwierzę zostało usunięte");
      onPetDeleted();
    } catch (error) {
      toast.error("Nie udało się usunąć zwierzęcia");
      console.error("Error deleting pet:", error);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[500px]">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Usuń zwierzę
        </h2>
        
        <p className="text-gray-700 mb-6">
          Czy na pewno chcesz usunąć {pet.name}? Ta operacja jest nieodwracalna.
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors duration-200"
          >
            Anuluj
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
          >
            Tak, usuń
          </button>
        </div>
      </div>
    </div>
  );
} 