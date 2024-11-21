import { useState } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import SimCardRoundedIcon from '@mui/icons-material/SimCardRounded';
import { Timestamp } from 'firebase/firestore';
import { addPaymentDetails, saveOrder } from '../firebase/firebase';
import { Button } from '@mui/material';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../stores/store';
import { setSuccess } from '../stores/paymentSlice';
import { clearCart } from '../stores/cartSlice';

export interface PaymentDetails {
  timestamp: Timestamp;
  paymentMethod: string;
  token?: string;
  totalAmount: number;
}

const PaymentContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  width: '100%',
  height: 375,
  padding: theme.spacing(3),
  borderRadius: `calc(${theme.shape.borderRadius}px + 4px)`,
  border: '1px solid ',
  borderColor: (theme || theme).palette.divider,
  background:
    'linear-gradient(to bottom right, hsla(220, 35%, 97%, 0.3) 25%, hsla(220, 20%, 88%, 0.3) 100%)',
  boxShadow: '0px 4px 8px hsla(210, 0%, 0%, 0.05)',
  [theme.breakpoints.up('xs')]: {
    height: 300,
  },
  [theme.breakpoints.up('sm')]: {
    height: 350,
  },
  ...theme.applyStyles('dark', {
    background:
      'linear-gradient(to right bottom, hsla(220, 30%, 6%, 0.2) 25%, hsla(220, 20%, 25%, 0.2) 100%)',
    boxShadow: '0px 4px 8px hsl(220, 35%, 0%)',
  }),
}));

const FormGrid = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export default function PaymentForm() {

  const dispatch = useDispatch();

  const stripe = useStripe();
  const elements = useElements();

  const [paymentType] = useState('creditCard');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { totalAmount, items } = useSelector((state: RootState) => state.cart);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);


    if (totalAmount <= 0) {
      setError('Invalid total amount, cannot proceed with checkout.');
      return;
    }

    if (!stripe || !elements) {
      return;
    }

    if (paymentType === 'creditCard') {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setError('Card details are missing.');
        return;
      }

      const { token, error: stripeError } = await stripe.createToken(cardElement);
      if (stripeError) {
        setError(stripeError.message || 'An error occurred.');
        return;
      }

      try {
        await addPaymentDetails({
          paymentMethod: paymentType,
          token: token.id,
          totalAmount: totalAmount + 20,
          timestamp: Timestamp.now(),
        });

        setSuccessMessage('Payment details saved successfully. Proceeding with checkout.');
        dispatch(setSuccess(true));

        await saveOrder(items, totalAmount);
        dispatch(clearCart());
      } catch (err) {
        setError(`Payment failed: ${err}`);
      }
    }
  };


  return (
    <Stack spacing={{ xs: 3, sm: 6 }} useFlexGap>
      {error && <Alert severity="error">{error}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}


      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <PaymentContainer>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle2">Credit card</Typography>
            <CreditCardRoundedIcon sx={{ color: 'text.secondary' }} />
          </Box>
          <SimCardRoundedIcon
            sx={{
              fontSize: { xs: 48, sm: 56 },
              transform: 'rotate(90deg)',
              color: 'text.secondary',
            }}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              gap: 2,
            }}
          >
            <FormGrid sx={{ flexGrow: 1 }}>
              <FormLabel htmlFor="card-number" required sx={{ my: 3 }}>
                Card details
              </FormLabel>
              <CardElement
                id="card-element"
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#32325d',
                      letterSpacing: '0.025em',
                      padding: '10px',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                  },
                }}
              />
            </FormGrid>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
          </Box>
        </PaymentContainer>
      </Box>

      <Button variant="contained" onClick={handleSubmit}>Place order</Button>
    </Stack>
  );
}