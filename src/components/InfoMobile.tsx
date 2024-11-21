
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { RootState } from '../stores/store';
import { Box, Stack } from '@mui/material';


interface InfoProps {
  totalPrice: string|number;
}
export default function Info({ totalPrice }: InfoProps) {
  const { items } = useSelector((state: RootState) => state.cart);
  const products = items
  return (
    <Stack>
      <Box>
      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
        Total
      </Typography>
      <Typography variant="h4" gutterBottom>
        {totalPrice} $
      </Typography>
      </Box>
      <List disablePadding>
        {products.map((product) => (
          <ListItem key={product?.name} sx={{ py: 1, px: 0, }}>
            <ListItemText
              sx={{ mr: 2 }}
              primary={product?.name}
              secondary={`quantity : ${product?.quantity}`}
            />
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {product?.price} $
            </Typography>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}