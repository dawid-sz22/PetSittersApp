import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { UserData } from "../types";
import {
  getUserDataAPI,
  handleLoginAPI,
  handleUpdateUserAPI,
  deletePetSitterAPI,
  deleteUserAPI,
} from "../apiConfig";
import { CircularProgress } from "@mui/material";
import ErrorFetching from "../components/ErrorFetching";
import { toast, ToastContainer } from "react-toastify";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";

function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  // Error states
  const [isLoading, setIsLoading] = useState(true);
  const [errorFetching, setErrorFetching] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState("");
  // Modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showDeletePetSitterModal, setShowDeletePetSitterModal] =
    useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
    useState(false);
  // Form states
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);
  const [phoneError, setPhoneError] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");

  const handlePhoneNumberValidation = (phone: string | undefined) => {
    setPhoneNumber(phone);
    if (isValidPhoneNumber(phone ? phone : "")) {
      setPhoneError("");
    } else {
      setPhoneError("Podany numer telefonu jest niepoprawny");
    }
  };

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

  useEffect(() => {
    if (newPassword && newPassword.length < 8) {
      setPasswordError("Minimalna wymagana ilość znaków: 8");
    } else if (newPasswordConfirm && newPassword !== newPasswordConfirm) {
      setPasswordError("Podane hasła nie są identyczne");
    } else {
      setPasswordError("");
    }
  }, [newPassword, newPasswordConfirm]);

  const toastErrorShow = (message: string) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      style: {
        fontSize: "1.2rem",
        fontWeight: "bold",
        width: "100%",
      },
    });
  };

  const showToastSuccess = (message: string) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      style: {
        fontSize: "1.2rem",
        fontWeight: "bold",
        width: "100%",
      },
    });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await handleLoginAPI(email, password);
      await handleUpdateUserAPI({ password: newPassword });
      setShowPasswordModal(false);
      showToastSuccess("Hasło zostało zmienione!");

      // Reset form
      setPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
    } catch (err) {
      toastErrorShow("Nie udało się zmienić hasła :(");
      console.error("Error updating password:", err);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleUpdateUserAPI({ email: email });
      setShowEmailModal(false);
      showToastSuccess("Email został zmieniony!");

      // Reset form
      setEmail("");
      setEmailConfirm("");
    } catch (err) {
      toastErrorShow("Nie udało się zmienić emaila :(");
      console.error("Error updating email:", err);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log(phoneNumber);
      await handleUpdateUserAPI({
        username: username,
        phone_number: phoneNumber,
      });
      setShowProfileModal(false);
      showToastSuccess("Dane osobowe zostały zmienione!");
      localStorage.setItem("usernamePetSitter", username);
      window.location.reload();

      setUsername("");
      setPhoneNumber(undefined);
    } catch (err) {
      toastErrorShow("Nie udało się zmienić danych osobowych :(");
      console.error("Error updating profile:", err);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleUpdateUserAPI({
        address_city: city,
        address_street: street,
        address_house: houseNumber,
      });
      setShowAddressModal(false);
      showToastSuccess("Adres został zmieniony!");
      window.location.reload();

      setCity("");
      setStreet("");
      setHouseNumber("");
    } catch (err) {
      toastErrorShow("Nie udało się zmienić adresu :(");
      console.error("Error updating address:", err);
    }
  };

  const handleDeletePetSitter = async () => {
    try {
      await deletePetSitterAPI();
      showToastSuccess("Profil opiekuna został usunięty!");
      window.location.reload();
    } catch (err) {
      toastErrorShow("Nie udało się usunąć profilu opiekuna :(");
      console.error("Error deleting pet sitter profile:", err);
    }
  };

  const handleCreatePetSitter = () => {
    window.location.href = "/create-pet-sitter";
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUserAPI();
      showToastSuccess("Konto zostało usunięte!");
      localStorage.clear();
      window.location.href = "/";
    } catch (err) {
      toastErrorShow("Nie udało się usunąć konta");
      console.error("Error deleting user:", err);
    }
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

            <div className="w-1/2">
              <div className="rounded-2xl shadow-lg border p-6 bg-blue-100 mb-6">
                <h2 className="text-3xl font-bold text-blue-900 mb-4">
                  Dane opiekuna
                </h2>
                {userData?.pet_sitter_details ? (
                  <div className="bg-white rounded-lg p-4 border-2 border-black">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-600 text-lg">Stawka dzienna</p>
                        <p className="font-semibold text-lg">
                          {userData.pet_sitter_details?.daily_rate} zł
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-lg">
                          Stawka godzinowa
                        </p>
                        <p className="font-semibold text-lg">
                          {userData.pet_sitter_details?.hourly_rate} zł
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-lg">Doświadczenie</p>
                        <p className="font-semibold text-lg">
                          {userData.pet_sitter_details?.experience_in_months}{" "}
                          miesięcy
                        </p>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-gray-600 text-lg mb-2">O mnie</p>
                      <p className="text-gray-900 text-lg">
                        {userData.pet_sitter_details?.description_bio}
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

              <div className="rounded-2xl shadow-lg border p-6 bg-blue-100 sticky top-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-blue-900">
                    Moje zwierzęta
                  </h2>
                  <button
                    className="bg-blue-700 text-white rounded-lg px-6 py-3 hover:bg-blue-800 font-semibold text-lg shadow-md"
                    onClick={() => {
                      /* Add pet modal logic */
                    }}
                  >
                    Dodaj zwierzę
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {userData?.pets && userData.pets.length > 0 ? (
                    userData.pets.map((pet) => (
                      <div
                        key={pet.id}
                        className="bg-white border-2 border-black rounded-lg p-4 hover:bg-gray-50 transition-colors shadow-md"
                      >
                        <div className="w-48 items-center mx-auto h-48 mb-3 rounded-full overflow-hidden border-4 border-black">
                          <img
                            src={
                              pet.photo_URL ||
                              "https://cdn.shopify.com/s/files/1/0086/0795/7054/files/Labrador.jpg?v=1645179151"
                            }
                            alt={`${pet.name}'s photo`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center border-b-2 pb-2">
                            <h3 className="text-xl font-bold text-blue-900">
                              {pet.name}
                            </h3>
                            <span className="text-sm font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-full">
                              {pet.species}
                            </span>
                          </div>
                          <div className="text-l space-y-1">
                            <p className="flex justify-between">
                              <span className="font-semibold text-gray-700">
                                Rasa:
                              </span>
                              <span className="text-gray-900">
                                {pet.breed || "Nie podano"}
                              </span>
                            </p>
                            <p className="flex justify-between">
                              <span className="font-semibold text-gray-700">
                                Wiek:
                              </span>
                              <span className="text-gray-900">
                                {pet.age} lat
                              </span>
                            </p>
                            <p className="flex justify-between">
                              <span className="font-semibold text-gray-700">
                                Waga:
                              </span>
                              <span className="text-gray-900">
                                {pet.weight} kg
                              </span>
                            </p>
                            {pet.info_special_treatment && (
                              <div className="mt-2 bg-yellow-50 p-2 rounded-lg text-xs">
                                <p className="font-semibold text-gray-700">
                                  Specjalne wymagania:
                                </p>
                                <p className="text-gray-900">
                                  {pet.info_special_treatment}
                                </p>
                              </div>
                            )}
                            {pet.favorite_activities && (
                              <div className="mt-3 bg-green-50 p-3 rounded-lg">
                                <p className="font-semibold text-gray-700 mb-1">
                                  Ulubione aktywności:
                                </p>
                                <p className="text-gray-900">
                                  {pet.favorite_activities}
                                </p>
                              </div>
                            )}
                            {pet.feeding_info && (
                              <div className="mt-3 bg-blue-50 p-3 rounded-lg">
                                <p className="font-semibold text-gray-700 mb-1">
                                  Informacje o karmieniu:
                                </p>
                                <p className="text-gray-900">
                                  {pet.feeding_info}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="col-span-2 text-center text-gray-500 text-lg py-8">
                      Nie masz jeszcze żadnych zwierząt
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {showPasswordModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-2xl font-bold mb-4">Zmień hasło</h2>
                <form onSubmit={handlePasswordSubmit}>
                  <div className="mb-3">
                    <label
                      htmlFor="current-password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Obecne hasło
                    </label>
                    <input
                      id="current-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="new-password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nowe hasło
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="confirm-password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Powtórz nowe hasło
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      value={newPasswordConfirm}
                      onChange={(e) => setNewPasswordConfirm(e.target.value)}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  {passwordError && (
                    <p className="text-red-500 text-sm mb-4">{passwordError}</p>
                  )}
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(false)}
                      className="px-4 py-2 bg-gray-200 rounded hover:cursor-pointer hover:bg-gray-300"
                    >
                      Anuluj
                    </button>
                    <input
                      type="submit"
                      value="Zmień hasło"
                      className="px-4 py-2 hover:cursor-pointer hover:bg-blue-800 bg-blue-700 text-white rounded disabled:bg-gray-400"
                      disabled={!!passwordError}
                    />
                  </div>
                </form>
              </div>
            </div>
          )}

          {showEmailModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-2xl font-bold mb-4">Zmień email</h2>
                <form onSubmit={handleEmailSubmit}>
                  <div className="mb-3">
                    <label
                      htmlFor="new-email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nowy email
                    </label>
                    <input
                      id="new-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="confirm-email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Powtórz email
                    </label>
                    <input
                      id="confirm-email"
                      type="email"
                      value={emailConfirm}
                      onChange={(e) => setEmailConfirm(e.target.value)}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="verify-password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Podaj hasło w ramach weryfikacji
                    </label>
                    <input
                      id="verify-password"
                      type="password"
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowEmailModal(false)}
                      className="px-4 py-2 bg-gray-200 rounded"
                    >
                      Anuluj
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-700 text-white rounded"
                    >
                      Zmień email
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showProfileModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-2xl font-bold mb-4">Edytuj dane osobowe</h2>
                <form onSubmit={handleProfileSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="phone-number"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Numer telefonu
                    </label>
                    <PhoneInput
                      autoComplete="tel"
                      value={phoneNumber}
                      onChange={(phone) => handlePhoneNumberValidation(phone)}
                      placeholder="Podaj nr telefonu"
                      international={true}
                      countryCallingCodeEditable={false}
                      initialValueFormat="national"
                      withCountryCallingCode={true}
                      className="w-full p-2 border rounded"
                      required
                      defaultCountry="PL"
                    />
                    {phoneError && (
                      <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nazwa użytkownika
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowProfileModal(false)}
                      className="px-4 py-2 bg-gray-200 rounded"
                    >
                      Anuluj
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-700 text-white rounded"
                    >
                      Zapisz zmiany
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showAddressModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-2xl font-bold mb-4">Edytuj adres</h2>
                <form onSubmit={handleAddressSubmit}>
                  <div className="mb-3">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Miasto
                    </label>
                    <input
                      id="city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="street"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Ulica
                    </label>
                    <input
                      id="street"
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="house-number"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Numer domu
                    </label>
                    <input
                      id="house-number"
                      type="text"
                      value={houseNumber}
                      onChange={(e) => setHouseNumber(e.target.value)}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddressModal(false)}
                      className="px-4 py-2 bg-gray-200 rounded"
                    >
                      Anuluj
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-700 text-white rounded"
                    >
                      Zapisz zmiany
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showDeletePetSitterModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-2xl font-bold mb-4">
                  Usuń profil opiekuna
                </h2>
                <p className="mb-4">
                  Czy na pewno chcesz usunąć swój profil opiekuna? Ta operacja
                  jest nieodwracalna.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowDeletePetSitterModal(false)}
                    className="px-4 py-2 bg-gray-200 rounded"
                  >
                    Anuluj
                  </button>
                  <button
                    onClick={handleDeletePetSitter}
                    className="px-4 py-2 bg-red-600 text-white rounded"
                  >
                    Usuń profil
                  </button>
                </div>
              </div>
            </div>
          )}

          {showDeleteUserModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-2xl font-bold mb-4">Usuń konto</h2>
                <p className="mb-4">
                  Czy na pewno chcesz usunąć swoje konto? Ta operacja jest
                  nieodwracalna i spowoduje utratę wszystkich danych.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowDeleteUserModal(false)}
                    className="px-4 py-2 bg-gray-200 rounded"
                  >
                    Anuluj
                  </button>
                  <button
                    onClick={handleDeleteUser}
                    className="px-4 py-2 bg-red-600 text-white rounded"
                  >
                    Usuń konto
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export { ProfilePage };
