import { useState } from "react";
import { PetOwnerData } from "../../types";
import { updatePetOwnerAPI } from "../../apiConfig";
import { toast } from "react-toastify";

interface EditPetOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  petOwnerData: PetOwnerData | null;
  onUpdate: (updatedData: PetOwnerData) => void;
}

export function EditPetOwnerModal({
  isOpen,
  onClose,
  petOwnerData,
  onUpdate,
}: EditPetOwnerModalProps) {
  const [formData, setFormData] = useState({
    description_bio: petOwnerData?.description_bio || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedPetOwner = await updatePetOwnerAPI(formData);
      onUpdate(updatedPetOwner);
      toast.success("Profil został zaktualizowany!", {
        position: "top-center",
        style: {
          fontSize: "1.2rem",
          fontWeight: "bold",
        },
      });
      onClose();
    } catch (error) {
      toast.error("Nie udało się zaktualizować profilu.", {
        position: "top-center",
        style: {
          fontSize: "1.2rem",
          fontWeight: "bold",
        },
      });
      console.error("Error updating pet owner:", error);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="relative z-50">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">
                Edytuj profil właściciela
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    O mnie
                  </label>
                  <textarea
                    value={formData.description_bio}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description_bio: e.target.value,
                      }))
                    }
                    className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={4}
                  />
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
                  >
                    Zapisz zmiany
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-gray-200 text-gray-800 rounded-lg px-4 py-2 hover:bg-gray-300"
                  >
                    Anuluj
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
