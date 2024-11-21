import { User as FirebaseUser } from 'firebase/auth';
import { User } from '../stores/authSlice'; 

export function mapFirebaseUserToAppUser(firebaseUser: FirebaseUser): User {
  return {
    id: parseInt(firebaseUser.uid, 10), 
    name: firebaseUser.displayName || 'Guest',
    email: firebaseUser.email || '',
    // accessToken: '',
  };
}
