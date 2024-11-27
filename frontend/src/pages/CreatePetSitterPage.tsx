import { useEffect, useState } from "react";
import { createPetSitterAPI } from "../apiConfig";
import Navbar from "../components/Navbar";
import { toast, ToastContainer } from "react-toastify";
import { CreatePetSitterData } from "../types";
function CreatePetSitterPage() {
  const [data, setData] = useState<CreatePetSitterData>({
    photo_URL: "",
    experience_in_months: 0,
    daily_rate: 0,
    hourly_rate: 0,
    description_bio: "",
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await createPetSitterAPI(data);
      toast.success("Profil opiekuna został utworzony!", {
        onClose: () => {
          window.location.href = "/profile";
        },
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        style: {
          fontSize: "1.2rem",
          fontWeight: "bold",
          width: "100%",
        },
      });
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
        toast.error(e.message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          style: {
            fontSize: "1.2rem",
            fontWeight: "bold",
            width: "100%",
          },
        });
      }
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-300 pt-10">
        <div className="container mx-auto py-12 px-6">
          <div className="max-w-md mx-auto bg-sky-100 rounded-2xl shadow-lg border-2 border-black p-8">
            <h2 className="text-2xl font-bold text-center mb-8 text-sky-600">
              Zostań opiekunem zwierząt
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-m font-medium text-gray-700">
                  Doświadczenie (w miesiącach)
                </label>
                <input
                  type="number"
                  min="0"
                  onChange={(e) =>
                    setData({
                      ...data,
                      experience_in_months: parseInt(e.target.value),
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-m font-medium text-gray-700">
                  Stawka dzienna (PLN)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  onChange={(e) =>
                    setData({ ...data, daily_rate: parseInt(e.target.value) })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-m font-medium text-gray-700">
                  Stawka godzinowa (PLN)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  onChange={(e) =>
                    setData({ ...data, hourly_rate: parseInt(e.target.value) })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-m font-medium text-gray-700">
                  Opis / Bio
                </label>
                <textarea
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                  onChange={(e) =>
                    setData({ ...data, description_bio: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Utwórz profil opiekuna
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreatePetSitterPage;
