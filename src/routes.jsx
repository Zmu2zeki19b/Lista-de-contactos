import { createBrowserRouter } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Demo from "./pages/Demo";
import Single from "./pages/Single";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/add", element: <Demo /> },
      { path: "/edit/:id", element: <Single /> }
    ]
  }
]);
export default router;


