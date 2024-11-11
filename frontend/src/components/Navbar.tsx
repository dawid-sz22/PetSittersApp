import { Link } from "react-router-dom";
import { PawIcon } from "../assets/PawIcon.tsx";
import { CgProfile } from "react-icons/cg";

function Navbar() {
  return (
    <nav className="flex justify-between bg-black items-center p-4">
      <div className="flex items-center space-x-3 text-white rounded-lg px-3 py-1 text-3xl">
        <PawIcon width="32" height="32" />
        <Link to={"/register"}>Pet Sitters</Link>
      </div>
      <ul className="flex space-x-4 items-center">
        <li>
          <Link
            to={"/login"}
            className="text-white text-lg hover:underline rounded-lg px-3 py-1"
          >
            Login
          </Link>
        </li>
        <li>
          <Link
            to={"/pet-sitters"}
            className="text-white hover:underline rounded-lg px-3 py-1"
          >
            Pet Sitters
          </Link>
        </li>
        <li>
          <Link
            to={"/"}
            className="text-white hover:underline rounded-lg px-3 py-1"
          >
            Pet Owners
          </Link>
        </li>
        <li>
          <Link to={"/profile"} className="text-white hover:underline py-1">
            <CgProfile className="text-white text-5xl" />
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
