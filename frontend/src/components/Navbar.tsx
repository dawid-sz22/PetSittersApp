import { Link } from "react-router-dom";
import { PawIcon } from "../assets/PawIcon.tsx";
import { CgProfile } from "react-icons/cg";
import { isLoggedIn } from "../apiConfig.tsx";
import {
  Menu,
  MenuItem,
  MenuItems,
  MenuButton,
  Transition,
} from "@headlessui/react";
import { Fragment } from "react";
import { MenuList } from "@mui/material";

function Navbar() {
  return (
    <nav className="flex justify-between bg-black items-center p-4 z-50 h-20">
      <div className="flex items-center space-x-3 text-white rounded-lg px-3 py-1 text-3xl font-bold">
        <PawIcon width="32" height="32" />
        <Link to={"/"}>Pet Sitters</Link>
      </div>
      <ul className="flex space-x-4 items-center">
        <li>
          {!isLoggedIn() ? (
            <Link
              to={"/login"}
              className="text-white text-lg hover:underline rounded-lg px-3 py-1 font-bold"
            >
              Login
            </Link>
          ) : null}
        </li>
        <li>
          <Link
            to={"/pet-sitters"}
            className="text-white text-lg hover:underline rounded-lg px-3 py-1 font-bold"
          >
            Pet Sitters
          </Link>
        </li>
        <li>
          <Link
            to={"/"}
            className="text-white text-lg hover:underline rounded-lg px-3 py-1 font-bold"
          >
            Pet Owners
          </Link>
        </li>
        {isLoggedIn() ? (
          <li className="relative">
            <Menu as="div" className="relative z-10">
              <MenuButton className="text-white hover:underline py-1">
                {localStorage.getItem("usernamePetSitter") ? (
                  <div className="flex items-center">
                    <div className="mr-2 font-bold text-lg">
                      @{localStorage.getItem("usernamePetSitter")}
                    </div>
                    <CgProfile className="text-white text-5xl" />
                  </div>
                ) : (
                  <CgProfile className="text-white text-5xl" />
                )}
              </MenuButton>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <MenuItem>
                    <Link
                      to="/profile"
                      className="block w-full px-4 py-2 text-m font-bold text-left text-gray-700 hover:bg-gray-100"
                    >
                      Moje konto
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <button
                      onClick={() => {
                        localStorage.clear();
                        window.location.href = "/";
                      }}
                      className="block w-full px-4 py-2 text-m font-bold text-left text-gray-700 hover:bg-gray-100"
                    >
                      Wyloguj
                    </button>
                  </MenuItem>
                </MenuItems>
              </Transition>
            </Menu>
          </li>
        ) : null}
      </ul>
    </nav>
  );
}

export default Navbar;
