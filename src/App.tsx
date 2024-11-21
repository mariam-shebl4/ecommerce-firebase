import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { loginSuccess, User } from './stores/authSlice';
import { getAuth, getIdToken, onAuthStateChanged } from 'firebase/auth';
import { app } from './firebase/firebase';
import { RootState } from './stores/store';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Loading from './components/Loading';
import { ThemeProvider } from '@mui/material';
import theme from './theme';

const auth = getAuth(app);

// pages
const Home = lazy(() => import('./pages/Home'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const ShoppingCart = lazy(() => import('./pages/ShoppingCart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/auth/Login'));
const SignUp = lazy(() => import('./pages/auth/Signup'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const AddProductForm = lazy(() => import('./pages/AddProductForm'));
// components
const Navbar = lazy(() => import('./components/Navbar'));

function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const location = useLocation()
  useEffect(() => {
    const accessToken = Cookies.get('access_token');

    if (accessToken) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // Fetch the Firebase token and user details
          getIdToken(user).then((token) => {
            if (token === accessToken) {
              const userData: User = {
                id: user.uid,
                name: user.displayName || 'Unnamed User',
                email: user.email || 'No email',
                accessToken,
              };
              dispatch(loginSuccess(userData));
            }
          });
        }
      });
    }

  }, [dispatch]);

  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISH_KEY);
  console.log(!location.pathname.includes('/auth'), 'nav');

  return (
    <>
    <ThemeProvider theme={theme}>
      <Elements stripe={stripePromise}>
        <>
          {/* Navbar */}
          {!location.pathname.includes('/auth') &&
            <>
              <Navbar />
            </>
          }
          <Routes>
            {/* Home */}
            <Route
              path="/"
              element={
                <Suspense fallback={<Loading />}>
                  <Home />
                </Suspense>
              }
            />

            {/* Product Details */}
            <Route
              path="/product-details/:id"
              element={
                <Suspense fallback={<Loading />}>
                  <ProductDetails />
                </Suspense>
              }
            />
            {/* Auth Routes */}
            {/* Login Route - Protected */}
            <Route
              path="/auth/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <Suspense fallback={<Loading />}>
                    <Login />
                  </Suspense>
                )
              }
            />
            {/* SignUp Route - Protected */}
            <Route
              path="/auth/signup"
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <Suspense fallback={<Loading />}>
                    <SignUp />
                  </Suspense>
                )
              }
            />
            {/* User Profile - Protected */}
            <Route
              path="/user-profile"
              element={
                isAuthenticated ? (
                  <Suspense fallback={<Loading />}>
                    <UserProfile />
                  </Suspense>
                ) : (
                  <Navigate to="/auth/login" replace />
                )
              }
            />
            {/* --------------------------------------- */}

            {/* ShoppingCart */}
            <Route
              path="/shopping-cart"
              element={
                isAuthenticated ?
                  (<Suspense fallback={<Loading />}>
                    <ShoppingCart />
                  </Suspense>) :
                  (<Navigate to="/" replace />)
              }
            />
            {/* Checkout */}
            <Route
              path="/checkout"
              element={
                isAuthenticated ?
                  (<Suspense fallback={<Loading />}>
                    <Checkout />
                  </Suspense>) :
                  (<Navigate to="/" replace />)
              }
            />

          {/* small form to add products */}
            <Route
              path="/add-product"
              element={
                isAuthenticated ? (
                  <Suspense fallback={<Loading />}>
                    <AddProductForm />
                  </Suspense>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            {/* Not Found page handling */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </>
      </Elements>
    </ThemeProvider>
    </>
  );
}

export default App;
