import { ref, get, update, push, remove } from 'firebase/database';
import { database } from '../config/firebase.js';

export const getProfile = async (req, res) => {
  try {
    const { uid } = req.user;
    const userRef = ref(database, `users/${uid}`);
    const snapshot = await get(userRef);
    
    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(snapshot.val());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { uid } = req.user;
    const { displayName, phoneNumber, address } = req.body;
    
    const updates = {
      displayName,
      phoneNumber,
      address,
      updatedAt: new Date().toISOString()
    };

    await update(ref(database, `users/${uid}`), updates);
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addToWatchlist = async (req, res) => {
  try {
    const { uid } = req.user;
    const { productId, platform } = req.body;
    
    const watchlistRef = ref(database, `users/${uid}/watchlist`);
    const newItem = {
      productId,
      platform,
      addedAt: new Date().toISOString()
    };
    
    await push(watchlistRef, newItem);
    res.status(200).json({ message: 'Product added to watchlist' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeFromWatchlist = async (req, res) => {
  try {
    const { uid } = req.user;
    const { watchlistItemId } = req.params;
    
    await remove(ref(database, `users/${uid}/watchlist/${watchlistItemId}`));
    res.status(200).json({ message: 'Product removed from watchlist' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getWatchlist = async (req, res) => {
  try {
    const { uid } = req.user;
    const watchlistRef = ref(database, `users/${uid}/watchlist`);
    const snapshot = await get(watchlistRef);
    
    const watchlist = [];
    snapshot.forEach((childSnapshot) => {
      watchlist.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });

    res.status(200).json(watchlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 