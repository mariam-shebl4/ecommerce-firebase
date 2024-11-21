import * as React from 'react';
import { useEffect, useState } from 'react';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Link } from 'react-router-dom';
import { AppBar, Badge, Box, IconButton, Menu, MenuItem, Stack, Toolbar, Typography } from '@mui/material';
import { logout } from '../stores/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { CartItem } from '../pages/ShoppingCart';
import { RootState } from '../stores/store';
import { clearCart } from '../stores/cartSlice';
import { auth, fetchCartItemsFromFirebase } from '../firebase/firebase';
import LogoutIcon from '@mui/icons-material/Logout';
import { onAuthStateChanged } from 'firebase/auth';


export default function Navbar() {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const cartQuantity = useSelector((state: RootState) =>
    state.cart.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
  );
  const [quantity, setQuantity] = useState<number>(0)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  // logout
  const clearCookies = (cookiesToRemove: string[]) => {
    cookiesToRemove.forEach((cookieName) => {
      Cookies.remove(cookieName, { path: '/' });
    });
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    clearCookies(['user', 'access_token']);

  };

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const cartItems = await fetchCartItemsFromFirebase();
        setQuantity(cartItems.length)
      } catch (error) {
        console.error("Error fetching cart items: ", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        fetchCartData();
      }
    });

    return () => unsubscribe();
  }, [cartQuantity]);


  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <>
      {isAuthenticated ? (
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          id={menuId}
          keepMounted
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>
            <Link to={"/user-profile"} style={{ color: "inherit", textDecoration: "none" }}>
              Profile
            </Link>
          </MenuItem>
          <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>Log Out</MenuItem>
        </Menu>

      ) : (
        <Link to={'/auth/login'} style={{ color: "#fff", fontSize: "20px", textDecoration: "none", fontWeight: "bold" }}>
          <Typography variant='body1'>
            Login
          </Typography>
        </Link>
      )}
    </>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <>
      {isAuthenticated ? (
        <Menu
          anchorEl={mobileMoreAnchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          id={mobileMenuId}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={isMobileMenuOpen}
          onClose={handleMobileMenuClose}
        >
          <MenuItem>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
            >
              <ShoppingBagIcon />
            </IconButton>
            <Link to={"/shopping-cart"} style={{ color: "inherit", textDecoration: "none" }}>
              <p>shopping cart</p>
            </Link>
          </MenuItem>
          <MenuItem>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Link to={"/user-profile"} style={{ color: "inherit", textDecoration: "none" }}>
              <p>Profile</p>
            </Link>
          </MenuItem>
          <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
            >
              <LogoutIcon />
            </IconButton>
            <p>Logout</p>
          </MenuItem>
        </Menu>
      ) : (
        <Link to={'/auth/login'} style={{ color: "#fff", fontSize: "20px", textDecoration: "none", fontWeight: "bold" }}>
          <Typography variant='body1'>
            Login
          </Typography>
        </Link>
      )}

    </>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>

          {/* links */}
          <Stack direction="row" spacing={2}>
            <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
              <Typography
                variant="h6"
                noWrap
                component="div"
              >
                Home
              </Typography>
            </Link>

          </Stack>
          <Box sx={{ flexGrow: 1 }} />
          {/* large screen */}
          {isAuthenticated && (
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                <Link to={"/shopping-cart"} style={{ color: "#fff" }}>
                  <Badge badgeContent={quantity > 0 ? quantity : null} color="error">
                    <ShoppingBagIcon />
                  </Badge>
                </Link>
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Box>
          )}


          {/* mobile */}
          {isAuthenticated ? (
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          ) : (
            <Link to={'/auth/login'} style={{ color: "#fff", fontSize: "20px", textDecoration: "none", fontWeight: "bold" }}>
              <Typography variant='body1'>
                Login
              </Typography>
            </Link>
          )}
        </Toolbar>
      </AppBar>
      {/* Mobile menu (only rendered on mobile) */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        {renderMobileMenu}
      </Box>

      {/* Menu for large screens (only rendered on larger screens) */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        {renderMenu}
      </Box>
    </Box>
  );
}

