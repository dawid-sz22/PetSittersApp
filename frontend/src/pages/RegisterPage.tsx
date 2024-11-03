import {useEffect, useState} from "react";
import {handleRegisterAPI} from "../apiConfig.tsx";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {isValidPhoneNumber} from "react-phone-number-input";
import * as React from "react";
import {CircularProgress} from "@mui/material";

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);
    const [addressCity, setAddressCity] = useState('');
    const [addressStreet, setAddressStreet] = useState('');
    const [addressNumber, setAddressNumber] = useState('');
    const [errorRegister, setErrorRegister] = useState('');
    const [loading, setLoading] = useState(false);

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

    const handlePhoneNumberValidation = (phone: string | undefined) => {
        setPhoneNumber(phone);
        if (isValidPhoneNumber((phone) ? phone : '')) {
            setPhoneError('');
        } else {
            setPhoneError('Podany numer telefonu jest niepoprawny');
        }
    };

    const handleRepeatPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRepeatPassword(e.target.value);
        if (password && e.target.value !== password) {
            setPasswordError('Podane hasła nie są identyczne');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== repeatPassword) {
            setPasswordError('Podane hasła nie są identyczne');
            return;
        } else if (password.length < 8) {
            setPasswordError('Minimalna wymagana ilość znaków: 8');
            return;
        } else if (!isValidPhoneNumber((phoneNumber) ? phoneNumber : '')) {
            setPhoneError('Podany numer telefonu jest niepoprawny');
            return;
        }

        setLoading(true);
        try {
            if (phoneNumber != null) {
                await handleRegisterAPI(
                    {
                        email: email,
                        dateOfBirth: dateOfBirth,
                        firstName: firstName,
                        lastName: lastName,
                        password: password,
                        username: username,
                        phone_number: phoneNumber,
                        address_city: addressCity,
                        address_street: addressStreet,
                        address_number: addressNumber
                    }
                )
            }
        } catch (e) {
            if (e instanceof Error) setErrorRegister(e.message);
            console.log(e);

            return;
        }
        setLoading(false);
        setErrorRegister('');

        return;
    };


// Update form element to include `onSubmit` prop
    return (
        <>
            <div className="flex justify-center items-center min-h-screen py-10 bg-[url('./assets/bg_register.jpg')] bg-cover">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                    <h1 className="text-2xl font-semibold text-blue-500 mb-6">Rejestracja</h1>
                    <label className="block mb-4">
                        <span className="text-gray-700">*Email:</span>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                               required/>
                    </label>
                    <label className="block mb-4">
                        <span className="text-gray-700">*Nazwa użytkownika:</span>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                               required/>
                    </label>
                    <label className="block mb-4">
                        <span className="text-gray-700">*Imię:</span>
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                               required/>
                    </label>
                    <label className="block mb-4">
                        <span className="text-gray-700">*Nazwisko:</span>
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                               required/>
                    </label>
                    <label className="block mb-4">
                        <span className="text-gray-700">*Hasło:</span>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                               required/>
                    </label>
                    <label className="block mb-4">
                        <span className="text-gray-700">*Powtórz hasło:</span>
                        <input type="password" value={repeatPassword} onChange={handleRepeatPasswordChange}
                               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                               required/>
                    </label>
                    {
                        passwordError && <p className="text-red-500 text-sm mb-4">{passwordError}</p>
                    }
                    <label className="block mb-4">
                        <span className="text-gray-700">*Data urodzin:</span>
                        <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)}
                               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                               required/>
                    </label>
                    <label className="block mb-4">
                        <span className="text-gray-700">*Numer telefonur:</span>
                        <PhoneInput autoComplete="tel" value={phoneNumber}
                                    onChange={(phone) => handlePhoneNumberValidation(phone)}
                                    placeholder="Podaj nr telefonu"
                                    international={true}
                                    countryCallingCodeEditable={false}
                                    initialValueFormat="national"
                                    withCountryCallingCode={true}
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required defaultCountry="PL"></PhoneInput>
                    </label>
                    {
                        phoneError && <p className="text-red-500 text-sm mb-4">{phoneError}</p>
                    }
                    <label className="block mb-4">
                        <span className="text-gray-700">*Miejscowość:</span>
                        <input type="text" value={addressCity} onChange={(e) => setAddressCity(e.target.value)}
                               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                               required/>
                    </label>
                    <label className="block mb-4">
                        <span className="text-gray-700">*Ulica:</span>
                        <input type="text" value={addressStreet} onChange={(e) => setAddressStreet(e.target.value)}
                               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                               required/>
                    </label>
                    <label className="block mb-4">
                        <span className="text-gray-700">Numer mieszkania:</span>
                        <input type="text" value={addressNumber} onChange={(e) => setAddressNumber(e.target.value)}
                               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </label>
                    <div className="flex items-center justify-center">
                        {loading && (
                            <CircularProgress/>
                        )}
                    </div>
                    {
                        errorRegister &&
                        <p className="bg-red-500 text-white text-m mb-4 p-2 rounded text-center">{errorRegister}</p>
                    }
                    <input type="submit" value={"Zarejestruj"}
                           className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                           disabled={passwordError !== ''}/>

                </form>
            </div>
        </>
    )
}

export default RegisterPage;