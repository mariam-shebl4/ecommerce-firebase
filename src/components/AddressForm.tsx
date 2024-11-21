import React, { useEffect, useState } from "react";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid2";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";
import { styled } from "@mui/system";
import { addCheckoutAddress, auth, getUserAddress } from "../firebase/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setAddress } from "../stores/checkoutAddressSlice";
import { Alert } from "@mui/material";

export interface CheckoutAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  saveAddress: boolean;
}

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function AddressForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    saveAddress: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const dispatch = useDispatch(); 
  
  dispatch(setAddress(formData))
  
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const savedAddress = await getUserAddress();
        
        if (savedAddress) {
          setFormData(savedAddress); 
        }        
      } catch (error) {
        console.error("Error fetching user address: ", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        fetchAddress();
      } 
    });
  
    return () => unsubscribe();
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(""); 
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setErrorMessage("Please log in before submitting the form.");
        return;
      }
       await addCheckoutAddress(formData);  
       setSuccessMessage("Address submitted successfully!");
    } catch (error) {
      console.error("Error submitting address:", error);
      setErrorMessage(`Failed to submit the address. Please try again. ${error}`);
    } 
    finally{
      setIsSubmitting(false);
    }
  };
  


  return (
    <form onSubmit={handleSubmit}>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      <Grid container spacing={3}>
        <FormGrid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="firstName" required>
            First name
          </FormLabel>
          <OutlinedInput
            id="firstName"
            name="firstName"
            type="text"
            placeholder="John"
            autoComplete="first-name"
            value={formData.firstName}
            onChange={handleChange}
            required
            size="small"
          />
        </FormGrid>
        <FormGrid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="lastName" required>
            Last name
          </FormLabel>
          <OutlinedInput
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Snow"
            autoComplete="last-name"
            value={formData.lastName}
            onChange={handleChange}
            required
            size="small"
          />
        </FormGrid>
        <FormGrid size={{ xs: 12 }}>
          <FormLabel htmlFor="address1" required>
            Address line 1
          </FormLabel>
          <OutlinedInput
            id="address1"
            name="address1"
            type="text"
            placeholder="Street name and number"
            autoComplete="address-line1"
            value={formData.address1}
            onChange={handleChange}
            required
            size="small"
          />
        </FormGrid>
        <FormGrid size={{ xs: 12 }}>
          <FormLabel htmlFor="address2">Address line 2</FormLabel>
          <OutlinedInput
            id="address2"
            name="address2"
            type="text"
            placeholder="Apartment, suite, unit, etc. (optional)"
            autoComplete="address-line2"
            value={formData.address2}
            onChange={handleChange}
            size="small"
          />
        </FormGrid>
        <FormGrid size={{ xs: 6 }}>
          <FormLabel htmlFor="city" required>
            City
          </FormLabel>
          <OutlinedInput
            id="city"
            name="city"
            type="text"
            placeholder="New York"
            autoComplete="city"
            value={formData.city}
            onChange={handleChange}
            required
            size="small"
          />
        </FormGrid>
        <FormGrid size={{ xs: 6 }}>
          <FormLabel htmlFor="state" required>
            State
          </FormLabel>
          <OutlinedInput
            id="state"
            name="state"
            type="text"
            placeholder="NY"
            autoComplete="state"
            value={formData.state}
            onChange={handleChange}
            required
            size="small"
          />
        </FormGrid>
        <FormGrid size={{ xs: 6 }}>
          <FormLabel htmlFor="zip" required>
            Zip / Postal code
          </FormLabel>
          <OutlinedInput
            id="postalCode"  
    name="postalCode"
            type="text"
            placeholder="12345"
            autoComplete="postal-code"
            value={formData.postalCode}
            onChange={handleChange}
            required
            size="small"
          />
        </FormGrid>
        <FormGrid size={{ xs: 6 }}>
          <FormLabel htmlFor="country" required>
            Country
          </FormLabel>
          <OutlinedInput
            id="country"
            name="country"
            type="text"
            placeholder="United States"
            autoComplete="country"
            value={formData.country}
            onChange={handleChange}
            required
            size="small"
          />
        </FormGrid>
        <FormGrid size={{ xs: 12 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </FormGrid>
      </Grid>
    </form>
  );
}
