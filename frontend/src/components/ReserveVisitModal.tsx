import { useState, useEffect } from "react";
import { getUserPetOwnerAPI, createVisitAPI } from "../apiConfig";
import { DateTimeRange, Pet, BaseModalProps, Service } from "../types";
import { CircularProgress, Dialog } from "@mui/material";
import { DateTimePicker } from "@mantine/dates";
import "@mantine/dates/styles.css";
import "dayjs/locale/pl";
import { toast, ToastContainer } from "react-toastify";

interface ReserveVisitModalProps extends BaseModalProps {
  petSitterId: number;
  allServices: Service[];
  priceHour: number;
  priceDay: number;
}

const calculateTotalHours = (start: string, end: string): number => {
  if (!start || !end) return 0;
  const diffInMs = new Date(end).getTime() - new Date(start).getTime();
  return Math.ceil(diffInMs / (1000 * 60 * 60)); // Convert to hours and round up
};

const calculateTotalDays = (start: string, end: string): number => {
  if (!start || !end) return 0;
  const diffInMs = new Date(end).getTime() - new Date(start).getTime();
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24)); // Convert to days and round up
};

function ReserveVisitModal({
  isOpen,
  onClose,
  petSitterId,
  allServices,
  priceHour,
  priceDay,
}: ReserveVisitModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [dateRange, setDateRange] = useState<DateTimeRange>({
    lower: "",
    upper: "",
  });
  const [visitNotes, setVisitNotes] = useState<string>("");

  useEffect(() => {
    async function fetchPets() {
      try {
        if (localStorage.getItem("isPetOwner")) {
          const petOwnerData = await getUserPetOwnerAPI();
          if (petOwnerData?.pets) {
            setPets(petOwnerData.pets);
          }
        }
      } catch (error) {
        setError("Nie udało się pobrać listy zwierząt");
      } finally {
        setIsLoading(false);
      }
    }
    fetchPets();
  }, []);

  useEffect(() => {
    setDateRange({ lower: "", upper: "" });
  }, [selectedService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet || !selectedService || !canSubmit) return;

    try {
      await createVisitAPI({
        pet_sitter: petSitterId,
        pet: selectedPet,
        date_range_of_visit: dateRange,
        price: totalCost,
        services: [selectedService.id],
        visit_notes: visitNotes,
      });
      toast.success("Wizyta została zarezerwowana", {
        position: "top-center",
        autoClose: 3000,
        style: {
          fontSize: "1.2rem",
          fontWeight: "bold",
          width: "100%",
        },
      });
      onClose();
    } catch (error) {
      toast.error("Nie udało się zarezerwować wizyty", {
        position: "top-center",
        autoClose: 3000,
        style: {
          fontSize: "1.2rem",
          fontWeight: "bold",
          width: "100%",
        },
      });
    }
  };

  const totalHours = calculateTotalHours(dateRange.lower, dateRange.upper);
  const totalDays = calculateTotalDays(dateRange.lower, dateRange.upper);
  const totalCost =
    selectedService?.type === "hourly"
      ? totalHours * priceHour
      : totalDays * priceDay;
    
  const canSubmit = dateRange.lower !== "" && dateRange.upper !== "";

  return (
    <>
      <ToastContainer />
      <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
        <div className="p-6 ">
          <h2 className="text-2xl font-bold mb-4">Zarezerwuj wizytę</h2>

          {isLoading ? (
            <div className="flex justify-center">
              <CircularProgress />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wybierz zwierzę:
                </label>
                {error && <p className="text-red-500">{error}</p>}
                <select
                  className="w-full p-2 border rounded"
                  value={selectedPet || ""}
                  onChange={(e) => setSelectedPet(parseInt(e.target.value))}
                  required
                >
                  <option value="">Wybierz zwierzę</option>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name} ({pet.species_data.name})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wybierz usługę:
                </label>
                <select
                  className="w-full p-2 border rounded"
                  onChange={(e) =>
                    setSelectedService(
                      allServices.find(
                        (service) => service.id === parseInt(e.target.value)
                      ) || null
                    )
                  }
                >
                  <option value="">Wybierz usługę</option>
                  {allServices.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedService && (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data rozpoczęcia:
                      </label>
                      <DateTimePicker
                        valueFormat="DD/MM/YYYY HH:mm"
                        className="w-full"
                        placeholder="Wybierz datę i godzinę"
                        value={
                          dateRange.lower ? new Date(dateRange.lower) : null
                        }
                        onChange={(date) =>
                          setDateRange({
                            ...dateRange,
                            lower: date ? date.toISOString() : "",
                          })
                        }
                        minDate={new Date()}
                        required
                        popoverProps={{
                          withinPortal: true,
                          zIndex: 10000,
                          styles: { dropdown: { zIndex: 10000 } },
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data zakończenia:
                      </label>
                      <DateTimePicker
                        valueFormat="DD/MM/YYYY HH:mm"
                        className="w-full"
                        placeholder="Wybierz datę i godzinę"
                        value={
                          dateRange.upper ? new Date(dateRange.upper) : null
                        }
                        onChange={(date) =>
                          setDateRange({
                            ...dateRange,
                            upper: date ? date.toISOString() : "",
                          })
                        }
                        required
                        minDate={
                          selectedService?.type === "hourly"
                            ? new Date(
                                new Date(dateRange.lower).setMinutes(
                                  new Date(dateRange.lower).getMinutes() + 30
                                )
                              )
                            : new Date(
                                new Date(dateRange.lower).setHours(
                                  24 -
                                    new Date(dateRange.lower).getHours() +
                                    new Date(dateRange.lower).getHours()
                                )
                              )
                        }
                        popoverProps={{
                          withinPortal: true,
                          zIndex: 10000,
                          styles: { dropdown: { zIndex: 10000 } },
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dodatkowe informacje o wizycie:
                    </label>
                    <textarea
                      value={visitNotes} 
                      onChange={(e) => setVisitNotes(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div className="mb-6 mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">
                      Podsumowanie kosztów
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Czas opieki:</span>
                        <span>
                          {selectedService?.type === "hourly"
                            ? totalHours
                            : totalDays}{" "}
                          {selectedService?.type === "hourly" ? "godz." : "dni"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>
                          Stawka{" "}
                          {selectedService?.type === "hourly"
                            ? "godzinowa"
                            : "dzienna"}
                          :
                        </span>
                        <span>
                          {selectedService?.type === "hourly"
                            ? priceHour
                            : priceDay}{" "}
                          zł
                        </span>
                      </div>
                      <div className="flex justify-between font-bold border-t pt-2 mt-2">
                        <span>Całkowity koszt:</span>
                        <span>{totalCost} zł</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="bg-blue-700 text-white rounded-lg px-4 py-2 hover:bg-blue-800 disabled:bg-gray-400"
                >
                  Zarezerwuj
                </button>
              </div>
            </form>
          )}
        </div>
      </Dialog>
    </>
  );
}

export default ReserveVisitModal;
