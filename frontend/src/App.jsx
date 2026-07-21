import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import RegisterUser from "./pages/RegisterUser";
import Profile from "./pages/Profile";
import CollectionPage from "./pages/Collections";
import ProductDetail from "./components/Products/ProductDetail";
import CheckOut from "./components/Cart/CheckOut";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import MyOrderPage from "./pages/MyOrderPage";
import AdminLayOut from "./components/Admin/AdminLayOut";
import AdminHomePage from "./components/Admin/AdminHomePage";
import UserManagement from "./components/Admin/UserManagement";
import ProductManagement from "./components/Admin/ProductManagement";
import EditProducts from "./components/Admin/EditProducts";
import OrderManagement from "./components/Admin/OrderManagement";
import { Toaster } from "sonner";
import OrderDetail from "./pages/OrderDetail";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import AddProduct from "./components/Admin/AddProduct";

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<LogIn />} />
          <Route path="register" element={<RegisterUser />} />
          <Route path="profile" element={<Profile />} />
          <Route path="collections/:collection" element={<CollectionPage />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="checkout" element={<CheckOut />} />
          <Route
            path="order-confirmation"
            element={<OrderConfirmationPage />}
          />
          <Route path="order/:id" element={<OrderDetailsPage />} />
          <Route path="my-order" element={<OrderDetail />} />
        </Route>
        <Route
          path="/admin"
          element={
            <ProtectedRoute role={"admin"}>
              <AdminLayOut />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminHomePage />} />
          <Route path="user" element={<UserManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="products/:id/edit" element={<EditProducts />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="product/new" element={<AddProduct />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
