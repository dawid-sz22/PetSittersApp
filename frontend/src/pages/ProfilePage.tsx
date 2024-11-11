import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { Pet, UserData } from "../types";
import { getUserDataAPI } from "../apiConfig";

function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const user = await getUserDataAPI();
        setUserData(user);
        setError(null);
      } catch (err) {
        setError('Failed to fetch user data');
        console.error('Error fetching user data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPasswordModal(false);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowEmailModal(false);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowProfileModal(false);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddressModal(false);
  };

  if (isLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-10 px-4 flex gap-6">
        <div className="rounded-2xl shadow-lg border p-4 bg-blue-100 w-1/2">
          <div className="flex flex-col justify-center items-center w-64 h-64 bg-white rounded-full overflow-hidden shadow-lg mx-auto border-2 border-black mb-4">
            <img
              src={userData?.profile_picture_url || "https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8fDA%3D"}
              className="w-full h-full object-cover"
              alt="Profile picture"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 mb-4">
            <div className="bg-white rounded-lg p-3 border-2 border-black divide-y-2 divide-black">
              <h2 className="text-2xl text-center font-bold mb-2">Dane osobowe</h2>
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
                  <p className="font-semibold">{userData?.address_street}</p>
                </div>
                <div>
                  <p className="text-gray-600">Numer domu</p>
                  <p className="font-semibold">{userData?.address_house ? userData.address_house : 'Nie podano'}</p>
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
              <h2 className="text-2xl text-center font-bold mb-4">Ustawienia konta</h2>
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
              </div>
            </div>

            
          </div>
        </div>

        <div className="w-1/2">
          <div className="rounded-2xl shadow-lg border p-6 bg-blue-100 sticky top-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-blue-900">Moje zwierzęta</h2>
              <button
                className="bg-blue-700 text-white rounded-lg px-6 py-3 hover:bg-blue-800 font-semibold text-lg shadow-md"
                onClick={() => {/* Add pet modal logic */}}
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
                        src={pet.photo_URL || "https://cdn.shopify.com/s/files/1/0086/0795/7054/files/Labrador.jpg?v=1645179151"} 
                        alt={`${pet.name}'s photo`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center border-b-2 pb-2">
                        <h3 className="text-xl font-bold text-blue-900">{pet.name}</h3>
                        <span className="text-sm font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-full">{pet.species}</span>
                      </div>
                      <div className="text-l space-y-1">
                        <p className="flex justify-between">
                          <span className="font-semibold text-gray-700">Rasa:</span> 
                          <span className="text-gray-900">{pet.breed || 'Nie podano'}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="font-semibold text-gray-700">Wiek:</span> 
                          <span className="text-gray-900">{pet.age} lat</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="font-semibold text-gray-700">Waga:</span> 
                          <span className="text-gray-900">{pet.weight} kg</span>
                        </p>
                        {pet.info_special_treatment && (
                          <div className="mt-2 bg-yellow-50 p-2 rounded-lg text-xs">
                            <p className="font-semibold text-gray-700">Specjalne wymagania:</p>
                            <p className="text-gray-900">{pet.info_special_treatment}</p>
                          </div>
                        )}
                        {pet.favorite_activities && (
                          <div className="mt-3 bg-green-50 p-3 rounded-lg">
                            <p className="font-semibold text-gray-700 mb-1">Ulubione aktywności:</p>
                            <p className="text-gray-900">{pet.favorite_activities}</p>
                          </div>
                        )}
                        {pet.feeding_info && (
                          <div className="mt-3 bg-blue-50 p-3 rounded-lg">
                            <p className="font-semibold text-gray-700 mb-1">Informacje o karmieniu:</p>
                            <p className="text-gray-900">{pet.feeding_info}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-2 text-center text-gray-500 text-lg py-8">Nie masz jeszcze żadnych zwierząt</p>
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
              <input
                type="password"
                placeholder="Obecne hasło"
                required
                className="w-full mb-3 p-2 border rounded"
              />
              <input
                type="password"
                placeholder="Nowe hasło"
                required
                className="w-full mb-3 p-2 border rounded"
              />
              <input
                type="password"
                placeholder="Powtórz nowe hasło"
                required
                className="w-full mb-4 p-2 border rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Anuluj
                </button>
                <input
                  type="submit"
                  value="Zmień hasło"
                  className="px-4 py-2 bg-blue-700 text-white rounded"
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
              <input
                type="email"
                placeholder="Nowy email"
                required
                className="w-full mb-3 p-2 border rounded"
              />
              <input
                type="email"
                placeholder="Powtórz email"
                required
                className="w-full mb-4 p-2 border rounded"
              />
              <input
                type="password"
                placeholder="Podaj hasło w ramach weryfikacji"
                required
                className="w-full mb-4 p-2 border rounded"
              />
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
              <input
                type="text"
                placeholder="Imię"
                required
                className="w-full mb-3 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Nazwisko"
                required
                className="w-full mb-3 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Nazwa użytkownika"
                required
                className="w-full mb-4 p-2 border rounded"
              />
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
              <input
                type="text"
                placeholder="Miasto"
                required
                className="w-full mb-3 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Ulica"
                required
                className="w-full mb-3 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Numer domu"
                required
                className="w-full mb-4 p-2 border rounded"
              />
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
    </>
  );
}

export { ProfilePage };
