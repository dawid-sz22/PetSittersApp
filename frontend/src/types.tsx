export type registerArguments = {
  email: string;
  dateOfBirth: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  phone_number: string;
  address_city: string;
  address_street: string;
  address_number: string;
};

export type PetSpecies = {
  id: number;
  name: string;
};

export interface Pet {
  id: number;
  breed: string;
  name: string;
  age: number;
  weight: number;
  info_special_treatment: string;
  favorite_activities: string;
  feeding_info: string;
  photo_URL: string;
  species_data: PetSpecies; 
}

export interface UserData {
  email: string;
  username: string;
  date_of_birth: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address_city: string;
  address_street: string;
  address_house: string | null;
  profile_picture_url: string;
  pets: Pet[] | null;
  is_pet_sitter: boolean;
  pet_sitter_details: PetSitterDetailsType | null;
}

export interface UserDataSimple {
  email: string;
  username: string;
  date_of_birth: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address_city: string;
  address_street: string;
  address_house: string | null;
  profile_picture_url: string;
}

export interface PetSitterDetailsType {
  id: number;
  photo_URL: string;
  experience_in_months: number;
  daily_rate: number;
  hourly_rate: number;
  description_bio: string;
  user_data: UserDataSimple;
}

export interface CreatePetSitterData {
  photo_URL: string;
  experience_in_months: number;
  daily_rate: number;
  hourly_rate: number;
  description_bio: string;
}

export type BaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
};
