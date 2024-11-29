import { useState, useEffect } from "react";
import { BaseModalProps, Pet } from "../../types";
import {
  updatePetAPI,
  getSecretUploadUrlAPI,
  uploadFileToS3API,
} from "../../apiConfig";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

interface EditPetModalProps extends BaseModalProps {
  pet: Pet;
  onPetUpdated: () => void;
}

export function EditPetModal({
  isOpen,
  onClose,
  pet,
  onPetUpdated,
}: EditPetModalProps) {
  const [formData, setFormData] = useState<Pet>({
    id: pet.id,
    name: pet.name,
    breed: pet.breed,
    age: pet.age,
    weight: pet.weight,
    info_special_treatment: pet.info_special_treatment,
    favorite_activities: pet.favorite_activities,
    feeding_info: pet.feeding_info,
    photo_URL: pet.photo_URL,
    species_data: pet.species_data,
  });

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [secretUploadUrl, setSecretUploadUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getSecretUploadUrl = async () => {
      try {
        const url = await getSecretUploadUrlAPI();
        setSecretUploadUrl(url);
      } catch (error) {
        console.error("Error fetching secret upload URL:", error);
      }
    };

    getSecretUploadUrl();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (profilePhoto) {
        try {
          await uploadFileToS3API(secretUploadUrl, profilePhoto);
          formData.photo_URL = secretUploadUrl.split("?")[0];
        } catch (error) {
          console.error("Error uploading file to S3:", error);
          toast.error("Nie udało się dodać zdjęcia", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            style: {
              fontSize: "1.2rem",
              fontWeight: "bold",
              width: "100%",
            },
          });
          return;
        }
      }

      await updatePetAPI(formData);

      toast.success("Dane zostały zaktualizowane!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        style: {
          fontSize: "1.2rem",
          fontWeight: "bold",
          width: "200%",
        },
      });

      onPetUpdated();
      onClose();
    } catch (error) {
      toast.error("Nie udało się zaktualizować danych", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        style: {
          fontSize: "1.2rem",
          fontWeight: "bold",
          width: "200%",
        },
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-[500px] max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Edytuj dane</h2>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zdjęcie zwierzęcia
              </label>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setProfilePhoto(file);
                }}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imię
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rasa
              </label>
              <input
                type="text"
                value={formData.breed}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, breed: e.target.value }))
                }
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wiek
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      age: Number(e.target.value),
                    }))
                  }
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Waga (kg)
                </label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      weight: Number(e.target.value),
                    }))
                  }
                  className="w-full p-2 border rounded"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>

            {/* Text areas with consistent styling */}
            {[
              "info_special_treatment",
              "favorite_activities",
              "feeding_info",
            ].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field === "info_special_treatment"
                    ? "Specjalne traktowanie"
                    : field === "favorite_activities"
                    ? "Ulubione aktywności"
                    : "Informacje o karmieniu"}
                </label>
                <textarea
                  value={String(formData[field as keyof typeof formData])}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [field]: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>
            ))}
          </form>
        </div>

        <div className="p-6 border-t bg-white rounded-lg">
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Anuluj
            </button>
            {isLoading ? (
              <CircularProgress size={24} />
            ) : (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-700 text-white rounded"
              >
                Zapisz zmiany
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
