import Navbar from "../components/Navbar.tsx";
import { PetSitterComponent } from "../components/PetSitterComponent.tsx";
import { useEffect, useState } from "react";
import { PetSitterDetailsType } from "../types.tsx";
import { getAllPetSittersAPI } from "../apiConfig.tsx";
import ErrorFetching from "../components/ErrorFetching.tsx";
import CircularProgress from "@mui/material/CircularProgress";

function PetSittersListPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [petSitter, setPetSitters] = useState<PetSitterDetailsType[] | null>();
  const [filteredResults, setFilteredResults] = useState<
    PetSitterDetailsType[] | null
  >();
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  let currentItems = filteredResults?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = filteredResults
    ? Math.ceil(filteredResults.length / itemsPerPage)
    : 0;

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  function handleSearch(searchValue: string) {
    if (!searchValue || searchValue === "") {
      setFilteredResults(petSitter);
      return;
    } else if (!petSitter) {
      setFilteredResults([]);
      return;
    }

    const searchTerms = searchValue
      .toLowerCase()
      .split(" ")
      .filter((term) => term);

    setFilteredResults(
      petSitter.filter((sitter) => {
        const searchableFields = [
          sitter.user_data.first_name,
          sitter.user_data.last_name,
          sitter.user_data.username,
          sitter.user_data.address_city,
        ].map((field) => field.toLowerCase());

        return searchTerms.every((term) =>
          searchableFields.some((field) => field.includes(term))
        );
      })
    );
  }

  useEffect(() => {
    const fetchPetSitters = async () => {
      try {
        setIsLoading(true);
        const result = await getAllPetSittersAPI();
        setPetSitters(result);
        setError(null);
      } catch (e) {
        console.error(e);
        setError("Nie udało się pobrać danych :(");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPetSitters();
  }, []);

  useEffect(() => {
    currentItems = filteredResults?.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredResults]);

  useEffect(() => {
    handleSearch("");
  }, [petSitter]);

  if (error) {
    return <ErrorFetching error={error} />;
  }

  return (
    <>
      <Navbar />
      {isLoading ? (
        <div className="flex justify-center items-center mt-20">
          <CircularProgress size={60} />
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-b from-sky-100 to-sky-300 min-h-screen">
            <div className="flex justify-center items-center py-10">
              <input
                type="search"
                id="search-dropdown"
                className="block p-3 text-l text-black bg-gray-50 rounded-lg border-xl border-black border-s-2 border w-72"
                placeholder="Szukaj"
                onChange={(e) => handleSearch(e.target.value)}
                required
              />
              <button
                type="submit"
                className="top-0 end-0 p-3.5 mx-1 text-sm font-medium h-full text-white bg-blue-700 rounded-lg border border-blue-700 "
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
                <span className="sr-only">Search</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentItems?.map((sitter) => (
                <>
                  <PetSitterComponent key={sitter.id} {...sitter} />
                </>
              ))}
            </div>

            <div className="flex justify-center gap-2 py-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-700 text-white rounded-lg disabled:bg-gray-400"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-700 text-white rounded-lg disabled:bg-gray-400"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export { PetSittersListPage };
