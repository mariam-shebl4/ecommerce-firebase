import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { CartItem } from "../pages/ShoppingCart";
import { CheckoutAddress } from "../components/AddressForm";
import { PaymentDetails } from "../components/PaymentForm";
import { AuthUser } from "../pages/UserProfile";
import { Product } from "../pages/Home";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export { app };
// Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// User Authentication Functions
// User Registration
export const registerUser = async (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

// User Login
export const loginUser = async (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

// Get Current User
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const auth = getAuth();
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user);
      } else {
        reject("No user is authenticated");
      }
    });
  });
};
//   Google Sign-In
export const googleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

// Logout User
export const logoutUser = async () => signOut(auth);

// Forgot Password Function
export const resetPassword = async (email: string) =>
  sendPasswordResetEmail(auth, email);

// products
// Fetch products with pagination
// export const fetchProducts = async () => {
//   const productsRef = collection(db, "products");

//   // Create a query without pagination
//   const productsQuery = query(productsRef, orderBy("name"));

//   const querySnapshot = await getDocs(productsQuery);
//   const products = querySnapshot.docs.map((doc) => {
//     const data = doc.data();

//     return {
//       id: doc.id,
//       name: data.name || "",
//       description: data.description || "",
//       price: data.price || 0,
//       images: data.images || [],
//     };
//   });

//   // Get total count of products (not used for pagination)
//   const totalSnapshot = await getDocs(collection(db, "products"));
//   const total = totalSnapshot.size;

//   return { products, total };
// };
type FetchProductsCallback = (data: { products: Product[]; total: number }) => void;

export const fetchProducts = (callback:FetchProductsCallback) => {
  const productsRef = collection(db, "products");

  // Create a query to order products by name
  const productsQuery = query(productsRef, orderBy("name"));

  // Set up a real-time listener
  const unsubscribe = onSnapshot(
    productsQuery,
    (querySnapshot) => {
      const products = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || "",
          description: data.description || "",
          price: data.price || 0,
          images: data.images || [],
        };
      });

      // Get the total count of products
      const total = querySnapshot.size;

      // Use the callback to pass products and total
      callback({ products, total });
    },
    (error) => {
      console.error("Error fetching products in real-time:", error);
    }
  );

  // Return the unsubscribe function
  return unsubscribe;
};


// add products
export const addProduct = async (product: Product, id: string) => {
  try {
    const productDoc = doc(db, "products", id);
    await setDoc(productDoc, {
      name: product.name,
      description: product.description,
      price: product.price,
      images: product.images,
    });
  } catch (error) {
    console.error("Error adding product: ", error);
  }
};
//   Cart
// Add an item to the cart
export const addToCart = async (cartItem: CartItem) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const cartRef = doc(collection(db, `users/${user.uid}/cart`), cartItem.id);
  await setDoc(
    cartRef,
    {
      quantity: cartItem.quantity,
      name: cartItem.name,
      price: cartItem.price,
      image: cartItem.image,
    },
    { merge: true }
  );
};

// Fetch cart items
export const fetchCartItems = async (): Promise<CartItem[]> => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const cartRef = collection(db, `users/${user.uid}/cart`);
  const querySnapshot = await getDocs(cartRef);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || "Unnamed Item",
      price: data.price || 0,
      quantity: data.quantity || 1,
      image: data.image || "default_image_url_here",
    };
  });
};

export const fetchCartItemsTotalAmount = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    const cartRef = collection(db, `users/${user.uid}/cart`);
    const querySnapshot = await getDocs(cartRef);

    const cartItems = querySnapshot.docs.map((doc) => doc.data());
    const totalAmount = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    return { cartItems, totalAmount };
  } catch (error) {
    console.error("Error fetching cart:", error);
    return { cartItems: [], totalAmount: 0 };
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (
  productId: string,
  quantity: number
) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const cartRef = doc(db, `users/${user.uid}/cart`, productId);
  await updateDoc(cartRef, { quantity });
};
// Remove an item from the cart
export const removeFromCart = async (productId: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const cartRef = doc(db, `users/${user.uid}/cart`, productId);
  await deleteDoc(cartRef);
};

// Clear the cart
export const clearCart = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const cartRef = collection(db, `users/${user.uid}/cart`);
  const querySnapshot = await getDocs(cartRef);

  const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
};

// get the cart items
export const fetchCartItemsFromFirebase = async (): Promise<CartItem[]> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const cartCollectionRef = collection(db, `users/${user.uid}/cart`);
  const querySnapshot = await getDocs(cartCollectionRef);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || "Unnamed Item",
      price: data.price || 0,
      quantity: data.quantity || 1,
      image: data.image || "default_image_url_here",
    };
  });
};

// checkout
// add checkout address
export const addCheckoutAddress = async (formData: CheckoutAddress) => {
  try {
    const user = getAuth().currentUser;
    if (!user) throw new Error("User not authenticated");

    const checkoutAddressRef = doc(db, `checkoutAddresses/${user.uid}`);
    await setDoc(
      checkoutAddressRef,
      {
        userId: user.uid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        address1: formData.address1,
        address2: formData.address2,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
        saveAddress: formData.saveAddress,
        timestamp: Timestamp.now(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Failed to submit the address:", error);
    throw new Error("Failed to submit the address");
  }
};
// get the checkout details getUserAddress
// Fetch the saved checkout address based on user ID
export const getUserAddress = async (): Promise<CheckoutAddress | null> => {
  const user = getAuth().currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const addressRef = doc(db, `checkoutAddresses/${user.uid}`);
  const docSnapshot = await getDoc(addressRef);

  if (docSnapshot.exists()) {
    return docSnapshot.data() as CheckoutAddress;
  } else {
    return null;
  }
};

export const addPaymentDetails = async (paymentData: PaymentDetails) => {
  const user = getAuth().currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }
  try {
    // Create a new document in the 'payments' collection
    const paymentRef = doc(collection(db, "payments"));
    await setDoc(paymentRef, paymentData);
  } catch (err) {
    console.error("Error saving payment details: ", err);
    throw err;
  }
};

// order Details
export const saveOrder = async (cartItems: CartItem[], totalAmount: number) => {
  const user = auth.currentUser;

  if (!user) throw new Error("User not authenticated.");

  const orderData = {
    userId: user.uid,
    items: cartItems,
    totalAmount,
    timestamp: Timestamp.now(),
  };

  try {
    await addDoc(collection(db, "orders"), orderData);
    await clearCart();
  } catch (error) {
    throw new Error(`Failed to save order: ${error}`);
  }
};
