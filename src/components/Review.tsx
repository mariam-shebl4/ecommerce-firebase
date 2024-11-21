import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { RootState } from '../stores/store';
import { useSelector } from 'react-redux';



export default function Review() {
  const { totalAmount} = useSelector((state: RootState) => state.cart);
  const { address } = useSelector((state: RootState) => state.checkoutAddress);
  const {  success } = useSelector((state: RootState) => state.payment);
  return (
    <Stack spacing={2}>
      {!success &&(
        <>
        <List disablePadding>
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="Products" secondary="4 selected" />
            <Typography variant="body2">${totalAmount}</Typography>
          </ListItem>
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="Shipping" secondary="Plus taxes" />
            <Typography variant="body2">$20</Typography>
          </ListItem>
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="Total" />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              ${totalAmount+20}
            </Typography>
          </ListItem>
        </List>
        <Divider />
        </>

      )}
      <Stack
        direction="column"
        divider={<Divider flexItem />}
        spacing={2}
        sx={{ my: 2 }}
      >
        <div>
          <Typography variant="subtitle2" gutterBottom>
            Shipping details
          </Typography>
          <Typography gutterBottom>{address?.firstName} {address?.lastName}</Typography>
          <Typography gutterBottom sx={{ color: 'text.secondary' }}>
            {address?.address1}, {address?.address2}, {address?.city}, {address?.country},
          </Typography>
        </div>
      </Stack>
    </Stack>
  );
}