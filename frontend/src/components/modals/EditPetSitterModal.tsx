import { useState } from "react";
import { PetSitterDetailsType, PetSitterDetailsTypeEdit } from "../../types";
import { updatePetSitterAPI } from "../../apiConfig";
import { toast } from "react-toastify";

interface EditPetSitterModalProps {
  isOpen: boolean;
  onClose: () => void;
  petSitterDetails: PetSitterDetailsType | null;
  onUpdate: (updatedData: PetSitterDetailsType) => void;
}

export function EditPetSitterModal({
  isOpen,
  onClose,
  petSitterDetails,
  onUpdate,
}: EditPetSitterModalProps) {
  const [formData, setFormData] = useState<PetSitterDetailsTypeEdit>({
    daily_rate: petSitterDetails?.daily_rate || 0,
    hourly_rate: petSitterDetails?.hourly_rate || 0,
    experience_in_months: petSitterDetails?.experience_in_months || 0,
    description_bio: petSitterDetails?.description_bio || "",
    photo_URL: petSitterDetails?.photo_URL || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedPetSitter = await updatePetSitterAPI(formData);
      onUpdate(updatedPetSitter);
      toast.success("Profil został zaktualizowany!");
      onClose();
    } catch (error) {
      toast.error("Nie udało się zaktualizować profilu.", {
        position: "top-center",
        style: {
          fontSize: "1.2rem",
          fontWeight: "bold",
        },
      });   
      console.error("Error updating pet sitter:", error);
    }
  };

  return (
    <>
      {isOpen && (
        <>
          <div className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">
                  Edytuj profil opiekuna
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Stawka dzienna (zł)
                    </label>
                    <input
                      type="number"
                      value={formData.daily_rate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          daily_rate: Number(e.target.value),
                        }))
                      }
                      className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Stawka godzinowa (zł)
                    </label>
                    <input
                      type="number"
                      value={formData.hourly_rate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          hourly_rate: Number(e.target.value),
                        }))
                      }
                      className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Doświadczenie (miesięcy)
                    </label>
                    <input
                      type="number"
                      value={formData.experience_in_months}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          experience_in_months: Number(e.target.value),
                        }))
                      }
                      className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

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
        </>
      )}
    </>
  );
}
