import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import ResetPasswordRequest from "./pages/ResetPasswordRequest.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import { PetSitterComponent } from "./components/PetSitterComponent.tsx";
import { PetSittersListPage } from "./pages/PetSittersListPage.tsx";
import { NotFoundPage } from "./pages/NotFoundPage.tsx";
import { ProfilePage } from "./pages/ProfilePage.tsx";
import CreatePetSitterPage from "./pages/CreatePetSitterPage.tsx";
import PetSitterDetails from "./components/PetSitterDetails.tsx";
import { PetSitterProfilePage } from "./pages/PetSitterProfilePage.tsx";
import { PetOwnerProfilePage } from "./pages/PetOwnerProfilePage.tsx";

function RoutesComponent() {
  const isLoggedIn = () => {
    return !!localStorage.getItem("tokenPetSitter");
  };

  return (
    <>
      <Router>
        <Routes>
          <Route
            path={"/"}
            element={<HomePage />}
          />
          <Route
            path={"/pet-sitters/"}
            element={
              isLoggedIn() ? (
                <PetSittersListPage />
              ) : (
                <Navigate to={"/login"} />
              )
            }
          ></Route>
          <Route
            path={"/pet-sitter/:id"}
            element={
              isLoggedIn() ? (
                <PetSitterDetails />
              ) : (
                <Navigate to={"/login"} />
              )
            }
          ></Route>
          <Route
            path={"/profile/"}
            element={
              isLoggedIn() ? (
                <ProfilePage />
              ) : (
                <Navigate to={"/login"} />
              )
            }
          ></Route>
          <Route path="/pet-sitter-profile" element={<PetSitterProfilePage />} />
          <Route path="/pet-owner-profile" element={<PetOwnerProfilePage />} />
          <Route path={"/login/"} element={<LoginPage />}></Route>
          <Route path={"/register/"} element={<RegisterPage />}></Route>
          <Route path={"/create-pet-sitter/"} element={<CreatePetSitterPage />}></Route>
          <Route
            path={"/reset-password/"}
            element={<ResetPasswordRequest />}
          ></Route>
          <Route
            path={"/reset-password/change/"}
            element={<ResetPassword />}
          ></Route>
          <Route path={"*"} element={<NotFoundPage />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default RoutesComponent;
