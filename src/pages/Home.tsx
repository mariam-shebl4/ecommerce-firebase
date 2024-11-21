import { useCallback, useEffect, useState } from "react";
import { Box, Pagination, Stack, TextField, Select, MenuItem, InputLabel, FormControl, Slider, Button, Typography, Grid, IconButton, Drawer } from "@mui/material";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../firebase/firebase";
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import Loading from "../components/Loading";
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [sliderMinPrice, setSliderMinPrice] = useState<number>(0);
  const [sliderMaxPrice, setSliderMaxPrice] = useState<number>(500);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sortOption, setSortOption] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 4;

  const loadProducts = useCallback(() => {
    setLoading(true);

    // Set up the real-time listener
    const unsubscribe = fetchProducts(({ products }) => {
      setProducts(products);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = loadProducts();

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [loadProducts]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    let filtered = products.filter((product) => {
      const isSearchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const isPriceInRange = product.price >= minPrice && product.price <= maxPrice;

      return isSearchMatch && isPriceInRange;
    });

    // Sort based on the selected sort option
    if (sortOption === 'price-asc') {
      filtered = filtered.sort((a, b) => a.price - b.price); // Lowest to highest
    } else if (sortOption === 'price-desc') {
      filtered = filtered.sort((a, b) => b.price - a.price); // Highest to lowest
    } else if (sortOption === 'name') {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name)); // Alphabetical
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, minPrice, maxPrice, sortOption]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handlePriceSliderChange = (_: Event, newValue: number | number[]) => {
    const [newMinPrice, newMaxPrice] = newValue as number[];
    setSliderMinPrice(newMinPrice);
    setSliderMaxPrice(newMaxPrice);

    setMinPrice(newMinPrice);
    setMaxPrice(newMaxPrice);
  };


  const handleResetFilters = () => {
    setSearchTerm('');
    setMinPrice(0);
    setMaxPrice(500);
    setSliderMinPrice(0);
    setSliderMaxPrice(500);
    setSortOption('');
  };

  const indexOfLastItem= currentPage* productsPerPage;

const indexOfFirstItem= indexOfLastItem- productsPerPage;

  const currentItem = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) {
    return <Loading/>;
  }

  if (filteredProducts.length === 0) {
    return (
      <>
        <Stack sx={{ display: "flex", flexDirection: "row" }}>
          <aside>
            <Box p={3} sx={{ display: { xs: "none", md: "block" }, flexShrink: "0", flexGrow: "1", flexBasis: "27%", maxWidth: "15rem", bgcolor: "#8080801f", position: "fixed", height: "100rem" }}>
              <Typography variant="h5">Filters</Typography>
              <TextField
                label="Search items"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: "10px" }}
              />
              {/* Price */}
              <Box my={3}>
                <Box display="flex" gap="10px" mb={2}>
                  <TextField
                    label="Min price"
                    variant="outlined"
                    type="number"
                    fullWidth
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                  />
                  <TextField
                    label="Max price"
                    variant="outlined"
                    type="number"
                    fullWidth
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                  />
                </Box>
                <Slider
                  value={[sliderMinPrice, sliderMaxPrice]}
                  onChange={handlePriceSliderChange}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `$${value}`}
                  min={0}
                  max={500}
                  step={10}
                  sx={{ marginBottom: "10px" }}
                />

              </Box>
              <FormControl fullWidth style={{ marginBottom: "10px" }}>
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  label="Sort by"
                >
                  <MenuItem value="">Nothing</MenuItem>
                  <MenuItem value="price-asc">Price: Low to High</MenuItem>
                  <MenuItem value="price-desc">Price: High to Low</MenuItem>
                  <MenuItem value="name">Name</MenuItem>
                </Select>
              </FormControl>
              <Button variant="outlined" color="secondary" onClick={handleResetFilters} sx={{ marginTop: "10px" }}>
                Reset Filters
              </Button>
            </Box>
          </aside>

          <Box sx={{ flexShrink: "0", flexGrow: "1" }}>
            <section>
              <Box  sx={{ display: "flex", flexWrap: "wrap", gap: "20px" , ml: { xs: "2px", md: "30rem" },}}>
                <p>No products available.</p>
              </Box>
            </section>
          </Box>
        </Stack>
      </>
    );
  }


  return (
    <>
      <Stack sx={{ display: "flex", flexDirection: "row" }} gap={'80px'} >
        {/* Mobile Drawer */}
        <IconButton
          sx={{ display: { xs: "block", md: "none" }, position: "fixed", top: 60, left: 10 }}
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          ModalProps={{ keepMounted: true }}
        >
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ mb: 2, ml: 1 }}>
            <CloseIcon />
          </IconButton>
          <Box px={3}>
            <Typography variant="h5">Filters</Typography>
            <TextField
              label="Search items"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginBottom: "10px" }}
            />
            {/* Price */}
            <Box my={3}>
              <Box display="flex" gap="10px" mb={2}>
                <TextField
                  label="Min price"
                  variant="outlined"
                  type="number"
                  fullWidth
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                />
                <TextField
                  label="Max price"
                  variant="outlined"
                  type="number"
                  fullWidth
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
              </Box>
              <Slider
                value={[sliderMinPrice, sliderMaxPrice]}
                onChange={handlePriceSliderChange}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `$${value}`}
                min={0}
                max={500}
                step={10}
                sx={{ marginBottom: "10px" }}
              />

            </Box>
            <FormControl fullWidth style={{ marginBottom: "10px" }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                label="Sort by"
              >
                <MenuItem value="">Nothing</MenuItem>
                <MenuItem value="price-asc">Price: Low to High</MenuItem>
                <MenuItem value="price-desc">Price: High to Low</MenuItem>
                <MenuItem value="name">Name</MenuItem>
              </Select>
            </FormControl>
            <Button variant="outlined" color="secondary" onClick={handleResetFilters} sx={{ marginTop: "10px" }}>
              Reset Filters
            </Button>
          </Box>
        </Drawer>
        <aside>
          <Box p={3} sx={{ display: { xs: "none", md: "block" }, flexShrink: "0", flexGrow: "1", flexBasis: "27%", maxWidth: "15rem", bgcolor: "#8080801f", position: "fixed", top: "0px", pt: { md: "80px" }, height: "100rem" }}>
            <Typography variant="h5">Filters</Typography>
            <TextField
              label="Search items"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginBottom: "10px" }}
            />
            {/* Price */}
            <Box my={3}>
              <Box display="flex" gap="10px" mb={2}>
                <TextField
                  label="Min price"
                  variant="outlined"
                  type="number"
                  fullWidth
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                />
                <TextField
                  label="Max price"
                  variant="outlined"
                  type="number"
                  fullWidth
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
              </Box>
              <Slider
                value={[sliderMinPrice, sliderMaxPrice]}
                onChange={handlePriceSliderChange}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `$${value}`}
                min={0}
                max={500}
                step={10}
                sx={{ marginBottom: "10px" }}
              />

            </Box>
            <FormControl fullWidth style={{ marginBottom: "10px" }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                label="Sort by"
              >
                <MenuItem value="">Nothing</MenuItem>
                <MenuItem value="price-asc">Price: Low to High</MenuItem>
                <MenuItem value="price-desc">Price: High to Low</MenuItem>
                <MenuItem value="name">Name</MenuItem>
              </Select>
            </FormControl>
            <Button variant="outlined" color="secondary" onClick={handleResetFilters} sx={{ marginTop: "10px" }}>
              Reset Filters
            </Button>
          </Box>
        </aside>

        <Box sx={{ flexShrink: "0", flexGrow: "1", ml: { xs: "2px", md: "16rem" }, mt: 5, justifyContent: 'center' }}>
          <section>
            <Grid container spacing={2} columnSpacing={1} sx={{ display: "flex" }}>
              {currentItem.map((product) => (
                <Grid item xs={12} sm={5} md={3} sx={{width:"1px"}} >
                  <ProductCard key={product.id} product={product} />
                </Grid>
              ))}
            </Grid>
          </section>
          <Stack marginTop={3}>
            <Pagination
              count={Math.ceil(filteredProducts.length / productsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Stack>
        </Box>
      </Stack>

    </>
  );
};

export default Home;
