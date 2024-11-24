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

export interface PetOwner {
  id: number;
  description_bio: string;
  user_data: UserData;
}

export interface PetData {
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
  pet_owner_data: PetOwner;
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
  is_pet_sitter: boolean;
  is_pet_owner: boolean;
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
  visits: Visit[] | null;
  rating: number | null;
}

export interface PetSitterDetailsTypeEdit {
  photo_URL: string;
  experience_in_months: number;
  daily_rate: number;
  hourly_rate: number;
  description_bio: string;
}

export interface CreatePetSitterData {
  photo_URL: string;
  experience_in_months: number;
  daily_rate: number;
  hourly_rate: number;
  description_bio: string;
}

export type Service = {
  id: number;
  name: string;
  type: string;
};

export type DateTimeRange = {
  lower: string;
  upper: string;
};

export type BaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export type Visit = {
  id: number;
  pet_sitter_data: PetSitterDetailsType;
  pet_data: PetData;
  date_range_of_visit: DateTimeRange;
  services_data: Service[];
  is_accepted: boolean;
  is_over: boolean;
  visit_notes: string | null;
  rating: number | null;
  review: string | null;
  price: number | null;
};

export type PetOwnerData = {
  id: number;
  description_bio: string;
  visits: Visit[] | null;
  pets: Pet[] | null;
};

export type CreateVisitRequest = {
  pet_sitter: number;
  pet: number;
  date_range_of_visit: DateTimeRange;
  price: number;
  services: number[]; // array of service IDs
};
