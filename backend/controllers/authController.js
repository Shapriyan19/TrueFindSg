import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '../config/firebase.js';

export const signup = async (req, res) => {
  try {
    const { email, password, displayName, profileImageUrl } = req.body;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with display name and photo URL
    await updateProfile(user, { 
      displayName,
      photoURL: profileImageUrl || null
    });

    // Create user profile in database
    await set(ref(database, `users/${user.uid}`), {
      email,
      displayName,
      photoURL: profileImageUrl || null,
      createdAt: new Date().toISOString(),
      verifiedProducts: [],
      watchlist: []
    });

    // Send verification email
    await sendEmailVerification(user);

    // Get the ID token
    const token = await user.getIdToken();

    res.status(201).json({
      message: 'User created successfully. Please verify your email.',
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      },
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      await signOut(auth);
      return res.status(401).json({ error: 'Please verify your email before logging in.' });
    }

    // Get the ID token
    const token = await user.getIdToken();

    res.status(200).json({
      message: 'Login successful',
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      },
      token
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    await signOut(auth);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await sendPasswordResetEmail(auth, email);
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return res.status(401).json({ error: 'No user logged in' });
    }
    await sendEmailVerification(user);
    res.status(200).json({ message: 'Verification email sent' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 