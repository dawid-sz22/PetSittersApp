import { handleLoginAPI, getGoogleOAuth2RedirectURL } from "../apiConfig.tsx";
import * as React from "react";
import { CircularProgress } from "@mui/material";
import Navbar from "../components/Navbar.tsx";
import { toast, ToastContainer } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errorLogin, setErrorLogin] = React.useState("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    const token = searchParams.get("token");
    const user_id = searchParams.get("user_id");
    const username = searchParams.get("username");
    const is_pet_sitter = searchParams.get("is_pet_sitter");
    const is_pet_owner = searchParams.get("is_pet_owner");
    if (error) {
      toast.error(error);
    }
    if (token && user_id && username && is_pet_sitter && is_pet_owner) {
      localStorage.setItem("tokenPetSitter", token);
      localStorage.setItem("userIDPetSitter", user_id);
      localStorage.setItem("usernamePetSitter", username);
      localStorage.setItem("isPetSitter", is_pet_sitter.toLowerCase());
      localStorage.setItem("isPetOwner", is_pet_owner.toLowerCase());
      window.location.href = "/";
    }
  }, [searchParams]);

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true before API call
    setErrorLogin("");
    try {
      await handleLoginAPI(email, password);
    } catch (e) {
      setErrorLogin("Podano zły email lub hasło!");
      console.log(e);
      setLoading(false); // Set loading to false on error
      return;
    }

    setErrorLogin("");
    setLoading(false); // Set loading to false after successful API call

    window.location.href = "/";

    return;
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const url_redirect = getGoogleOAuth2RedirectURL();
      window.location.href = url_redirect;
    } catch (e) {
      setErrorLogin("Wystąpił błąd podczas logowania przez Google");
      console.log(e);
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="flex justify-center items-center min-h-screen py-10 bg-[url('./assets/bg_register.jpg')] bg-cover bg-fixed">
        <form
          onSubmit={handleSubmitLogin}
          className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
        >
          <h1 className="text-center text-2xl font-bold text-blue-500 mb-6">
            Zaloguj się
          </h1>

          <label className="block mb-4">
            <span className="text-gray-700">Email:</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Podaj adres email"
            />
          </label>

          <label className="block mb-4">
            <span className="text-gray-700">Hasło:</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Podaj hasło"
            />
          </label>

          <div className="flex items-center justify-center mb-4">
            <div className="text-m">
              <a href="#" className="text-blue-500 hover:text-blue-600">
                Zapomniałeś hasła?
              </a>
            </div>
          </div>

          <div className="flex items-center justify-center text-m mb-4">
            <span className="pr-2">Nie posiadasz jeszcze konta?</span>
            <a href="/register" className="text-blue-500 hover:text-blue-600">
              Zarejestruj się!
            </a>
          </div>

          <div className="flex items-center justify-center mb-5">
            {loading && <CircularProgress />}
          </div>

          {errorLogin && (
            <p className="bg-red-500 text-white text-m mb-4 p-2 rounded text-center">
              {errorLogin}
            </p>
          )}

          <input
            type="submit"
            value="Zaloguj się"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          />

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  lub
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleGoogleLogin}
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
                type="button"
              >
                <img
                  className="h-6 w-6"
                  src="https://www.svgrepo.com/show/506498/google.svg"
                  alt="Google"
                />
                <span className="text-m font-semibold">
                  Zaloguj przez Google
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default LoginPage;
