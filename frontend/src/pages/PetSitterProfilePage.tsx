import { useEffect, useState } from "react";
import { PetSitterDetailsType, Visit } from "../types";
import { getUserPetSitterAPI } from "../apiConfig";
import { CircularProgress } from "@mui/material";
import ErrorFetching from "../components/ErrorFetching";
import { ToastContainer } from "react-toastify";
import Navbar from "../components/Navbar";
import { DeletePetSitterModal } from "../components/modals/DeletePetSitterModal";

function PetSitterProfilePage() {
  const [petSitterDetails, setPetSitterDetails] = useState<PetSitterDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorFetching, setErrorFetching] = useState<string | null>(null);
  const [showDeletePetSitterModal, setShowDeletePetSitterModal] = useState(false);
  const [visits, setVisits] = useState<Visit[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const user = await getUserPetSitterAPI();
        setPetSitterDetails(user);
        setVisits(user?.visits || []);
        setErrorFetching(null);
      } catch (err) {
        setErrorFetching("Nie udało się pobrać danych :(");
        console.error("Error fetching user data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleCreatePetSitter = () => {
    window.location.href = "/create-pet-sitter";
  };

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
          <div className="flex gap-6">
            {/* Left Panel - Pet Sitter Data */}
            <div className="w-1/2">
              <div className="rounded-2xl shadow-lg border p-6 bg-blue-100 mb-6 max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold text-blue-900 mb-4">
                  Dane opiekuna
                </h2>
                {petSitterDetails ? (
                  <div className="bg-white rounded-lg p-4 border-2 border-black">
                    <div className="space-y-4 mb-4">
                      <div className="flex justify-between border-b pb-3">
                        <p className="text-gray-600 text-lg font-semibold">Stawka dzienna</p>
                        <p className="font-semibold text-xl">
                          {petSitterDetails.daily_rate} zł
                        </p>
                      </div>
                      <div className="flex justify-between border-b pb-3">
                        <p className="text-gray-600 text-lg font-semibold">Stawka godzinowa</p>
                        <p className="font-semibold text-xl">
                          {petSitterDetails.hourly_rate} zł
                        </p>
                      </div>
                      <div className="flex justify-between border-b pb-3">
                        <p className="text-gray-600 text-lg font-semibold">Doświadczenie</p>
                        <p className="font-semibold text-xl">
                          {petSitterDetails.experience_in_months} miesięcy
                        </p>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-gray-600 text-lg font-semibold mb-2">O mnie</p>
                      <p className="text-gray-900 text-lg">
                        {petSitterDetails.description_bio}
                      </p>
                    </div>
                    <button
                      className="w-full bg-red-600 text-white rounded-lg px-4 py-2 mt-4 hover:bg-red-700"
                      onClick={() => setShowDeletePetSitterModal(true)}
                    >
                      Usuń profil opiekuna
                    </button>
                  </div>
                ) : (
                  <button
                    className="w-full bg-green-600 text-white font-semibold rounded-lg px-4 py-2 mt-4 hover:bg-green-700"
                    onClick={handleCreatePetSitter}
                  >
                    Zostań opiekunem
                  </button>
                )}
              </div>
            </div>

            {/* Right Panel - Waiting Visits - Only show if petSitterDetails exists */}
            {petSitterDetails && (
              <div className="w-1/2">
                <div className="rounded-2xl shadow-lg border p-6 bg-blue-100 sticky top-4">
                  <h2 className="text-3xl font-bold text-blue-900 mb-4">
                    Oczekujące wizyty
                  </h2>
                  <div className="bg-white rounded-lg border-2 border-black">
                    <div className="max-h-[600px] overflow-y-auto">
                      {visits.length > 0 ? (
                        visits.map((visit) => (
                          <div
                            key={visit.id}
                            className="p-4 border-b border-gray-200 hover:bg-gray-50"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="text-xl font-semibold">
                                {visit.pet_data.name}
                              </h3>
                              <span className="text-gray-600">
                                {new Date(visit.date_range_of_visit.lower).toLocaleDateString()} - {new Date(visit.date_range_of_visit.upper).toLocaleDateString()}
                              </span>
                            </div>
                            
                            <div className="space-y-2 mb-3">
                              <p className="text-sm">
                                <span className="font-semibold">Właściciel: </span>
                                {visit.pet_data.pet_owner_data.user_data.first_name} {visit.pet_data.pet_owner_data.user_data.last_name}
                              </p>
                              {visit.price && (
                                <p className="text-sm">
                                  <span className="font-semibold">Cena: </span>
                                  {visit.price} zł
                                </p>
                              )}
                              {visit.services.length > 0 && (
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
                              {visit.visit_notes && (
                                <div className="text-sm">
                                  <span className="font-semibold">Notatki: </span>
                                  <p className="text-gray-600 mt-1">
                                    {visit.visit_notes}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <button
                                className="flex-1 bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700"
                                onClick={() => {/* Add accept handler */}}
                              >
                                Akceptuj
                              </button>
                              <button
                                className="flex-1 bg-red-600 text-white rounded px-4 py-2 hover:bg-red-700"
                                onClick={() => {/* Add reject handler */}}
                              >
                                Odrzuć
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-500">
                          Brak oczekujących wizyt
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DeletePetSitterModal 
            isOpen={showDeletePetSitterModal} 
            onClose={() => setShowDeletePetSitterModal(false)} 
          />
        </div>
      )}
    </>
  );
}

export { PetSitterProfilePage }; 