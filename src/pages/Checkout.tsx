import { useEffect, useState } from 'react';
import { Box, Button, Card, Stack, Step, StepLabel, Stepper, Typography } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid2';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import Info from '../components/Info';
import InfoMobile from '../components/InfoMobile';
import PaymentForm from '../components/PaymentForm';
import Review from '../components/Review';
import AddressForm from '../components/AddressForm';
import { RootState } from '../stores/store';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth, fetchCartItems, fetchCartItemsTotalAmount } from '../firebase/firebase';
import { setCartItems, setTotalAmount } from '../stores/cartSlice';
import { onAuthStateChanged } from 'firebase/auth';
import { setSuccess } from '../stores/paymentSlice';

const steps = ['Shipping address', 'Payment details', 'Review your order'];
function getStepContent(step: number) {
  switch (step) {
    case 0:
      return <AddressForm />;
    case 1:
      return <Review />;
    case 2:
      return <PaymentForm />;
    default:
      throw new Error('Unknown step');
  }
}
export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const { totalAmount, items } = useSelector((state: RootState) => state.cart);
  const { success } = useSelector((state: RootState) => state.payment);


  useEffect(() => {
    async function getTotalPrice() {
      const totalPrice = await fetchCartItemsTotalAmount()
      dispatch(setTotalAmount(totalPrice.totalAmount));
      const cartItems = await fetchCartItems();
      dispatch(setCartItems(cartItems));

    }
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        getTotalPrice();
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    dispatch(setSuccess(false))
  }, [dispatch])

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };


  return (
    <>
      {items.length === 0 && success === false ? (
        navigate('/')
      ) : (
        <>
          <CssBaseline enableColorScheme />
          <Grid
            container
            sx={{
              height: {
                xs: '100%',
                sm: 'calc(100dvh - var(--template-frame-height, 0px))',
              },
              mt: {
                xs: 4,
                sm: 0,
              },
            }}
          >
            <Grid
              size={{ xs: 12, sm: 5, lg: 4 }}
              sx={{
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                backgroundColor: 'background.paper',
                borderRight: { sm: 'none', md: '1px solid' },
                borderColor: { sm: 'none', md: 'divider' },
                alignItems: 'start',
                pt: 16,
                px: 10,
                gap: 4,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  width: '100%',
                  maxWidth: 500,
                }}
              >
                <Info totalPrice={activeStep >= 1 ? (totalAmount > 0 ? totalAmount + 20 : 0) : totalAmount} />
              </Box>
            </Grid>

            <Grid
              size={{ sm: 12, md: 7, lg: 8 }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '100%',
                width: '100%',
                backgroundColor: { xs: 'transparent', sm: 'background.default' },
                alignItems: 'start',
                pt: { xs: 0, sm: 16 },
                px: { xs: 2, sm: 10 },
                gap: { xs: 4, md: 8 },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: { sm: 'space-between', md: 'flex-end' },
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: { sm: '100%', md: 600 },
                }}
              >
                <Box
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    flexGrow: 1,
                  }}
                >
                  <Stepper
                    id="desktop-stepper"
                    activeStep={activeStep}
                    sx={{ width: '100%', height: 40 }}
                  >
                    {steps.map((label) => (
                      <Step
                        sx={{ ':first-child': { pl: 0 }, ':last-child': { pr: 0 } }}
                        key={label}
                      >
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
              </Box>
              <Card sx={{ display: { xs: 'flex', md: 'none' }, width: '100%' }}>
                <CardContent
                  sx={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <InfoMobile totalPrice={activeStep >= 1 ? (totalAmount > 0 ? totalAmount + 20 : 0) : totalAmount} />
                </CardContent>
              </Card>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  width: '100%',
                  maxWidth: { sm: '100%', md: 600 },
                  maxHeight: '720px',
                  gap: { xs: 5, md: 'none' },
                }}
              >
                <Stepper
                  id="mobile-stepper"
                  activeStep={activeStep}
                  alternativeLabel
                  sx={{ display: { sm: 'flex', md: 'none' } }}
                >
                  {steps.map((label) => (
                    <Step
                      sx={{
                        ':first-child': { pl: 0 },
                        ':last-child': { pr: 0 },
                        '& .MuiStepConnector-root': { top: { xs: 6, sm: 12 } },
                      }}
                      key={label}
                    >
                      <StepLabel
                        sx={{ '.MuiStepLabel-labelContainer': { maxWidth: '70px' } }}
                      >
                        {label}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
                {/* last step */}
                {success ? (
                  <Stack spacing={2} useFlexGap py={5}>
                    <Typography variant="h1">📦</Typography>
                    <Typography variant="h5">Thank you for your order!</Typography>
                    <Review />
                    <Button
                      variant="contained"
                      onClick={() => navigate('/')}
                      sx={{ alignSelf: 'start', width: { xs: '100%', sm: 'auto' } }}
                    >
                      Go to Shop
                    </Button>
                  </Stack>
                ) : (
                  <>
                    {getStepContent(activeStep)}
                    <Box
                      sx={[
                        {
                          display: 'flex',
                          flexDirection: { xs: 'column-reverse', sm: 'row' },
                          alignItems: 'end',
                          flexGrow: 1,
                          gap: 1,
                          pb: { xs: 12, sm: 0 },
                          mt: { xs: 2, sm: 0 },
                          mb: '60px',
                        },
                        activeStep !== 0
                          ? { justifyContent: 'space-between' }
                          : { justifyContent: 'flex-end' },
                      ]}
                    >
                      {activeStep !== 0 && (
                        <Button
                          startIcon={<ChevronLeftRoundedIcon />}
                          onClick={handleBack}
                          variant="text"
                          sx={{ display: { xs: 'none', sm: 'flex' } }}
                        >
                          Previous
                        </Button>
                      )}
                      {activeStep !== 0 && (
                        <Button
                          startIcon={<ChevronLeftRoundedIcon />}
                          onClick={handleBack}
                          variant="outlined"
                          fullWidth
                          sx={{ display: { xs: 'flex', sm: 'none' } }}
                        >
                          Previous
                        </Button>
                      )}
                      {activeStep === steps.length - 1 ? <></> : (
                        <Button
                          variant="contained"
                          endIcon={<ChevronRightRoundedIcon />}
                          onClick={handleNext}
                          sx={{ width: { xs: '100%', sm: 'fit-content' } }}
                        >
                          {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                        </Button>
                      )}
                    </Box>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </>
      )}

    </>
  );
}