import PetSitterDetails from "../components/PetSitterDetails.tsx";
import {name} from "axios";
import Navbar from "../components/Navbar.tsx";
import {PetSitterComponent} from "../components/PetSitterComponent.tsx";
import {useEffect, useState} from "react";
import {PetSitterDetailsType} from "../types.tsx";
import {getAllPetSittersAPI} from "../apiConfig.tsx";

function PetSittersDetailsPage() {
    const [petSitter, setPetSitters] = useState<PetSitterDetailsType[] | null>();

    useEffect(() => {
        const fetchPetSitters = async () => {
            try {
                await getAllPetSittersAPI().then((result) => {
                    setPetSitters(result)
                });
            } catch (e) {
                console.log(e);
                return;
            }
        }
        fetchPetSitters();
    }, [])

    return (
        <>
            <Navbar/>
                <div className="flex justify-center items-center py-10">
                    <input type="search" id="search-dropdown"
                           className="block p-3 text-l text-black bg-gray-50 rounded-lg border-xl border-black border-s-2 border w-72"
                           placeholder="Szukaj" required/>
                    <button type="submit"
                            className="top-0 end-0 p-3.5 mx-1 text-sm font-medium h-full text-white bg-blue-700 rounded-lg border border-blue-700 ">
                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                             viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                  stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                        <span className="sr-only">Search</span>
                    </button>
                </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <PetSitterComponent/>
                <PetSitterComponent/>
                <PetSitterComponent/>
                <PetSitterComponent/>
                <PetSitterComponent/>
                <PetSitterComponent/>
                <PetSitterComponent/>
                <PetSitterComponent/>
            </div>

        </>
    )
}

export {PetSittersDetailsPage};