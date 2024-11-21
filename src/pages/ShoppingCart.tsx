import { useEffect } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setCartItems, updateCartItemQuantity, removeFromCart, clearCart, setTotalAmount } from '../stores/cartSlice';
import { fetchCartItems, updateCartItemQuantity as firebaseUpdateCartItemQuantity, removeFromCart as firebaseRemoveFromCart, clearCart as firebaseClearCart, auth, fetchCartItemsTotalAmount } from '../firebase/firebase';
import { RootState } from '../stores/store';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import Loading from '../components/Loading';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

const ShoppingCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { items, totalAmount, loading } = useSelector((state: RootState) => state.cart);

  // Fetch cart items 
  useEffect(() => {
    const loadCartItems = async () => {

      try {
        const items = await fetchCartItems();
        dispatch(setCartItems(items));
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        loadCartItems();
      }
    });

    return () => unsubscribe();
  }, [dispatch]);


  const handleCheckout = async () => {
    const totalPrice = await fetchCartItemsTotalAmount()
    dispatch(setTotalAmount(totalPrice.totalAmount));
    navigate('/checkout')
  };


  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    await firebaseUpdateCartItemQuantity(productId, quantity);
    dispatch(updateCartItemQuantity({ id: productId, quantity }));
  };

  const handleRemoveItem = async (productId: string) => {
    await firebaseRemoveFromCart(productId);
    dispatch(removeFromCart(productId));
  };

  const handleClearCart = async () => {
    await firebaseClearCart();
    dispatch(clearCart());
  };

  if (loading) {
    return <Loading />;
  }

  if (items.length === 0) {
    return (
      <Box display={'flex'} justifyContent={'center'}>
        <Box sx={{textAlign:'center'}}>
    <Typography variant='h4' textAlign={'center'} mt={5}>Your cart is empty!</Typography>
    <Button onClick={()=>navigate('/')} variant='contained' sx={{mt:'20px'}} >Go to Shop</Button>
        </Box>
      </Box>
  );
  }
  return (
    <Stack mx={3} height={'200vh'}>
      <div>
        <h1>My Basket: <span>{items?.length} Items</span></h1>
        <Button onClick={handleClearCart}>Clear</Button>
      </div>
      {items.map((item) => (
        <div key={item?.id} style={{ display: 'flex', marginBottom: '20px', alignItems: 'center' }}>
          <img
            src={item?.image}
            alt={item?.name}
            loading="lazy"
            style={{ width: '200px', height: '200px', objectFit: 'cover' }}
          />
          <div style={{ flex: 1, marginLeft: '20px' }}>
            <Typography variant='h5'>{item?.name}</Typography>
            <Typography variant='subtitle1'>Quantity: {item?.quantity}</Typography>
            <Typography variant='subtitle2'>${(item?.quantity * item?.price).toFixed(2)}</Typography>
            <Stack direction="row" spacing={2} alignItems={'center'}>
              <Button onClick={() => handleUpdateQuantity(item?.id, item?.quantity + 1)}>+</Button>
              <p>{item.quantity}</p>
              <Button onClick={() => handleUpdateQuantity(item?.id, item?.quantity - 1)}>-</Button>
            </Stack>
            <Button onClick={() => handleRemoveItem(item?.id)} variant='outlined' sx={{mt:'10px'}} color="error" >
              Remove
            </Button>
          </div>
        </div>
      ))}
      <div>
        <h4>Subtotal Amount:</h4>
        <p>${totalAmount?.toFixed(2)}</p>
        <Button variant="contained" color="primary" onClick={handleCheckout}>Check out</Button>
      </div>
    </Stack>
  );
};

export default ShoppingCart;
