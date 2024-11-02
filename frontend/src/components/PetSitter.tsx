import {PetSitterDetails} from "../types.tsx";

function PetSitter({id, description_bio, experience_in_months, user_data, hourly_rate, daily_rate}: PetSitterDetails) {
    return (
        <div className="rounded-lg shadow-md p-6 bg-white max-w-md mx-auto">
            <div className="flex items-center mb-4">
                <img
                    className="w-16 h-16 rounded-full mr-4"
                    src={user_data.profile_picture_url}
                    alt={`${user_data.username}'s profile`}
                />
                <div>
                    <h2 className="text-xl font-bold">{user_data.first_name} {user_data.last_name}</h2>
                    <p className="text-gray-600">@{user_data.username}</p>
                </div>
            </div>
            <p className="text-gray-700 mb-4">{description_bio}</p>
            <div className="flex justify-between text-gray-800 mb-4">
                <span>Experience: {experience_in_months} months</span>
                <span>Hourly Rate: ${hourly_rate}</span>
                <span>Daily Rate: ${daily_rate}</span>
            </div>
            <div className="text-gray-600">
                <p>Email: {user_data.email}</p>
                <p>Phone: {user_data.phone_number}</p>
                <p>Location: {user_data.address_city}, {user_data.address_street}</p>
            </div>
        </div>
    );
}

export default PetSitter;
