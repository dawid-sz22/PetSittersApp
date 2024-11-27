import { PawIcon } from "../assets/PawIcon.tsx";
import Pin from "../assets/Pin.tsx";
import { Link } from "react-router-dom";
import { PetSitterDetailsType } from "../types.tsx";

function PetSitterComponent({
  id,
  user_data,
}: PetSitterDetailsType) {
  return (
    <>
      <div className="rounded-3xl shadow-lg p-3 bg-sky-100 border-2 border-black max-w-xl mx-auto">
        <div className="flex justify-center items-center w-48 h-48 bg-white rounded-full overflow-hidden shadow-lg mx-auto border-2 border-black">
          {user_data.profile_picture_url ? (
            <img
              src={user_data.profile_picture_url}
              className="w-full h-full object-cover"
              alt={`${user_data.first_name} ${user_data.last_name}'s profile`}
            />
          ) : (
            <img
              src={"./images.png"}
              className="w-1/2 h-1/2 object-cover"
              alt={`${user_data.first_name} ${user_data.last_name}'s profile`}
            />
          )}
        </div>
        <div className="grid grid-cols-2 text-center justify-center items-center mb-4 mx-auto">
          <div className="mx-auto">
            <h2 className="text-2xl font-bold break-words">
              {user_data.first_name} <br /> {user_data.last_name}
            </h2>
            <p className="text-gray-600">@{user_data.username}</p>
          </div>
          <div className="flex flex-row text-sm top-0 right-0 mx-7 space-x-4 text-black items-center justify-center border rounded-full bg-black w-28 h-12">
            <span className="text-yellow-400 font-bold text-lg">2/5</span>
            <div className="text-yellow-400 text-sm mx-3.5">
              <PawIcon height={"24"} width={"24"} />
            </div>
          </div>
        </div>
        <div className="flex justify-center rounded-lg text-center bg-white border-2 border-black pb-1 py-1">
          <div className="text-red-500">
            <Pin link={"#"} />
          </div>
          <p>
            <strong>
              {user_data.address_city}, {user_data.address_street}
            </strong>
          </p>
        </div>
        <Link to={`/pet-sitter/${id}`}>
          <button className="flex justify-center items-center mx-auto rounded-lg text-center bg-white border-2 border-black px-3 pb-1 py-1 my-3 font-bold hover:bg-black hover:text-white">
            Pokaż profil
          </button>
        </Link>
      </div>
    </>
  );
}

export { PetSitterComponent };
