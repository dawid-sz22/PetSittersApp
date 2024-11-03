import {PetSitterDetailsType} from "../types.tsx";
import Pin from "../assets/Pin.tsx";
import {PawIcon} from "../assets/PawIcon.tsx";

function PetSitterDetails() {
    return (
        <>
            <div className="rounded-2xl shadow-lg border p-6 bg-blue-100 max-w-sm mx-auto ">
                <div
                    className="flex flex-col justify-center items-center w-48 h-48 bg-white rounded-full overflow-hidden shadow-lg mx-auto border-2 border-black">
                    <img
                        src={"https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8fDA%3D"}
                        className="w-full h-full object-cover"
                        alt={`Marcin Nowak's profile`}
                    />
                </div>
                <div className="grid grid-cols-2 text-center justify-center items-center mb-4 mx-auto">
                    <div className="">
                        <h2 className="text-2xl font-bold">Dawid Nowak</h2>
                        <p className="text-gray-600">@username123</p>
                    </div>
                    <div
                        className="flex flex-row text-sm top-0 right-0 mx-4 space-x-4 text-black items-center justify-center border rounded-full bg-black w-28 h-12">
                        <span className="text-yellow-400 font-bold text-lg">2/5</span>
                        <div className="text-yellow-400 text-sm mx-3.5">
                            <PawIcon height={"24"} width={"24"}/>
                        </div>
                    </div>
                </div>

                <p className="line-clamp-4 text-black mb-4 border-2 border-black bg-white rounded-lg px-2 py-1 text-center">"Lorem
                    ipsum dolor sit amet, consectetur
                    adipiscing
                    elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud
                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                    laborum."</p>
                <div
                    className="grid grid-rows-3 justify-center items-center text-gray-800 bg-white py-0.5 px-2 mb-2 mx-auto divide-y border-2 border-black rounded-lg">
                    <span
                        className="grid grid-cols-2 justify-center items-center text-center"><strong>Doświadczenie:</strong> 12 miesięcy</span>
                    <span
                        className="grid grid-cols-2 justify-center items-center text-center"><strong>Stawka godzinowa:</strong> 3 zł/h</span>
                    <span
                        className="grid grid-cols-2 justify-center items-center text-center"><strong>Stawka dzienna:</strong> 3 zł/h</span>
                </div>
                <div
                    className="grid grid-cols-2 bg-white text-gray-600 divide-x-2 divide-black border-2 border-black py-1">
                    <div className="text-center text-">
                        <p><strong>email@gmail.com</strong></p>
                    </div>
                    <div className="text-center text-">
                        <p><strong> +48 512123123</strong></p>
                    </div>
                </div>
                <div className="flex justify-center rounded-lg text-center bg-white border-2 border-black pb-1 py-1">
                    <div className="text-red-500"><Pin link={"#"}/></div>
                    <p><strong> Warszawa, Gnieźniańska</strong></p>
                </div>
            </div>
        </>
    );
}

export default PetSitterDetails;
