import {PetSitterDetails} from "../types.tsx";

function PetSitter({id, description_bio, experience_in_months, user_data, hourly_rate, daily_rate}: PetSitterDetails) {
    let img;
    return (
        <>
            <div className="rounded overflow-hidden shadow-lg flex-auto">
                <div className={`relative h-60`}>
                    <img
                        className={`w-full object-cover  h-full`}
                        src={img}
                        alt="ImgRestaurant"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h2 className="text-white text-3xl font-bold"></h2>
                    </div>
                    <div
                        className={` transition duration-300  absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25`}
                    ></div>
                    <a>
                        <div
                            className="text-sm absolute top-0 right-0 bg-black px-4 text-yellow-400 rounded-full h-16 w-16 flex flex-col items-center justify-center mt-3 mr-3 transition duration-500 ease-in-out">
                            <span className="font-bold">rate</span>
                        </div>
                    </a>
                </div>
                <div className={`px-6 py-4 h-40`}>
                    <p className="text-gray-500 text-sm line-clamp-5">{description_bio}</p>
                </div>
                <div className="px-6 py-4 flex flex-row items-center ">
        <span className="py-1 text-sm font-regular text-gray-900 mr-1 flex flex-row items-center">
          <span className="ml-1"></span>
        </span>
                </div>
            </div>
        </>
    )
}

export default PetSitter;