import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import Aside from "./Components/Aside/Index";
import UnderConstructionPage from "./Views/ConstructionPage";
import RootLayout from "./Components/RootLayout";
import GlobalErrorBoundary from "./Components/GlobalErrorBoundary";

const LazyLogin = lazy(() => import("./Views/Login"));
const LazyAccount = lazy(() => import("./Views/Account"));
const LazyInventory = lazy(() => import("./Views/Transport"));
const LazyBuget = lazy(() => import("./Views/Budget"));
const LazyReports = lazy(() => import("./Views/Reports"));
const LazyBiling = lazy(() => import("./Views/Biling"));
const LazyProfile = lazy(() => import("./Views/Profile"));
// const LazyRegister = lazy(() => import("./Views/Register"));
const LazyAppointmentsMedical = lazy(() => import("./Views/Appointments"));
const LazyForgotten = lazy(() => import("./Views/Forgotten"));
const LazySellProducts = lazy(() => import("./Views/SellProducts"));
const LazyProductReplacement = lazy(() => import("./Views/ProductReplacement"));
const LazyConfigurations = lazy(() => import("./Views/Configurations"));
const LazySearchProducts = lazy(() => import("./Views/SearchProducts"));
const LazyClients = lazy(() => import("./Views/Clients"));
const LazyAudit = lazy(() => import("./Views/Audit"));
const LazyDoctors = lazy(() => import("./Views/Doctors"));
//update
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <GlobalErrorBoundary />,
    children: [
      {
        path: import.meta.env.VITE_BASE_URL,
        element: (
          <Suspense fallback={<div className="absolute top-32 left-32">Cargando...</div>}>
            <LazyLogin />
          </Suspense>
        ),
      },
      {
        path: `${import.meta.env.VITE_BASE_URL}SearchProducts`,
        element: (
          <Suspense fallback={<div className="absolute top-32 left-32">Cargando...</div>}>
            <LazySearchProducts />
          </Suspense>
        ),
      },
      // {
      //   path: `${import.meta.env.VITE_BASE_URL}Register`,
      //   element: (
      //     <Suspense
      //       fallback={<div className="absolute top-32 left-32">Cargando...</div>}
      //     >
      //       <LazyRegister />
      //     </Suspense>
      //   ),
      // },
      {
        path: `${import.meta.env.VITE_BASE_URL}Forgotten`,
        element: (
          <Suspense fallback={<div className="absolute top-32 left-32">Cargando...</div>}>
            <LazyForgotten />
          </Suspense>
        ),
      },

      {
        path: `${import.meta.env.VITE_BASE_URL}Home`,
        element: <Aside />,
        children: [
          {
            path: `${import.meta.env.VITE_BASE_URL}Home/Account`,
            element: (
              <Suspense fallback={<div>Cargando...</div>}>
                <LazyAccount />
              </Suspense>
            ),
          },
          {
            path: `${import.meta.env.VITE_BASE_URL}Home/Inventory`,
            element: (
              <Suspense fallback={<div>Cargando...</div>}>
                <LazyInventory />
              </Suspense>
            ),
          },
          {
            path: `${import.meta.env.VITE_BASE_URL}Home/AppointmentsMedical`,
            element: (
              <Suspense fallback={<div>Cargando...</div>}>
                <LazyAppointmentsMedical />
              </Suspense>
            ),
          },
          {
            path: `${import.meta.env.VITE_BASE_URL}Home/Budget`,
            element: (
              <Suspense fallback={<div>Cargando...</div>}>
                <LazyBuget />
              </Suspense>
            ),
          },
          {
            path: `${import.meta.env.VITE_BASE_URL}Home/Clients`,
            element: (
              <Suspense fallback={<div>Cargando...</div>}>
                <LazyClients />
              </Suspense>
            ),
          },
          {
            path: `${import.meta.env.VITE_BASE_URL}Home/Doctors`,
            element: (
              <Suspense fallback={<div>Cargando...</div>}>
                <LazyDoctors />
              </Suspense>
            ),
          },
          {
            path: `${import.meta.env.VITE_BASE_URL}Home/Audit`,
            element: (
              <Suspense fallback={<div className="absolute top-32 left-32">Cargando...</div>}>
                <LazyAudit />
              </Suspense>
            ),
          },
          {
            path: `${import.meta.env.VITE_BASE_URL}Home/Reporting`,
            element: (
              <Suspense fallback={<div>Cargando...</div>}>
                <LazyReports />
              </Suspense>
            ),
          },
          {
            path: `${import.meta.env.VITE_BASE_URL}Home/Biling`,
            element: (
              <Suspense fallback={<div>Cargando...</div>}>
                <LazyBiling />
              </Suspense>
            ),
          },
          {
            path: `${import.meta.env.VITE_BASE_URL}Home/SellProducts`,
            element: (
              <Suspense fallback={<div>Cargando...</div>}>
                <LazySellProducts />
              </Suspense>
            ),
          },
          {
            path: `${import.meta.env.VITE_BASE_URL}Home/ProductReplacement`,
            element: (
              <Suspense fallback={<div>Cargando...</div>}>
                <LazyProductReplacement />
              </Suspense>
            ),
          },
          {
            path: `${import.meta.env.VITE_BASE_URL}Home/Profile`,
            element: (
              <Suspense fallback={<div>Cargando...</div>}>
                <LazyProfile />
              </Suspense>
            ),
          },
          {
            path: `${import.meta.env.VITE_BASE_URL}Home/Configurations`,
            element: (
              <Suspense fallback={<div>Cargando...</div>}>
                <LazyConfigurations />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "*",
        element: <UnderConstructionPage />,
      },
    ],
  },
]);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
