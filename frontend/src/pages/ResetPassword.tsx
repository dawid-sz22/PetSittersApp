import {CircularProgress} from "@mui/material";
import * as React from "react";
import {handlePasswordResetAPI} from "../apiConfig.tsx";
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";

function ResetPassword() {
    const [loading, setLoading] = React.useState(false);
    const [password, setPassword] = React.useState("");
    const [repeatPassword, setRepeatPassword] = React.useState("");
    const [passwordError, setPasswordError] = useState('');
    const [passwordAccepted, setPasswordAccepted] = useState('');
    const query = new URLSearchParams(useLocation().search);

    useEffect(() => {
        const handlePasswordChange = () => {
            if (password && password.length < 8) {
                setPasswordError('Minimalna wymagana ilość znaków: 8');
            } else if (repeatPassword && password !== repeatPassword) {
                setPasswordError('Podane hasła nie są identyczne');
            } else {
                setPasswordError('');
            }
        }
        handlePasswordChange();
    });
    const handleRepeatPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRepeatPassword(e.target.value);
        if (password && e.target.value !== password) {
            setPasswordError('Podane hasła nie są identyczne');
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== repeatPassword) {
            setPasswordError('Podane hasła nie są identyczne');
            return;
        } else if (password.length < 8) {
            setPasswordError('Minimalna wymagana ilość znaków: 8');
            return;
        }

        setLoading(true);  // Set loading to true before API call
        setPasswordError("");
        setPasswordAccepted("");
        console.log(query.get("token"));
        try {
            const respone = await handlePasswordResetAPI(
                password,
                repeatPassword,
                query.get("token") as string,
            );
            console.log(respone);

        } catch (e) {
            console.log(e);
            setLoading(false);  // Set loading to false on error
            return;
        }
        setPasswordAccepted("Hasło zostało zmienione!")
        setLoading(false);  // Set loading to false after successful API call

        return;
    };


    return (
        <>
            <div className="flex h-screen items-center justify-center">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-md shadow-md">
                    <h2 className="text-2xl font-bold text-center">Reset Password</h2>
                    <form className="space-y-6" onSubmit={handleResetPassword}>
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="email" className="text-sm font-medium leading-5">Hasło</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                required
                            />
                        </div>
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="email" className="text-sm font-medium leading-5">Powtórz hasło</label>
                            <input
                                type="password"
                                id="repeatPassword"
                                name="repeatPassword"
                                value={repeatPassword}
                                onChange={handleRepeatPasswordChange}
                                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                required
                            />
                        </div>
                        {
                            passwordError &&
                            <p className="bg-red-500 text-white text-m mb-4 p-2 rounded text-center">{passwordError}</p>
                        }
                        {
                            passwordAccepted &&
                            <p className="bg-green-500 text-white text-m mb-4 p-2 rounded text-center">{passwordAccepted}</p>
                        }
                        <div className="flex justify-center pb-3">
                            {loading && (
                                <CircularProgress/>
                            )}
                        </div>
                        <div>
                            <input
                                type="submit"
                                value={"Change Password"}
                                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ResetPassword