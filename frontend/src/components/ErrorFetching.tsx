import Navbar from "./Navbar";

export default function ErrorFetching({ error }: { error: string }) {
  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-10 px-4">
        <div className="flex flex-col items-center bg-red-50 border-2 border-red-500 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-red-700 mb-4">{error}</h2>
          <img
            src="/crying_cat.png"
            alt="error"
            className="mx-auto w-32 h-32"
          />
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white rounded-lg px-6 py-2 hover:bg-red-700"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    </>
  );
}
