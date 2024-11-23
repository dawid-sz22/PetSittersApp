import axios from "axios";
import {
  CreatePetSitterData,
  PetOwnerData,
  PetSitterDetailsType,
  PetSpecies,
  registerArguments,
  UserData,
  Visit,
  CreateVisitRequest,
  Service,
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
    localStorage.setItem("userIDPetSitter", response.data.user_id);
    localStorage.setItem("isPetSitter", response.data.is_pet_sitter);
    localStorage.setItem("isPetOwner", response.data.is_pet_owner);
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
  localStorage.removeItem("userIDPetSitter");
  localStorage.removeItem("isPetSitter");
  localStorage.removeItem("isPetOwner");
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
  profile_picture_url?: string;
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

export const deleteUserAPI = async () => {
  try {
    setAuthToken();
    const response = await axios.delete(`${API_URL}/user/`);
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

export const getUserPetSitterAPI =
  async (): Promise<PetSitterDetailsType | null> => {
    try {
      setAuthToken();
      const response = await axios.get(`${API_URL}/user/pet_sitter/`);
      return response.data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

export const getUserPetOwnerAPI = async (): Promise<PetOwnerData | null> => {
  try {
    setAuthToken();
    const response = await axios.get(`${API_URL}/user/pet_owner/`);
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

export const deletePetSitterAPI = async () => {
  try {
    setAuthToken();
    const response = await axios.delete(`${API_URL}/pet_sitter/`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const handleAddPetAPI = async (data: {
  name: string;
  species: string;
  breed?: string;
  age: number;
  weight: number;
  info_special_treatment?: string;
  favorite_activities?: string;
  feeding_info?: string;
  photo_URL?: string;
}) => {
  try {
    setAuthToken();
    const response = await axios.post(`${API_URL}/pet/`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getAllPetSpeciesAPI = async (): Promise<PetSpecies[] | null> => {
  try {
    setAuthToken();
    const response = await axios.get(`${API_URL}/pet_species/`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getVisitsAPI = async (id: string): Promise<Visit[] | null> => {
  try {
    setAuthToken();
    const response = await axios.get(`${API_URL}/pet_sitter/${id}/visits/`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getPetOwnerAPI = async (
  id: string
): Promise<PetOwnerData | null> => {
  try {
    setAuthToken();
    const response = await axios.get(`${API_URL}/pet_owner/${id}/`, {});
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getSecretUploadUrlAPI = async () => {
  try {
    setAuthToken();
    const response = await axios.get(`${API_URL}/upload_url/`);
    return response.data.upload_url;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const uploadFileToS3API = async (uploadUrl: string, file: File) => {
  try {
    console.log(uploadUrl);
    const response = await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: null,
      },
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const createVisitAPI = async (data: CreateVisitRequest) => {
  try {
    setAuthToken();
    const response = await axios.post(`${API_URL}/visit/`, data);
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getAllServicesAPI = async (): Promise<Service[] | null> => {
  try {
    setAuthToken();
    const response = await axios.get(`${API_URL}/service/`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
