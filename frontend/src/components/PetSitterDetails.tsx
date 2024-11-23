import { PetSitterDetailsType, Visit, Service } from "../types.tsx";
import Pin from "../assets/Pin.tsx";
import { PawIcon } from "../assets/PawIcon.tsx";
import { useParams, useNavigate } from "react-router-dom";
import { getAllServicesAPI, getPetSitterDetailsAPI } from "../apiConfig.tsx";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import ErrorFetching from "./ErrorFetching.tsx";
import Navbar from "./Navbar.tsx";
import { isLoggedIn } from "../apiConfig.tsx";
import ReserveVisitModal from "./ReserveVisitModal";

function PetSitterDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
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
      navigate("/login");
      return;
    }
    navigate(`/reserve-visit/${id}`);
  };

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
        <Navbar />
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
            <div className="grid grid-cols-2 text-center justify-center items-center mb-4 mx-auto">
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
                <span className="text-yellow-400 font-bold text-lg">2/5</span>
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
                <strong>Stawka godzinowa:</strong> {petSitterDetails?.hourly_rate}{" "}
                zł/h
              </span>
              <span className="grid grid-cols-2 justify-center items-center text-center">
                <strong>Stawka dzienna:</strong> {petSitterDetails?.daily_rate} zł/h
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
              onClick={() => setIsReserveModalOpen(true)}
              className="bg-blue-700 text-white rounded-lg px-4 py-2 hover:bg-blue-800"
            >
              Zarezerwuj wizytę
            </button>
          </div>
        </div>

        {/* Right side - Visits History */}
        <div className="md:w-1/2">
          <div className="rounded-2xl shadow-lg border p-6 bg-blue-100">
            <h2 className="text-xl font-bold mb-4 text-center">Historia Wizyt</h2>
            {visitsError ? (
              <p className="text-red-500">{visitsError}</p>
            ) : visits.length === 0 ? (
              <p className="text-center text-gray-600">Brak historii wizyt</p>
            ) : (
              <div className="space-y-4">
                {visits.map((visit) => (
                  <div
                    key={visit.id}
                    className="bg-white rounded-lg p-4 border-2 border-black"
                  >
                    <div className="space-y-2">
                      {/* Pet Info with Picture */}
                      <div className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={visit.pet_data.photo_URL}
                            alt={visit.pet_data.name}
                            className="w-32 h-32 rounded-full object-cover border border-gray-300"
                          />
                          <div>
                            <span className="font-bold block">{visit.pet_data.name}</span>
                            {/* Pet Owner Info */}
                            <span className="text-sm text-gray-600">
                              Właściciel: {visit.pet_data.pet_owner_data.user_data.first_name} {visit.pet_data.pet_owner_data.user_data.last_name}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Date Range */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <strong>Od:</strong>
                          <div>
                            {new Date(
                              visit.date_range_of_visit.lower
                            ).toLocaleDateString()}
                          </div>
                          <div>
                            {new Date(
                              visit.date_range_of_visit.lower
                            ).toLocaleTimeString()}
                          </div>
                        </div>
                        <div>
                          <strong>Do:</strong>
                          <div>
                            {new Date(
                              visit.date_range_of_visit.upper
                            ).toLocaleDateString()}
                          </div>
                          <div>
                            {new Date(
                              visit.date_range_of_visit.upper
                            ).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>

                      {/* Services */}
                      <div className="mt-2">
                        <strong>Usługi:</strong>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {visit.services_data &&
                            visit.services_data.map((service) => (
                              <span
                                key={service.id}
                                className="bg-blue-100 px-2 py-1 rounded-full text-sm"
                              >
                                {service.name}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
