import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Protected from "./components/Protected";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Protected authentication>
          <Home />
        </Protected>
      ),
    },
    {
      path: "/login",
      element: (
        <Protected>
          <Login />
        </Protected>
      ),
    },
    {
      path: "/sign-up",
      element: (
        <Protected>
          <SignUp />
        </Protected>
      ),
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
