import Navbar from "../components/Navbar";
import dogCrying from "../assets/dog-crying.gif";
function NotFoundPage() {
  return (
    <>
      <Navbar />
      <p className="text-center text-5xl font-bold mt-20 mb-20">
        Podana strona nie istnieje :(
      </p>
      <img src={dogCrying} alt="Page not found" className="w-1/4 mx-auto" />
    </>
  );
}

export { NotFoundPage };
