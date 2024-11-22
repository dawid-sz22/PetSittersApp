import { useEffect, useState } from "react";
import { Visit, PetOwnerData, UserData } from "../types";
import { getUserPetOwnerAPI, getUserDataAPI } from "../apiConfig";
import { CircularProgress } from "@mui/material";
import ErrorFetching from "../components/ErrorFetching";
import { ToastContainer } from "react-toastify";
import Navbar from "../components/Navbar";
import { AddPetModal } from "../components/modals/AddPetModal";

function PetOwnerProfilePage() {
  const [petOwnerData, setPetOwnerData] = useState<PetOwnerData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorFetching, setErrorFetching] = useState<string | null>(null);
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [petOwnerVisits, setPetOwnerVisits] = useState<Visit[]>([]);

  useEffect(() => {
    const fetchPetOwnerData = async () => {
      try {
        setIsLoading(true);
        const petOwner = await getUserPetOwnerAPI();
        setPetOwnerData(petOwner);
        setPetOwnerVisits(petOwner?.visits || []);  
        setErrorFetching(null);
      } catch (err) {
        setErrorFetching("Nie udało się pobrać danych :(");
        console.error("Error fetching user data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const user = await getUserDataAPI();
        setUserData(user);
        setErrorFetching(null);
      } catch (err) {
        setErrorFetching("Nie udało się pobrać danych :(");
        console.error("Error fetching user data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPetOwnerData();
    fetchUserData();
  }, []);

  if (errorFetching) {
    return <ErrorFetching error={errorFetching} />;
  }

  return (
    <>
      <Navbar />
      <ToastContainer />
      {isLoading ? (
        <div className="flex justify-center items-center mt-20">
          <CircularProgress size={60} />
        </div>
      ) : (
        <div className="container mx-auto mt-10 px-4">
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Pet Owner Data Panel */}
              <div className="rounded-2xl shadow-lg border p-6 bg-blue-100">
                <h2 className="text-3xl font-bold text-blue-900 mb-4">
                  Profil właściciela zwierząt
                </h2>
                <div className="bg-white rounded-lg p-4 border-2 border-black">
                  <div className="flex flex-col justify-center items-center mb-4">
                    <div className="w-48 h-48 rounded-full overflow-hidden border-2 border-black mb-3">
                      <img
                        src={userData?.profile_picture_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold">
                      {userData?.first_name}{" "}
                      {userData?.last_name}
                    </h3>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-600 font-semibold mb-2">O mnie</p>
                    <p className="text-gray-900">
                      {petOwnerData?.description_bio || "Brak opisu"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pets Panel */}
              <div className="rounded-2xl shadow-lg border p-6 bg-blue-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-blue-900">
                    Moje zwierzęta
                  </h2>
                  <button
                    className="bg-blue-700 text-white rounded-lg px-6 py-3 hover:bg-blue-800 font-semibold text-lg shadow-md"
                    onClick={() => setShowAddPetModal(true)}
                  >
                    Dodaj zwierzę
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {petOwnerData?.pets && petOwnerData.pets.length > 0 ? (
                    petOwnerData.pets.map((pet) => (
                      <div
                        key={pet.id}
                        className="bg-white border-2 border-black rounded-lg p-4 hover:bg-gray-50 transition-colors shadow-md"
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-black mb-4">
                            <img
                              src={pet.photo_URL || ""}
                              alt={`${pet.name}'s photo`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="w-full">
                            {/* Basic Info Panel */}
                            <div className="flex justify-between items-center border-b-2 pb-2 mb-2">
                              <h3 className="text-xl font-bold text-blue-900">
                                {pet.name}
                              </h3>
                              <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                {pet.species_data.name}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-m mb-4">
                              <p>
                                <span className="font-semibold">Rasa: </span>
                                {pet.breed || "Nie podano"}
                              </p>
                              <p>
                                <span className="font-semibold">Wiek: </span>
                                {pet.age} lat
                              </p>
                              <p>
                                <span className="font-semibold">Waga: </span>
                                {pet.weight} kg
                              </p>
                            </div>

                            {/* Detailed Info Panel */}
                            <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                              <div>
                                <p className="font-semibold mb-1">Ulubione aktywności:</p>
                                <p className="text-gray-700">
                                  {pet.favorite_activities || "Brak ulubionych aktywności"}
                                </p>
                              </div>
                              <div>
                                <p className="font-semibold mb-1">Specjalne traktowanie:</p>
                                <p className="text-gray-700">
                                  {pet.info_special_treatment || "Brak specjalnych wymagań"}
                                </p>
                              </div>
                              <div>
                                <p className="font-semibold mb-1">Informacje o karmieniu:</p>
                                <p className="text-gray-700">
                                  {pet.feeding_info || "Brak informacji"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 text-lg py-8">
                      Nie masz jeszcze żadnych zwierząt
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Visits Panel */}
            <div className="rounded-2xl shadow-lg border p-6 bg-blue-100 sticky top-4">
              <h2 className="text-3xl font-bold text-blue-900 mb-4">
                Historia wizyt
              </h2>
              <div className="bg-white rounded-lg border-2 border-black">
                <div className="max-h-[800px] overflow-y-auto">
                  {petOwnerVisits.length > 0 ? (
                    petOwnerVisits.map((visit) => (
                      <div
                        key={visit.id}
                        className="p-4 border-b border-gray-200 hover:bg-gray-50"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-xl font-semibold">
                            {visit.pet_data.name}
                          </h3>
                          <span className="text-gray-600">
                            {new Date(
                              visit.date_range_of_visit.lower
                            ).toLocaleDateString()}{" "}
                            -{" "}
                            {new Date(
                              visit.date_range_of_visit.upper
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm">
                            <span className="font-semibold">Opiekun: </span>
                            {visit.pet_sitter_data.user_data.first_name}{" "}
                            {visit.pet_sitter_data.user_data.last_name}
                          </p>
                          {visit.price && (
                            <p className="text-sm">
                              <span className="font-semibold">Cena: </span>
                              {visit.price} zł
                            </p>
                          )}
                          {visit.services && visit.services.length > 0 && (
                            <div className="text-sm">
                              <span className="font-semibold">Usługi: </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {visit.services.map((service, index) => (
                                  <span
                                    key={index}
                                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                                  >
                                    {service.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {visit.rating && (
                            <div className="text-sm">
                              <span className="font-semibold">Ocena: </span>
                              <span className="text-yellow-500">
                                {"★".repeat(visit.rating)}
                                {"☆".repeat(5 - visit.rating)}
                              </span>
                            </div>
                          )}
                          {visit.review && (
                            <div className="text-sm bg-gray-50 p-2 rounded">
                              <span className="font-semibold">Opinia: </span>
                              <p className="mt-1 text-gray-600">
                                {visit.review}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      Brak historii wizyt
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <AddPetModal
            isOpen={showAddPetModal}
            onClose={() => setShowAddPetModal(false)}
          />
        </div>
      )}
    </>
  );
}

export { PetOwnerProfilePage };
