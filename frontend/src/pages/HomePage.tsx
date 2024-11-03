import {useEffect, useState} from "react";
import {getAllPetSittersAPI} from "../apiConfig.tsx";
import {PetSitterDetailsType} from "../types.tsx";
import PetSitterDetails from "../components/PetSitterDetails.tsx";
import Navbar from "../components/Navbar.tsx";
import {PetSitterComponent} from "../components/PetSitterComponent.tsx";
import {PetSittersDetailsPage} from "./PetSittersDetailsPage.tsx";

function HomePage() {
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
            <PetSittersDetailsPage/>

        </>
    )
}

export default HomePage;