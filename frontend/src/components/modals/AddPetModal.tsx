import { useState } from "react";
import { getAllPetSpeciesAPI, getSecretUploadUrlAPI, handleAddPetAPI, uploadFileToS3API } from "../../apiConfig";
import { toast } from "react-toastify";
import { BaseModalProps, PetSpecies } from "../../types";
import { useEffect } from "react";

export function AddPetModal({ isOpen, onClose }: BaseModalProps) {
  const [petName, setPetName] = useState("");
  const [petSpecies, setPetSpecies] = useState("");
  const [petBreed, setPetBreed] = useState("");
  const [petAge, setPetAge] = useState<number>();
  const [petWeight, setPetWeight] = useState<number>();
  const [petSpecialTreatment, setPetSpecialTreatment] = useState("");
  const [petActivities, setPetActivities] = useState("");
  const [petFeeding, setPetFeeding] = useState("");
  const [petSpeciesList, setPetSpeciesList] = useState<PetSpecies[]>([]);
  const [secretUploadUrl, setSecretUploadUrl] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [petPhoto, setPetPhoto] = useState<File | null>(null);

  useEffect(() => {
    const fetchPetSpecies = async () => {
      try {
        const species = await getAllPetSpeciesAPI();
        if (species) {
          setPetSpeciesList(species);
        }
      } catch (error) {
        console.error("Error fetching pet species:", error);
      }
    };

    const getSecretUploadUrl = async () => {  
      try {
        const secretUploadUrl = await getSecretUploadUrlAPI();
        setSecretUploadUrl(secretUploadUrl);
      } catch (error) {
        console.error("Error fetching secret upload URL:", error);
      }
    };

    fetchPetSpecies();
    getSecretUploadUrl();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (petPhoto) {
        try {
          await uploadFileToS3API(secretUploadUrl, petPhoto);
        } catch (error) {
          console.error("Error uploading file to S3:", error);
        }
      }
      console.log(photoURL);

      await handleAddPetAPI({
        name: petName,
        species: petSpecies,
        breed: petBreed || undefined,
        age: Number(petAge),
        weight: Number(petWeight),
        info_special_treatment: petSpecialTreatment || undefined,
        favorite_activities: petActivities || undefined,
        feeding_info: petFeeding || undefined,
        photo_URL: petPhoto ? secretUploadUrl.split("?")[0] : undefined,
      });
      onClose();
      toast.success("Zwierzę zostało dodane!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        style: {
          fontSize: "1.2rem",
          fontWeight: "bold",
          width: "100%",
        },
      });
      window.location.reload();

      // Reset form
      setPetName("");
      setPetSpecies("");
      setPetBreed("");
      setPetAge(undefined);
      setPetWeight(undefined);
      setPetSpecialTreatment("");
      setPetActivities("");
      setPetFeeding("");
      setPetPhoto(null);
    } catch (err) {
      toast.error("Nie udało się dodać zwierzaka :(", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        style: {
          fontSize: "1.2rem",
          fontWeight: "bold",
          width: "100%",
        },
      });
      console.error("Error adding pet:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[500px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Dodaj zwierzę</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              *Imię
            </label>
            <input
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zdjęcie
            </label>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setPetPhoto(file);
              }}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              *Gatunek
            </label>
            <select
              value={petSpecies}
              onChange={(e) => setPetSpecies(e.target.value)}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Wybierz gatunek</option>
              {petSpeciesList &&
                petSpeciesList.map((species) => (
                  <option key={species.id} value={species.id}>
                    {species.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rasa
            </label>
            <input
              type="text"
              value={petBreed}
              onChange={(e) => setPetBreed(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              *Wiek (w latach)
            </label>
            <input
              type="number"
              value={petAge}
              onChange={(e) => setPetAge(Number(e.target.value))}
              required
              min="0"
              step="0.1"
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              *Waga (w kg)
            </label>
            <input
              type="number"
              value={petWeight}
              onChange={(e) => setPetWeight(Number(e.target.value))}
              required
              min="0"
              step="0.1"
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specjalne wymagania
            </label>
            <textarea
              value={petSpecialTreatment}
              onChange={(e) => setPetSpecialTreatment(e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="Np. przyjmowane leki, alergie, szczególne potrzeby"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              *Ulubione aktywności
            </label>
            <textarea
              value={petActivities}
              onChange={(e) => setPetActivities(e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
              required
              placeholder="Np. zabawa piłką, drapanie za uchem, spacery"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              *Informacje o karmieniu
            </label>
            <textarea
              value={petFeeding}
              onChange={(e) => setPetFeeding(e.target.value)}
              className="w-full p-2 border rounded"
              required
              rows={3}
              placeholder="Np. rodzaj karmy, częstotliwość karmienia, pory posiłków"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
            >
              Dodaj zwierzę
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 