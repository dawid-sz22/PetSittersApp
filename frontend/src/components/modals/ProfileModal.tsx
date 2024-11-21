import { BaseModalProps } from "../../types";
import { useState } from "react";
import { handleUpdateUserAPI } from "../../apiConfig";
import { toast } from "react-toastify";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";

export function ProfileModal({ isOpen, onClose }: BaseModalProps) {
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);
  const [phoneError, setPhoneError] = useState("");

  const handlePhoneNumberValidation = (phone: string | undefined) => {
    setPhoneNumber(phone);
    if (isValidPhoneNumber(phone ? phone : "")) {
      setPhoneError("");
    } else {
      setPhoneError("Podany numer telefonu jest niepoprawny");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleUpdateUserAPI({
        username: username,
        phone_number: phoneNumber,
      });
      onClose();
      toast.success("Dane osobowe zostały zmienione!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        style: {
          fontSize: "1.2rem",
          fontWeight: "bold",
          width: "100%",
        },
      });
      localStorage.setItem("usernamePetSitter", username);
      window.location.reload();

      setUsername("");
      setPhoneNumber(undefined);
    } catch (err) {
      toast.error("Nie udało się zmienić danych osobowych :(", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        style: {
          fontSize: "1.2rem",
          fontWeight: "bold",
          width: "100%",
        },
      });
      console.error("Error updating profile:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Edytuj dane osobowe</h2>
        <form onSubmit={handleSubmit}>
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
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-700 text-white rounded"
              disabled={!!phoneError}
            >
              Zapisz zmiany
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 