import { useEffect, useState } from "react";
import { PetSitterDetailsType, Visit } from "../types";
import {
  acceptVisitAPI,
  getUserPetSitterAPI,
  rejectVisitAPI,
} from "../apiConfig";
import { CircularProgress } from "@mui/material";
import ErrorFetching from "../components/ErrorFetching";
import { toast, ToastContainer } from "react-toastify";
import Navbar from "../components/Navbar";
import { DeletePetSitterModal } from "../components/modals/DeletePetSitterModal";
import { EditPetSitterModal } from "../components/modals/EditPetSitterModal";

function PetSitterProfilePage() {
  const [petSitterDetails, setPetSitterDetails] =
    useState<PetSitterDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAcceptingVisit, setIsLoadingAcceptingVisit] = useState(false);
  const [errorFetching, setErrorFetching] = useState<string | null>(null);
  const [showDeletePetSitterModal, setShowDeletePetSitterModal] =
    useState(false);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [showEditPetSitterModal, setShowEditPetSitterModal] = useState(false);
  const [visitFilter, setVisitFilter] = useState<
    "pending" | "accepted" | "rejected" | "completed" | "all"
  >("pending");

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

  const handlePetSitterUpdate = (updatedData: PetSitterDetailsType) => {
    setPetSitterDetails(updatedData);
  };

  const handleAcceptVisit = async (visitId: number) => {
    console.log(visitId);
    setIsLoadingAcceptingVisit(true);
    try {
      await acceptVisitAPI(visitId);
      toast.success("Wizyta zaakceptowana", {
        position: "top-right",
        autoClose: 3000,
        style: {
          fontSize: "1.2rem",
          fontWeight: "bold",
        },
      });

    } catch (err) {
      console.error("Error accepting visit:", err);
      toast.error("Nie udało się zaakceptować wizyty", {
        position: "top-right",
        autoClose: 3000,
        style: {
          fontSize: "1.2rem",
          fontWeight: "bold",
        },
      });
    } finally {
      setIsLoadingAcceptingVisit(false);
    }
  };

  const handleRejectVisit = async (visitId: number) => {
    console.log(visitId);
    setIsLoadingAcceptingVisit(true);
    try {
      await rejectVisitAPI(visitId);
      toast.success("Wizyta odrzucona", {
        position: "top-right",
        autoClose: 3000,
        style: {
          fontSize: "1.2rem",
          fontWeight: "bold",
        },
      });
      const updatedVisits = visits.map(visit => visit.id === visitId ? { ...visit, is_over: true } : visit);
      setVisits(updatedVisits);
    } finally {
      setIsLoadingAcceptingVisit(false);
    }
  };

  const filteredVisits = visits.filter((visit) => {
    switch (visitFilter) {
      case "pending":
        return !visit.is_accepted && !visit.is_over;
      case "accepted":
        return visit.is_accepted && !visit.is_over;
      case "rejected":
        return !visit.is_accepted && visit.is_over;
      case "completed":
        return visit.is_over && visit.is_accepted;
      case "all":
        return true;
      default:
        return true;
    }
  });


  if (errorFetching || localStorage.getItem("isPetSitter") === "false") {
    return (
      <ErrorFetching error={errorFetching || "Nie jesteś opiekunem"} />
    );
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
        <div className="mx-auto pt-10 px-4 bg-gradient-to-b from-sky-100 to-sky-300 min-h-screen">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/2">
              <div className="rounded-2xl shadow-lg border-2 border-black p-4 lg:p-6 bg-sky-100 mb-6 max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold text-sky-600 mb-4">
                  Dane opiekuna
                </h2>
                {petSitterDetails ? (
                  <div className="bg-white rounded-lg p-4 border-2 border-black">
                    <div className="space-y-4 mb-4">
                      <div className="flex justify-between border-b pb-3">
                        <p className="text-gray-600 text-lg font-semibold">
                          Stawka dzienna
                        </p>
                        <p className="font-semibold text-xl">
                          {petSitterDetails.daily_rate} zł
                        </p>
                      </div>
                      <div className="flex justify-between border-b pb-3">
                        <p className="text-gray-600 text-lg font-semibold">
                          Stawka godzinowa
                        </p>
                        <p className="font-semibold text-xl">
                          {petSitterDetails.hourly_rate} zł
                        </p>
                      </div>
                      <div className="flex justify-between border-b pb-3">
                        <p className="text-gray-600 text-lg font-semibold">
                          Doświadczenie
                        </p>
                        <p className="font-semibold text-xl">
                          {petSitterDetails.experience_in_months} miesięcy
                        </p>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-gray-600 text-lg font-semibold mb-2">
                        O mnie
                      </p>
                      <p className="text-gray-900 text-lg">
                        {petSitterDetails.description_bio}
                      </p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors duration-200"
                        onClick={() => setShowEditPetSitterModal(true)}
                      >
                        Edytuj profil
                      </button>
                      <button
                        className="flex-1 bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-700 transition-colors duration-200"
                        onClick={() => setShowDeletePetSitterModal(true)}
                      >
                        Usuń profil opiekuna
                      </button>
                    </div>
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

            {petSitterDetails && (
              <div className="w-full lg:w-1/2">
                <div className="rounded-2xl shadow-lg p-4 lg:p-6 bg-sky-100 border-2 border-black lg:sticky lg:top-4">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold text-center mb-4 text-sky-600">
                      Historia wizyt
                    </h2>
                  </div>
                  <div className="flex flex-grow justify-between items-center mb-4">
                    <div className="flex flex-grow justify-between gap-1 flex-wrap">
                      <button
                        onClick={() => setVisitFilter("all")}
                        className={`px-2 lg:px-4 py-1 lg:py-2 rounded-lg text-sm lg:text-base font-medium transition-colors duration-200
                          ${
                            visitFilter === "all"
                              ? "bg-purple-600 text-white"
                              : "bg-white text-purple-600 hover:bg-purple-50"
                          }`}
                      >
                        Wszystkie
                      </button>
                      <button
                        onClick={() => setVisitFilter("pending")}
                        className={`px-2 lg:px-4 py-1 lg:py-2 rounded-lg text-sm lg:text-base font-medium transition-colors duration-200
                          ${
                            visitFilter === "pending"
                              ? "bg-blue-600 text-white"
                              : "bg-white text-blue-600 hover:bg-blue-50"
                          }`}
                      >
                        Oczekujące
                      </button>
                      <button
                        onClick={() => setVisitFilter("accepted")}
                        className={`px-2 lg:px-4 py-1 lg:py-2 rounded-lg text-sm lg:text-base font-medium transition-colors duration-200
                          ${
                            visitFilter === "accepted"
                              ? "bg-green-600 text-white"
                              : "bg-white text-green-600 hover:bg-green-50"
                          }`}
                      >
                        Zaakceptowane
                      </button>
                      <button
                        onClick={() => setVisitFilter("rejected")}
                        className={`px-2 lg:px-4 py-1 lg:py-2 rounded-lg text-sm lg:text-base font-medium transition-colors duration-200
                          ${
                            visitFilter === "rejected"
                              ? "bg-red-600 text-white"
                              : "bg-white text-red-600 hover:bg-red-50"
                          }`}
                      >
                        Odrzucone
                      </button>
                      <button
                        onClick={() => setVisitFilter("completed")}
                        className={`px-2 lg:px-4 py-1 lg:py-2 rounded-lg text-sm lg:text-base font-medium transition-colors duration-200
                          ${
                            visitFilter === "completed"
                              ? "bg-gray-600 text-white"
                              : "bg-white text-gray-600 hover:bg-gray-50"
                          }`}
                      >
                        Zakończone
                      </button>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border-2 border-black">
                    <div className="max-h-[500px] lg:max-h-[900px] overflow-y-auto overflow-x-hidden">
                      {filteredVisits.length > 0 ? (
                        filteredVisits.map((visit) => (
                          <div
                            key={visit.id}
                            className="p-4 space-y-2 border-b-2 mb-3 border-gray-900 hover:bg-gray-50"
                          >
                            <div className="flex items-start border-b border-gray-300 pb-3 gap-4 mb-4">
                              <div className="flex-shrink-0 w-24 h-24">
                                {visit.pet_data.photo_URL ? (
                                  <img
                                    src={visit.pet_data.photo_URL}
                                    alt={`${visit.pet_data.name}'s photo`}
                                    className="w-full h-full rounded-full object-cover border-2 border-blue-200"
                                  />
                                ) : (
                                  <img
                                    src={"./images.png"}
                                    className="w-full h-full object-cover"
                                    alt={`${visit.pet_data.name}'s photo`}
                                  />
                                )}
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
                                      od{" "}
                                      {new Date(
                                        visit.date_range_of_visit.lower
                                      ).toLocaleString()}
                                    </span>
                                    <span className="text-black border border-black text-m rounded-xl px-2 py-1">
                                      do{" "}
                                      {new Date(
                                        visit.date_range_of_visit.upper
                                      ).toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mt-2 text-m">
                                  <p>
                                    <span className="font-semibold">Wiek:</span>{" "}
                                    {visit.pet_data.age} lat
                                  </p>
                                  <p>
                                    <span className="font-semibold">Waga:</span>{" "}
                                    {visit.pet_data.weight} kg
                                  </p>
                                  <p>
                                    <span className="font-semibold">Rasa:</span>{" "}
                                    {visit.pet_data.breed || "Nie podano"}
                                  </p>
                                </div>
                                {visit.visit_notes && (
                                  <div className="mt-2">
                                    <span className="font-semibold">
                                      Informacje o wizycie:
                                    </span>
                                    <p className="text-m">
                                      {visit.visit_notes}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-start gap-4">
                                <div className="flex items-center justify-center w-24 h-24">
                                  {visit.pet_data.pet_owner_data.user_data.profile_picture_url ? (
                                    <img
                                      src={
                                        visit.pet_data.pet_owner_data.user_data
                                        .profile_picture_url
                                    }
                                    alt={`${visit.pet_data.pet_owner_data.user_data.first_name}'s photo`}
                                      className="rounded-full object-cover border-2 border-blue-200"
                                    />
                                  ) : (
                                    <img
                                      src={"./images.png"}
                                      className="w-1/2 h-1/2 object-cover"
                                      alt={`${visit.pet_data.pet_owner_data.user_data.first_name}'s photo`}
                                    />
                                  )}
                                </div>
                                <div className="flex flex-row flex-grow justify-between">
                                  <div>
                                    <h3 className="text-xl font-semibold text-blue-900">
                                      {
                                        visit.pet_data.pet_owner_data.user_data
                                          .first_name
                                      }{" "}
                                      {
                                        visit.pet_data.pet_owner_data.user_data
                                          .last_name
                                      }
                                    </h3>
                                    <h2 className="text-m">
                                      {
                                        visit.pet_data.pet_owner_data.user_data
                                          .email
                                      }
                                    </h2>
                                    <h2 className="text-m">
                                      {
                                        visit.pet_data.pet_owner_data.user_data
                                          .phone_number
                                      }
                                    </h2>
                                    <h2 className="text-m">
                                      {
                                        visit.pet_data.pet_owner_data.user_data
                                          .address_city
                                      }
                                      ,{" "}
                                      {
                                        visit.pet_data.pet_owner_data.user_data
                                          .address_street
                                      }
                                    </h2>
                                  </div>
                                </div>
                                <span
                                  className={`px-3 py-1 rounded-full text-m font-medium
                                  ${
                                    visitFilter === "completed"
                                      ? "bg-gray-100 text-gray-800"
                                      : visitFilter === "accepted"
                                      ? "bg-green-100 text-green-800"
                                      : visitFilter === "rejected"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {visitFilter === "completed"
                                    ? "Zakończona"
                                    : visitFilter === "accepted"
                                    ? "Zaakceptowana"
                                    : visitFilter === "rejected"
                                    ? "Odrzucona"
                                    : "Oczekująca"}
                                </span>
                              </div>
                              {isLoadingAcceptingVisit ? (
                                <div className="flex justify-center items-center">
                                  <CircularProgress size={20} />
                                </div>
                              ) : (
                                <>
                                  {!visit.is_accepted && !visit.is_over && (
                                    <div className="flex gap-2 mt-2">
                                      <button
                                        className="flex-1 bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700"
                                        onClick={() =>
                                          handleAcceptVisit(visit.id)
                                        }
                                      >
                                        Akceptuj
                                      </button>
                                      <button
                                        className="flex-1 bg-red-600 text-white rounded px-4 py-2 hover:bg-red-700"
                                        onClick={() =>
                                          handleRejectVisit(visit.id)
                                        }
                                      >
                                        Odrzuć
                                      </button>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-500">
                          Brak{" "}
                          {visitFilter === "all"
                            ? ""
                            : visitFilter === "pending"
                            ? "oczekujących"
                            : visitFilter === "accepted"
                            ? "zaakceptowanych"
                            : visitFilter === "rejected"
                            ? "odrzuconych"
                            : "zakończonych"}{" "}
                          wizyt
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <EditPetSitterModal
            isOpen={showEditPetSitterModal}
            onClose={() => setShowEditPetSitterModal(false)}
            petSitterDetails={petSitterDetails}
            onUpdate={handlePetSitterUpdate}
          />
          <DeletePetSitterModal
            isOpen={showDeletePetSitterModal}
            onClose={() => {
              setShowDeletePetSitterModal(false);
              localStorage.setItem("isPetSitter", "false");
              window.location.href = "/";
            }}
          />
        </div>
      )}
    </>
  );
}

export { PetSitterProfilePage };
