import { PetSitterDetailsType, Visit, Service } from "../types.tsx";
import Pin from "../assets/Pin.tsx";
import { PawIcon } from "../assets/PawIcon.tsx";
import { useParams } from "react-router-dom";
import { getAllServicesAPI, getPetSitterDetailsAPI, getUserPetSitterAPI } from "../apiConfig.tsx";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import ErrorFetching from "./ErrorFetching.tsx";
import Navbar from "./Navbar.tsx";
import { isLoggedIn } from "../apiConfig.tsx";
import ReserveVisitModal from "./ReserveVisitModal";
import { toast } from "react-toastify";

function PetSitterDetails() {
  const { id } = useParams();
  const [petSitterDetails, setPetSitterDetails] =
    useState<PetSitterDetailsType | null>(null);
  const [allServices, setAllServices] = useState<Service[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [visitsError, setVisitsError] = useState<string | null>(null);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);

  useEffect(() => {
    async function fetchPetSitterDetails() {
      try {
        if (id) {
          setIsLoading(true);
          const response = await getPetSitterDetailsAPI(id);
          setPetSitterDetails(response);
          setVisits(response?.visits || []);
        }
      } catch (error) {
        setError("Wystąpił błąd podczas pobierania danych");
      } finally {
        setIsLoading(false);
      }
    }

    async function getAllServices() {
      try {
        if (id) {
          setIsLoading(true);
          const response = await getAllServicesAPI();
          setAllServices(response);
        }
      } catch (error) {
        setError("Wystąpił błąd podczas pobierania danych");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPetSitterDetails();
    getAllServices();
  }, [id]);

  const handleReserveVisit = () => {
    if (!isLoggedIn()) {
      window.location.href = "/login";
      return;
    }
    if (!localStorage.getItem("isPetOwner")) {
      window.location.href = "/create-pet-sitter";
    } else {
      setIsReserveModalOpen(true);
    }
  };

  const completedVisits = visits.filter(visit => visit.is_over && visit.is_accepted);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <CircularProgress />
      </>
    );
  }

  if (error) {
    return (
      <>
        <ErrorFetching error={error} />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between mt-6">
        {/* Left side - Pet Sitter Info */}
        <div className="md:w-1/3">
          <div className="rounded-2xl shadow-lg border p-6 bg-blue-100">
            <div className="flex flex-col justify-center items-center w-48 h-48 bg-white rounded-full overflow-hidden shadow-lg mx-auto border-2 border-black">
              <img
                src={petSitterDetails?.user_data.profile_picture_url}
                className="w-full h-full object-cover"
                alt={`${petSitterDetails?.user_data.first_name}'s profile`}
              />
            </div>
            <div className="flex flex-row text-center justify-between mb-4 mx-auto">
              <div className="">
                <h2 className="text-2xl font-bold">
                  {petSitterDetails?.user_data.first_name}{" "}
                  {petSitterDetails?.user_data.last_name}
                </h2>
                <p className="text-gray-600">
                  @{petSitterDetails?.user_data.username}
                </p>
              </div>
              <div className="flex flex-row text-sm top-0 right-0 mx-4 space-x-4 text-black items-center justify-center border rounded-full bg-black w-28 h-12">
                <span className="text-yellow-400 font-bold text-lg">{petSitterDetails?.rating}/5</span>
                <div className="text-yellow-400 text-sm mx-3.5">
                  <PawIcon height={"24"} width={"24"} />
                </div>
              </div>
            </div>

            <p className="line-clamp-4 text-black mb-4 border-2 border-black bg-white rounded-lg px-2 py-1 text-center">
              {petSitterDetails?.description_bio}
            </p>
            <div className="grid grid-rows-3 justify-center items-center text-gray-800 bg-white py-0.5 px-2 mb-2 mx-auto divide-y border-2 border-black rounded-lg">
              <span className="grid grid-cols-2 justify-center items-center text-center">
                <strong>Doświadczenie:</strong>{" "}
                {petSitterDetails?.experience_in_months} miesięcy
              </span>
              <span className="grid grid-cols-2 justify-center items-center text-center">
                <strong>Stawka godzinowa:</strong>{" "}
                {petSitterDetails?.hourly_rate} zł/h
              </span>
              <span className="grid grid-cols-2 justify-center items-center text-center">
                <strong>Stawka dzienna:</strong> {petSitterDetails?.daily_rate}{" "}
                zł/h
              </span>
            </div>
            <div className="grid grid-cols-2 bg-white text-gray-600 divide-x-2 divide-black border-2 border-black py-1">
              <div className="text-center text-">
                <p>
                  <strong>{petSitterDetails?.user_data.email}</strong>
                </p>
              </div>
              <div className="text-center text-">
                <p>
                  <strong>{petSitterDetails?.user_data.phone_number}</strong>
                </p>
              </div>
            </div>
            <div className="flex justify-center rounded-lg text-center bg-white border-2 border-black pb-1 py-1">
              <div className="text-red-500">
                <Pin link={"#"} />
              </div>
              <p>
                <strong>
                  {petSitterDetails?.user_data.address_city},{" "}
                  {petSitterDetails?.user_data.address_street}{" "}
                  {petSitterDetails?.user_data.address_house}
                </strong>
              </p>
            </div>
            <button
              onClick={handleReserveVisit}
              className="w-full mt-4 bg-blue-600 text-white font-semibold rounded-lg px-6 py-3 hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2"
            >
              <span>Zarezerwuj wizytę</span>
            </button>
          </div>
        </div>

        {/* Right side - Completed Visits History */}
        <div className="md:w-1/2">
          <div className="rounded-2xl shadow-lg border p-6 bg-blue-100">
            <h2 className="text-xl font-bold mb-4 text-center">
              Historia Wizyt
            </h2>
            {visitsError ? (
              <p className="text-red-500">{visitsError}</p>
            ) : completedVisits.length === 0 ? (
              <p className="text-center text-gray-600">Brak historii wizyt</p>
            ) : (
              <div className="bg-white rounded-lg border-2 border-black">
                <div className="max-h-[1000px] overflow-y-auto overflow-x-hidden">
                  {completedVisits.map((visit) => (
                    <div
                      key={visit.id}
                      className="p-4 space-y-2 border-b-2 mb-3 border-gray-900 hover:bg-gray-50"
                    >
                      <div className="flex items-start border-b border-gray-300 pb-3 gap-4 mb-4">
                        <div className="flex-shrink-0">
                          <img
                            src={visit.pet_data.photo_URL}
                            alt={`${visit.pet_data.name}'s photo`}
                            className="w-24 h-24 rounded-full object-cover border-2 border-blue-200"
                          />
                        </div>
                        <div className="flex flex-col flex-grow">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="text-xl font-semibold text-blue-900">
                                {visit.pet_data.name}
                              </h3>
                              <span className="text-m text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                {visit.pet_data.species_data.name}
                              </span>
                            </div>
                            <div className="flex flex-col gap-2">
                              <span className="text-black border border-black text-m rounded-xl px-2 py-1">
                                od {new Date(visit.date_range_of_visit.lower).toLocaleString()}
                              </span>
                              <span className="text-black border border-black text-m rounded-xl px-2 py-1">
                                do {new Date(visit.date_range_of_visit.upper).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* Pet Owner Info */}
                          <div className="mt-4">
                            <h4 className="font-semibold">Właściciel:</h4>
                            <div className="flex items-center gap-4 mt-2">
                              <img
                                src={visit.pet_data.pet_owner_data.user_data.profile_picture_url}
                                alt="Pet owner"
                                className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                              />
                              <div>
                                <p className="font-semibold">
                                  {visit.pet_data.pet_owner_data.user_data.first_name}{' '}
                                  {visit.pet_data.pet_owner_data.user_data.last_name}
                                </p>
                                <p className="text-gray-600">
                                  {visit.pet_data.pet_owner_data.user_data.email}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Review Section */}
                          {(visit.review || visit.rating) && (
                            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold">Opinia:</span>
                                {visit.rating && (
                                  <div className="flex items-center">
                                    <span className="text-yellow-500 flex">
                                      {[...Array(visit.rating)].map((_, i) => (
                                        <PawIcon key={i} width="24" height="24" />
                                      ))}
                                    </span>
                                  </div>
                                )}
                              </div>
                              {visit.review && (
                                <p className="mt-2 text-gray-600">{visit.review}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ReserveVisitModal
        isOpen={isReserveModalOpen}
        onClose={() => setIsReserveModalOpen(false)}
        petSitterId={petSitterDetails?.id || 0}
        allServices={allServices || []}
        priceHour={petSitterDetails?.hourly_rate || 0}
        priceDay={petSitterDetails?.daily_rate || 0}
      />
    </>
  );
}

export default PetSitterDetails;
