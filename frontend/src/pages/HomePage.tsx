import { getAllPetSittersAPI, isLoggedIn } from "../apiConfig.tsx";
import { getUserDataAPI } from "../apiConfig.tsx";
import Navbar from "../components/Navbar.tsx";
import { PetSittersDetailsPage } from "./PetSittersListPage.tsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function HomePage() {

  const handleCreatePetSitter = async () => {
    try {
      if (!isLoggedIn()) {
        window.location.href = "/login";
        return;
      }
      const userData = await getUserDataAPI();
      console.log(userData);
      if (userData?.pet_sitter_details) {
        toast.info("Jesteś już opiekunem!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          style: {
            fontSize: "1.2rem",
            fontWeight: "bold",
            width: "100%",
          },
        });
        return;
      }
      if (isLoggedIn()) {
        window.location.href = "/create-pet-sitter";
      } else {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error(error);
      toast.error("Wystąpił błąd :(", {
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
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="min-h-screen bg-[url('./home_bg.jpeg')] bg-cover">
        <div className="container mx-8 py-80 justify-center">
          <h1 className="text-4xl font-bold text-center mb-12">
            Witaj w Pet Sitters!
          </h1>
          <div className="flex justify-center gap-8">
            <button
              onClick={handleCreatePetSitter}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transition-colors"
            >
              Chcę zostać opiekunem
            </button>
            <button
              onClick={() => (window.location.href = "/pet-sitters")}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transition-colors"
            >
              Szukam opiekuna
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
