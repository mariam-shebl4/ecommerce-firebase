import { useSelector, useDispatch } from 'react-redux';
import { Typography, Box, Stack, TextField, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as LinkMui } from '@mui/material';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db, getCurrentUser } from '../firebase/firebase';
import { RootState } from '../stores/store';
import { updateUserName } from '../stores/authSlice';
import History from './History';
import ForgotPassword from './auth/ForgotPassword';
import Loading from '../components/Loading';

export interface AuthUser {
  uid: string;
}

const UserProfile = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true); 
      const currentUser = await getCurrentUser();
      if (currentUser && currentUser.uid) {
        const userRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          dispatch(updateUserName(userData.name));
        }
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, [dispatch]);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value);
  };

  // edit the name
  const handleNameSave = async () => {
    const currentUser = await getCurrentUser();
    if (currentUser && currentUser.uid as string) {
      const userRef = doc(db, 'users', currentUser.uid);
      try {
        const docSnap = await getDoc(userRef);
        if (!docSnap.exists()) {
          await setDoc(userRef, { name: newName });
        } else {
          await updateDoc(userRef, { name: newName });
        }

        dispatch(updateUserName(newName));
      } catch (error) {
        console.error('Error updating name:', error);
      } finally {
        setIsEditing(false);
      }
    } else {
      console.error('User not authenticated or missing UID.');
    }
  };

  if (!isAuthenticated || !user) {
    return <Typography>You need to log in to view your profile.</Typography>;
  }

  return (
    <>
    {isLoading?<Loading/>:(
    <Box sx={{ padding: {md:4} }}>
      <Stack spacing={2} >
        <Box sx={{border:'1px solid #e8e7e7', display:'inline-block',width:{xs:"100%",md:'40%'},px:'20px',py:'20px'}}>
        {/* change password  */}
        <ForgotPassword open={open} handleClose={handleClose} />
        <LinkMui component="button" type="button" onClick={handleClickOpen} variant="body2" sx={{ textAlign: 'left' }}>
          Change your password?
        </LinkMui>

        {/* name and edit it */}
        {isEditing ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              value={newName}
              onChange={handleNameChange}
              label="Edit Name"
              variant="outlined"
              size="small"
              sx={{ marginRight: 2 }}
            />
            <Button onClick={handleNameSave} variant="contained" color="primary" sx={{ display: 'block' }}>
              Save
            </Button>
          </Box>
        ) : (
          <Typography variant="h5">{user?.name}</Typography>
        )}

        <Button onClick={() => setIsEditing(!isEditing)} variant="outlined" sx={{ marginTop: 2, display: 'block', width: '140px' }}>
          {isEditing ? 'Cancel' : 'Edit Name'}
        </Button>

        <Typography variant="body1" mt={1}>Email: {user?.email}</Typography>
       

        </Box>
       {/* order history */}
        <History />
      </Stack>
    </Box>
    )}
    </>
  );
};

export default UserProfile;
