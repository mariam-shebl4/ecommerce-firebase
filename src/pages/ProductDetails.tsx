import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Loading from '../components/Loading';
import { Product } from './Home';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const images = product?.images || [];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  useEffect(() => {
    if (!id) {
      setError('Product ID is missing');
      setLoading(false);
      return;
    }

    const fetchProductDetails = async () => {
      try {
        const productRef = doc(db, 'products', id);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          setProduct({ id: productSnap.id, ...productSnap.data() } as Product);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError(`Could not load product details: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);


  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div style={{ marginTop: "50px", marginInline: "50px" }}>
      <Grid container justifyContent="center" alignItems="start">
        <Grid item xs={12} sm={1} >
          <Box display={'flex'} justifyContent="center" flexDirection={{ xs: "row", md: "column" }} gap={2}>
            {images.map((image, index) => (
              <Grid item key={index}>
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  style={{ width: '100px', cursor: 'pointer', height: '100px' }}
                  onClick={() => handleImageClick(index)}
                />
              </Grid>
            ))}
          </Box>
        </Grid>
        <Grid item xs={12} sm={5} sx={{ textAlign: 'center', mb: 2 }}>
          <Box>
            <img
              src={images[currentImageIndex]}
              alt={`Image ${currentImageIndex + 1}`}
              style={{ width: '500px', height: '500px' }}
            />
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <IconButton onClick={goToPrevious}>
              <NavigateBeforeIcon />
            </IconButton>
            <Typography variant="caption">
              Image {currentImageIndex + 1} of {images.length}
            </Typography>
            <IconButton onClick={goToNext}>
              <NavigateNextIcon />
            </IconButton>
          </Box>
        </Grid>
        <Grid xs={12} sm={6}>
          <Typography variant='h4'>{product.name}</Typography>
          <Typography variant='body1'>{product.description}</Typography>
          <Typography variant='body2'>Price: ${product.price.toFixed(2)}</Typography>

        </Grid>

      </Grid>
    </div>
  );
};

export default ProductDetails;
