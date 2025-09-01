import Authentication from "../pages/Authentication";
import ChangePassword from "../pages/ChangePassword";
import DeleteAccount from "../pages/DeleteAccount";
import Licensing from "../pages/Licensing";
import MyProfile from "../pages/MyProfile";
import PaymentHistory from "../pages/PaymentHistory";
import PaymentInformation from "../pages/PaymentInformation";
import { SETTINGS_PATHS } from "./paths";

export const settingsRoutes = [
  {
    index: true,
    element: <MyProfile />,
  },
  {
    path: SETTINGS_PATHS.myProfile,
    element: <MyProfile />,
  },
  {
    path: SETTINGS_PATHS.deleteAccount,
    element: <DeleteAccount />,
  },
  {
    path: SETTINGS_PATHS.authentication,
    element: <Authentication />,
  },
  {
    path: SETTINGS_PATHS.changePassword,
    element: <ChangePassword />,
  },
  {
    path: SETTINGS_PATHS.licensing,
    element: <Licensing />,
  },
  {
    path: SETTINGS_PATHS.paymentInformation,
    element: <PaymentInformation />,
  },
  {
    path: SETTINGS_PATHS.paymentHistory,
    element: <PaymentHistory />,
  },
];
