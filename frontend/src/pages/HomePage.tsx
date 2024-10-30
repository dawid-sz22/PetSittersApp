import {useEffect, useState} from "react";
import {getAllPetSittersAPI} from "../apiConfig.tsx";
import {PetSitterDetails} from "../types.tsx";
import PetSitter from "../components/PetSitter.tsx";

function HomePage() {
    const [petSitter, setPetSitters] = useState<PetSitterDetails[] | null>();

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {petSitter ? (
                petSitter.map((item) => (
                    <PetSitter
                        daily_rate={item.daily_rate} description_bio={item.description_bio}
                        experience_in_months={item.experience_in_months} hourly_rate={item.hourly_rate} id={item.id}
                        user_data={item.user_data}/>

                ))) : (<p>ERROR</p>)
            };
            </div>
        </>
    )
}

export default HomePage;