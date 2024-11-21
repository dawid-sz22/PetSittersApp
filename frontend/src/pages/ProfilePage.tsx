import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { UserData } from "../types";
import { getUserDataAPI } from "../apiConfig";
import { CircularProgress } from "@mui/material";
import ErrorFetching from "../components/ErrorFetching";
import { ToastContainer } from "react-toastify";
import { PasswordModal } from "../components/modals/PasswordModal";
import { EmailModal } from "../components/modals/EmailModal";
import { ProfileModal } from "../components/modals/ProfileModal";
import { AddressModal } from "../components/modals/AddressModal";
import { DeleteUserModal } from "../components/modals/DeleteUserModal";

function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorFetching, setErrorFetching] = useState<string | null>(null);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);

  useEffect(() => {
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
        <>
          <div className="container mx-auto mt-10 px-4 flex gap-6">
            <div className="rounded-2xl shadow-lg border p-4 bg-blue-100 w-1/2">
              <div className="flex flex-col justify-center items-center w-64 h-64 bg-white rounded-full overflow-hidden shadow-lg mx-auto border-2 border-black mb-4">
                <img
                  src={
                    userData?.profile_picture_url ||
                    "https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8fDA%3D"
                  }
                  className="w-full h-full object-cover"
                  alt="Profile picture"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 mb-4">
                <div className="bg-white rounded-lg p-3 border-2 border-black divide-y-2 divide-black">
                  <h2 className="text-2xl text-center font-bold mb-2">
                    Dane osobowe
                  </h2>
                  <div className="grid grid-cols-2 gap-2 text-l pt-2">
                    <div>
                      <p className="text-gray-600">Imię</p>
                      <p className="font-semibold">{userData?.first_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Nazwisko</p>
                      <p className="font-semibold">{userData?.last_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Nazwa użytkownika</p>
                      <p className="font-semibold">@{userData?.username}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email</p>
                      <p className="font-semibold">{userData?.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Data urodzenia</p>
                      <p className="font-semibold">{userData?.date_of_birth}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Numer telefonu</p>
                      <p className="font-semibold">{userData?.phone_number}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3 border-2 border-black divide-y-2 divide-black">
                  <h2 className="text-2xl text-center font-bold mb-2">Adres</h2>
                  <div className="grid grid-cols-2 gap-2 text-l pt-2">
                    <div>
                      <p className="text-gray-600">Miasto</p>
                      <p className="font-semibold">{userData?.address_city}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Ulica</p>
                      <p className="font-semibold">
                        {userData?.address_street}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Numer domu</p>
                      <p className="font-semibold">
                        {userData?.address_house
                          ? userData.address_house
                          : "Nie podano"}
                      </p>
                    </div>
                  </div>
                  <button
                    className="w-full bg-blue-700 text-white rounded-lg px-4 py-2 hover:bg-blue-800 mt-2"
                    onClick={() => setShowAddressModal(true)}
                  >
                    Edytuj adres
                  </button>
                </div>

                <div className="bg-white rounded-lg p-3 border-2 border-black">
                  <h2 className="text-2xl text-center font-bold mb-4">
                    Ustawienia konta
                  </h2>
                  <div className="space-y-2">
                    <button
                      className="w-full bg-blue-700 text-white rounded-lg px-4 py-2 hover:bg-blue-800"
                      onClick={() => setShowPasswordModal(true)}
                    >
                      Zmień hasło
                    </button>
                    <button
                      className="w-full bg-blue-700 text-white rounded-lg px-4 py-2 hover:bg-blue-800"
                      onClick={() => setShowEmailModal(true)}
                    >
                      Zmień email
                    </button>
                    <button
                      className="w-full bg-blue-700 text-white rounded-lg px-4 py-2 hover:bg-blue-800"
                      onClick={() => setShowProfileModal(true)}
                    >
                      Edytuj dane osobowe
                    </button>

                    <button
                      className="w-full bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-700"
                      onClick={() => setShowDeleteUserModal(true)}
                    >
                      Usuń konto
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-1/2 space-y-6">
              <div className="rounded-2xl shadow-lg border p-6 bg-blue-100">
                <h2 className="text-3xl font-bold text-blue-900 mb-4">
                  Profil właściciela zwierząt
                </h2>
                {userData?.is_pet_owner ? (
                  <button
                    className="w-full bg-blue-700 text-white rounded-lg px-4 py-2 hover:bg-blue-800"
                    onClick={() => window.location.href = '/pet-owner-profile'}
                  >
                    Przejdź do profilu właściciela
                  </button>
                ) : (
                  <p className="text-center text-gray-500 py-2">
                    Nie masz jeszcze profilu właściciela zwierząt
                  </p>
                )}
              </div>

              <div className="rounded-2xl shadow-lg border p-6 bg-blue-100">
                <h2 className="text-3xl font-bold text-blue-900 mb-4">
                  Profil opiekuna
                </h2>
                {userData?.is_pet_sitter ? (
                  <button
                    className="w-full bg-blue-700 text-white rounded-lg px-4 py-2 hover:bg-blue-800"
                    onClick={() => window.location.href = '/pet-sitter-profile'}
                  >
                    Przejdź do profilu opiekuna
                  </button>
                ) : (
                  <button
                    className="w-full bg-green-700 text-white rounded-lg px-4 py-2 hover:bg-green-800"
                    onClick={handleCreatePetSitter}
                  >
                    Zostań opiekunem
                  </button>
                )}
              </div>

            </div>
          </div>
          <PasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
          <EmailModal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)} />
          <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
          <AddressModal isOpen={showAddressModal} onClose={() => setShowAddressModal(false)} />
          <DeleteUserModal isOpen={showDeleteUserModal} onClose={() => setShowDeleteUserModal(false)} />
        </>
      )}
    </>
  );
}

export { ProfilePage };
