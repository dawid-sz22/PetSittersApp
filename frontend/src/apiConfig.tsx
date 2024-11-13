import axios from "axios";
import {
  CreatePetSitterData,
  PetSitterDetailsType,
  registerArguments,
  UserData,
} from "./types.tsx";

const API_URL = "http://127.0.0.1:8000/api";

export const setAuthToken = (): void => {
  const token = localStorage.getItem("tokenPetSitter");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const handleLoginAPI = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, {
      email: email,
      password: password,
    });
    const token = response.data.token;
    localStorage.setItem("tokenPetSitter", token);
    localStorage.setItem("usernamePetSitter", response.data.username);
    window.location.href = "/";
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const isLoggedIn = () => {
  return !!localStorage.getItem("tokenPetSitter");
};
export const logout = () => {
  localStorage.removeItem("tokenPetSitter");
  localStorage.removeItem("usernamePetSitter");
  window.location.href = "/";
};

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
export const handleRegisterAPI = async ({
  email,
  dateOfBirth,
  firstName,
  lastName,
  username,
  password,
  phone_number,
  address_city,
  address_street,
  address_number,
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
    // window.location.href = "/login/";
  } catch (e) {
    // Check all possible errors
    if (axios.isAxiosError(e) && e.response && e.response.data.errors) {
      const errorMessage = e.response.data.errors;
      errorMessage.forEach((error: string) => {
        error = error.toLowerCase();
        if (error.includes("email"))
          throw new Error(`Podany email jest już zajęty!`);
        if (error.includes("username"))
          throw new Error(`Podana nazwa użytkownika jest już zajęta!`);
        if (error.includes("phone number") || error.includes("phone_number"))
          throw new Error(`Podany numer telefonu już jest zajęty!`);
      });
    }
    console.log(e);
    throw e;
  }
};

export const handleRequestPasswordResetAPI = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/reset_password/`, {
      email: email,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const handlePasswordResetAPI = async (
  password: string,
  repeatPassword: string,
  token: string
) => {
  try {
    const response = await axios.post(
      `${API_URL}/reset_password/change/`,
      {
        password: password,
        confirm_password: repeatPassword,
      },
      {
        params: { token: token },
      }
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const handleUpdateUserAPI = async (data: {
  password?: string;
  email?: string;
  username?: string;
  phone_number?: string;
  address_city?: string;
  address_street?: string;
  address_house?: string;
}) => {
  try {
    setAuthToken();
    const response = await axios.patch(`${API_URL}/user/`, data);
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getUserDataAPI = async (): Promise<UserData | null> => {
  try {
    setAuthToken();
    const response = await axios.get(`${API_URL}/user/`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const updateUserDataAPI = async (
  data: UserData
): Promise<UserData | null> => {
  try {
    setAuthToken();
    const response = await axios.patch(`${API_URL}/user/`, data);
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getAllPetSittersAPI = async (): Promise<
  PetSitterDetailsType[] | null
> => {
  try {
    setAuthToken();
    const response = await axios.get(`${API_URL}/pet_sitter/`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getPetSitterDetailsAPI = async (
  id: string
): Promise<PetSitterDetailsType | null> => {
  try {
    setAuthToken();
    const response = await axios.get(`${API_URL}/pet_sitter/${id}/`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const createPetSitterAPI = async (data: CreatePetSitterData) => {
  try {
    setAuthToken();
    const response = await axios.post(`${API_URL}/pet_sitter/`, data);
    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e) && e.response && e.response.data.error) {
      let errorMessage = e.response.data.error;
      errorMessage = errorMessage.toLowerCase();
      if (errorMessage.includes("already exists")) {
        throw new Error(`Profil opiekuna już istnieje!`);
      }
    }
    console.log(e);
    throw e;
  }
};
