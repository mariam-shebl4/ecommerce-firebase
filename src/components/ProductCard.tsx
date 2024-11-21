import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { Link } from "react-router-dom";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Box, Button } from "@mui/material";
import { addToCart } from "../firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { addToCart as addToCartAction } from "../stores/cartSlice";
import { RootState } from "../stores/store";
import { Product } from "../pages/Home";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();

  const { items } = useSelector((state: RootState) => state.cart);

  const price = typeof product?.price === 'number' ? product?.price.toFixed(2) : 'N/A';

  const isProductInCart = items.some(item => item.id === product.id);
  
  const handleAddToCart = async () => {
    if (isProductInCart) {
      alert("This product is already added!");
      return;
    }
    
    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images[0],
      };

      await addToCart(cartItem);
      dispatch(addToCartAction(cartItem));
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Failed to add product to cart.");
    }
  };

  return (
    <Card sx={{ width: '250px' ,pb:2}}>
      <Link to={`/product-details/${product.id}`}>
        <CardMedia
          component="img"
          height="220"
          image={product.images[0]}
          alt={product.name}
          sx={{ objectFit: 'cover', objectPosition: 'center center' }}
        />
      </Link>
      <CardContent>
        <Typography variant="h5" component="div" sx={{ color: "#000", textDecoration: 'none', }}>
          {product?.name}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", textDecoration: 'none', whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width: '200px',
        display: 'block', 
        pr:4}}>
          {product?.description}
        </Typography>
      </CardContent>
      <CardActionArea>
        <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <Typography variant="h6" component="div" color="primary" sx={{ textDecoration: 'none',ml:2 }}>
            {price} $
          </Typography>
          <Button onClick={handleAddToCart}>
            <ShoppingCartIcon />
          </Button>
        </Box>
      </CardActionArea>
    </Card>
  );
}
