import {handleLoginAPI} from "../apiConfig.tsx";
import * as React from "react";
import {CircularProgress} from "@mui/material";

function LoginPage() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [errorLogin, setErrorLogin] = React.useState('');

    const handleSubmitLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);  // Set loading to true before API call
        setErrorLogin("");
        try {
            await handleLoginAPI(
                email,
                password,
            );
        } catch (e) {
            setErrorLogin("Podano zły email lub hasło!");
            console.log(e);
            setLoading(false);  // Set loading to false on error
            return;
        }

        setErrorLogin("");
        setLoading(false);  // Set loading to false after successful API call

        window.location.href = "/";

        return;
    };


    return (
        <>
            <div className="bg-[url('./assets/Designer.jpeg')] h-screen w-screen bg-cover">
                <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Zaloguj się
                        </h2>
                    </div>

                    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                            <form className="space-y-6" onSubmit={handleSubmitLogin}>
                                <div className="">
                                    <label className="block text-sm font-medium  text-gray-700">
                                        Email
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            autoComplete="email"
                                            required
                                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                            placeholder="Podaj adres email"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Hasło
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                            placeholder="Podaj hasło"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-center">
                                    <div className="text-sm">
                                        <a
                                            href="#"
                                            className="font-medium text-blue-600 hover:text-blue-500"
                                        >
                                            Zapomniałeś hasła?
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center text-sm">
                                    <a className="pr-2">
                                        Nie posiadasz jeszcze konta?
                                    </a>
                                    <a href={"/register"} className="font-medium text-blue-600 hover:text-blue-500">
                                        Zarejestruj się!
                                    </a>
                                </div>

                                <div>
                                    <div className="flex justify-center pb-3">
                                        {loading && (
                                            <CircularProgress />
                                        )}
                                    </div>
                                    {
                                        errorLogin &&
                                        <p className="bg-red-500 text-white text-m mb-4 p-2 rounded text-center">{errorLogin}</p>
                                    }
                                    <input
                                        type="submit"
                                        value="Zaloguj się"
                                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </form>
                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-100 text-gray-500">
                    lub skorzystaj z
                  </span>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-center">
                                    <div>
                                        <a
                                            href="#"
                                            className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            <img
                                                className="h-6 w-6"
                                                src="https://www.svgrepo.com/show/506498/google.svg"
                                                alt=""
                                            />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginPage;
