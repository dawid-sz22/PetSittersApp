export type registerArguments = {
    email: string,
    dateOfBirth: string,
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    phone_number: string,
    address_city: string,
    address_street: string,
    address_number: string
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
    profile_picture_url: string;
}

export interface PetSitterDetailsType {
    id: number;
    experience_in_months: number;
    daily_rate: number;
    hourly_rate: number;
    description_bio: string;
    user_data: UserData;
}
