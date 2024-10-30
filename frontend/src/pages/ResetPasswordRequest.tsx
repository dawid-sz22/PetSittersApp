import * as React from "react";
import {handleRequestPasswordResetAPI} from "../apiConfig.tsx";
import {CircularProgress} from "@mui/material";

function ResetPasswordRequest() {
    const [email, setEmail] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [errorEmail, setErrorEmail] = React.useState("");

    const handleResetPasswordRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);  // Set loading to true before API call
        setErrorEmail("");
        try {
            const respone = await handleRequestPasswordResetAPI(
                email
            );
            console.log(respone);

        } catch (e) {
            setErrorEmail("Podany email nie istnieje.");
            console.log(e);
            setLoading(false);  // Set loading to false on error
            return;
        }

        setErrorEmail("");
        setLoading(false);  // Set loading to false after successful API call

        return;
    };

    return (
        <>
            <div className="flex h-screen items-center justify-center">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-md shadow-md">
                    <h2 className="text-2xl font-bold text-center">Reset Password</h2>
                    <form className="space-y-6" onSubmit={handleResetPasswordRequest}>
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="email" className="text-sm font-medium leading-5">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                required
                            />
                        </div>
                        <div className="flex justify-center pb-3">
                            {loading && (
                                <CircularProgress />
                            )}
                        </div>
                        {
                            errorEmail &&
                            <p className="bg-red-500 text-white text-m mb-4 p-2 rounded text-center">{errorEmail}</p>
                        }
                        <div>
                            <input
                                type="submit"
                                value={"Reset Password"}
                                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ResetPasswordRequest;