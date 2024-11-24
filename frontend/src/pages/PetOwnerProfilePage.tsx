import { useEffect, useState } from "react";
import { Visit, PetOwnerData, UserData, Pet } from "../types";
import { getUserPetOwnerAPI, getUserDataAPI } from "../apiConfig";
import { CircularProgress } from "@mui/material";
import ErrorFetching from "../components/ErrorFetching";
import { ToastContainer } from "react-toastify";
import Navbar from "../components/Navbar";
import { AddPetModal } from "../components/modals/AddPetModal";
import { EditPetModal } from "../components/modals/EditPetModal";
import { DeletePetModal } from "../components/modals/DeletePetModal";
import { PawIcon } from "../assets/PawIcon";
import { AddReviewModal } from "../components/modals/AddReviewModal";

function PetOwnerProfilePage() {
  const [petOwnerData, setPetOwnerData] = useState<PetOwnerData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorFetching, setErrorFetching] = useState<string | null>(null);
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [petOwnerVisits, setPetOwnerVisits] = useState<Visit[]>([]);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [deletingPet, setDeletingPet] = useState<Pet | null>(null);
  const [visitFilter, setVisitFilter] = useState<
    "all" | "pending" | "accepted" | "rejected" | "completed"
  >("pending");
  const [reviewingVisit, setReviewingVisit] = useState<number | null>(null);

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

  const refreshPetOwnerData = async () => {
    try {
      const petOwner = await getUserPetOwnerAPI();
      setPetOwnerData(petOwner);
      setPetOwnerVisits(petOwner?.visits || []);
    } catch (err) {
      console.error("Error refreshing data:", err);
    }
  };

  const filteredVisits = petOwnerVisits.filter((visit) => {
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
        <div className=" ">
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
                      <div className="w-64 h-64 rounded-full overflow-hidden border-2 border-black mb-2">
                        <img
                          src={userData?.profile_picture_url}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-bold">
                        {userData?.first_name} {userData?.last_name}
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
                          <div className="flex justify-end mb-2 gap-2">
                            <button
                              onClick={() => setEditingPet(pet)}
                              className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 rounded-full"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setDeletingPet(pet)}
                              className="text-red-600 hover:text-red-800 bg-red-100 p-2 rounded-full "
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-black mb-2">
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
                                <div className="border-b-2 pb-2 mb-2">
                                  <p className="font-semibold mb-1">
                                    Ulubione aktywności:
                                  </p>
                                  <p className="text-gray-700">
                                    {pet.favorite_activities ||
                                      "Brak ulubionych aktywności"}
                                  </p>
                                </div>
                                <div className="border-b-2 pb-2 mb-2">
                                  <p className="font-semibold mb-1">
                                    Specjalne traktowanie:
                                  </p>
                                  <p className="text-gray-700">
                                    {pet.info_special_treatment ||
                                      "Brak specjalnych wymagań"}
                                  </p>
                                </div>
                                <div className="border-b-2 pb-2 mb-2">
                                  <p className="font-semibold mb-1">
                                    Informacje o karmieniu:
                                  </p>
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
              <div className="rounded-2xl shadow-lg p-6 bg-blue-100 sticky top-4">
                <div className="flex flex-col gap-2">
                  <h2 className="text-3xl font-bold text-center mb-4 text-blue-900">
                    Historia wizyt
                  </h2>
                </div>
                <div className="flex flex-grow justify-between items-center mb-4">
                  <div className="flex flex-grow justify-between gap-2">
                    <button
                      onClick={() => setVisitFilter("all")}
                      className={`px-4 py-2 rounded-lg text-m font-medium transition-colors duration-200
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
                      className={`px-4 py-2 rounded-lg text-m font-medium transition-colors duration-200
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
                      className={`px-4 py-2 rounded-lg text-m font-medium transition-colors duration-200
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
                      className={`px-4 py-2 rounded-lg text-m font-medium transition-colors duration-200
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
                      className={`px-4 py-2 rounded-lg text-m font-medium transition-colors duration-200
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
                  <div className="max-h-[1000px] overflow-y-auto overflow-x-hidden">
                    {filteredVisits.length > 0 ? (
                      filteredVisits.map((visit) => (
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
                                <div className="flex flex-row gap-2">
                                  <span
                                    className={`px-3 py-1 rounded-full text-m font-medium
                                  ${
                                    visit.is_over
                                      ? "bg-gray-100 text-gray-800"
                                      : visit.is_accepted
                                      ? "bg-green-100 text-green-800"
                                      : visit.is_over && !visit.is_accepted
                                      ? "bg-red-100 text-red-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                  >
                                    {visit.is_over
                                      ? "Zakończona"
                                      : visit.is_accepted
                                      ? "Zaakceptowana"
                                      : visit.is_over && !visit.is_accepted
                                      ? "Odrzucona"
                                      : "Oczekująca"}
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
                              <span className="font-semibold">
                                Informacje o wizycie:
                              </span>
                              <p className="text-m">
                                {visit.visit_notes || "Brak informacji"}
                              </p>
                            </div>
                          </div>

                          {/* Rest of visit information */}
                          <div className="space-y-2">
                            <div className="flex items-start gap-4 mb-4 border-b border-gray-300 pb-3">
                              <div className="flex-shrink-0">
                                <img
                                  src={
                                    visit.pet_sitter_data.user_data
                                      .profile_picture_url
                                  }
                                  alt={`${visit.pet_data.name}'s photo`}
                                  className="w-24 h-24 rounded-full object-cover border-2 border-blue-200"
                                />
                              </div>
                              <div className="flex flex-row flex-grow justify-between">
                                <div>
                                  <h3 className="text-xl font-semibold text-blue-900">
                                    {visit.pet_sitter_data.user_data.first_name}{" "}
                                    {visit.pet_sitter_data.user_data.last_name}
                                  </h3>
                                  <h2 className="text-m">
                                    {visit.pet_sitter_data.user_data.email}
                                  </h2>
                                  <h2 className="text-m">
                                    {
                                      visit.pet_sitter_data.user_data
                                        .phone_number
                                    }
                                  </h2>
                                  <h2 className="text-m">
                                    {
                                      visit.pet_sitter_data.user_data
                                        .address_city
                                    }
                                    ,{" "}
                                    {
                                      visit.pet_sitter_data.user_data
                                        .address_street
                                    }
                                  </h2>
                                </div>
                                {visit.price && (
                                  <p className="text-m">
                                    <span className="font-semibold">
                                      Cena:{" "}
                                    </span>
                                    {visit.price} zł
                                  </p>
                                )}
                                {visit.services_data &&
                                  visit.services_data.length > 0 && (
                                    <div className="text-m">
                                      <span className="font-semibold">
                                        Usługi:{" "}
                                      </span>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {visit.services_data.map(
                                          (service, index) => (
                                            <span
                                              key={index}
                                              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                                            >
                                              {service.name}
                                            </span>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </div>
                            {(visit.review || visit.rating) && (
                              <div className="text-md p-2 rounded flex items-start gap-4">
                                {visit.pet_data.pet_owner_data.user_data
                                  .profile_picture_url && (
                                  <div className="flex-shrink-0">
                                    <img
                                      src={
                                        visit.pet_data.pet_owner_data.user_data
                                          .profile_picture_url
                                      }
                                      alt="Pet owner profile"
                                      className="w-20 h-20 rounded-full object-cover"
                                    />
                                  </div>
                                )}
                                <div className="flex flex-col flex-grow bg-gray-100 p-2 rounded">
                                  <div className="flex flex-row justify-between">
                                    <span className="font-semibold">
                                      Opinia od{" "}
                                      {
                                        visit.pet_data.pet_owner_data.user_data
                                          .first_name
                                      }{" "}
                                      {
                                        visit.pet_data.pet_owner_data.user_data
                                          .last_name
                                      }
                                      :{" "}
                                    </span>
                                    {visit.rating && (
                                      <div className="text-md flex items-center ml-4 flex-shrink-0">
                                        <span className="font-semibold">
                                          Ocena:{" "}
                                        </span>
                                        <span className="text-yellow-500 flex flex-row px-1 gap-1">
                                          {[...Array(visit.rating)].map(
                                            (_, i) => (
                                              <PawIcon
                                                key={i}
                                                width="24"
                                                height="24"
                                              />
                                            )
                                          )}
                                        </span>
                                        <span className="text-gray-500 flex flex-row gap-1">
                                          {[...Array(5 - visit.rating)].map(
                                            (_, i) => (
                                              <PawIcon
                                                key={i}
                                                width="24"
                                                height="24"
                                              />
                                            )
                                          )}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-grow break-normal">
                                    <p className="mt-1 text-gray-600 ">
                                      {visit.review}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                            {visitFilter === "completed" && (
                              <button
                                onClick={() => setReviewingVisit(visit.id)}
                                className="container bg-blue-600 flex justify-center text-white font-semibold rounded-lg px-4 py-2 hover:bg-blue-700 mt-2 "
                              >
                                Dodaj/zmień opinię
                              </button>
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
            <AddPetModal
              isOpen={showAddPetModal}
              onClose={() => setShowAddPetModal(false)}
            />
            {editingPet && (
              <EditPetModal
                isOpen={!!editingPet}
                onClose={() => setEditingPet(null)}
                pet={editingPet}
                onPetUpdated={refreshPetOwnerData}
              />
            )}
            {deletingPet && (
              <DeletePetModal
                isOpen={!!deletingPet}
                onClose={() => setDeletingPet(null)}
                pet={deletingPet}
                onPetDeleted={refreshPetOwnerData}
              />
            )}
            {reviewingVisit && (
              <AddReviewModal
                isOpen={!!reviewingVisit}
                onClose={() => setReviewingVisit(null)}
                visitId={reviewingVisit}
                onReviewAdded={refreshPetOwnerData}
                reviewExists={
                  filteredVisits?.find((visit) => visit.id === reviewingVisit)
                    ?.review
                }
                ratingExists={
                  filteredVisits?.find((visit) => visit.id === reviewingVisit)
                    ?.rating
                }
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export { PetOwnerProfilePage };
