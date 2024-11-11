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
            element={isLoggedIn() ? <HomePage /> : <Navigate to={"/login"} />}
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
            path={"/profile/"}
            element={
              isLoggedIn() ? (
                <ProfilePage />
              ) : (
                <Navigate to={"/login"} />
              )
            }
          ></Route>
          <Route path={"/login/"} element={<LoginPage />}></Route>
          <Route path={"/register/"} element={<RegisterPage />}></Route>
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
