import axios from "axios";
import {registerArguments} from "./types.tsx";


const API_URL = "http://127.0.0.1:8000/api"

export const handleLogin = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/login/`, {
            email: email,
            password: password
        });
        const token = response.data.token;
        localStorage.setItem("tokenPetSitter", token);
        // window.location.href = "/";
    } catch (e) {
        console.log(e);
        throw e;
    }
}


/**
 * Registers a new user using the provided details.
 * @param email - The email of the user.
 * @param dateOfBirth - The date of birth of the user.
 * @param firstName - The first name of the user.
 * @param lastName - The last name of the user.
 * @param username - The chosen username of the user.
 * @param password
 * @param phone_number
 * @param address_city
 * @param address_street
 * @param address_number
 */
export const handleRegister = async ({
                                         email,
                                         dateOfBirth,
                                         firstName,
                                         lastName,
                                         username,
                                         password,
                                         phone_number,
                                         address_city,
                                         address_street,
                                         address_number
                                     }: registerArguments) => {
    try {
        await axios.post(`${API_URL}/register/`, {
            email: email,
            date_of_birth: dateOfBirth,
            first_name: firstName,
            last_name: lastName,
            username: username,
            password: password,
            phone_number: phone_number,
            address_city: address_city,
            address_street: address_street,
            address_number: address_number,
        });
        window.location.href = "/login/";
    } catch (e) {
        console.log(e);
        throw e;
    }
}
