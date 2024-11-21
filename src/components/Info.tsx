import * as React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { RootState } from '../stores/store';
import { useDispatch, useSelector } from 'react-redux';
import { getTheCartItem } from '../stores/cartSlice';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, fetchCartItemsTotalAmount } from '../firebase/firebase';


interface InfoProps {
  totalPrice: string|number;
}

export default function Info({ totalPrice }: InfoProps) {
  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
 const products = items
 
 React.useEffect(() => {
  async function getTotalPrice() {
    const cartItems = await fetchCartItemsTotalAmount()
    dispatch(getTheCartItem(cartItems.cartItems));
  }
  const unsubscribe = onAuthStateChanged(auth, user => {
    if (user) {
      getTotalPrice();
    } 
  });

  return () => unsubscribe();
}, [dispatch]);
  return (
    <React.Fragment>
      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
        Total 
      </Typography>
      <Typography variant="h4" gutterBottom>
        {totalPrice} $
      </Typography>
      <List disablePadding>
        {products.map((product) => (
          <ListItem key={product.name} sx={{ py: 1, px: 0 }}>
            <ListItemText
              sx={{ mr: 2 }}
              primary={product.name}
              secondary={`quantity : ${product.quantity}`}
            />
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {product.price} $
            </Typography>
          </ListItem>
        ))}
      </List>
    </React.Fragment>
  );
}