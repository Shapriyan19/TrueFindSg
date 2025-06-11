import admin from '../config/admin.js'

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    
    // Handle specific Firebase auth errors
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ 
        error: 'Token expired',
        code: 'TOKEN_EXPIRED',
        message: 'Your session has expired. Please log in again.'
      });
    }
    
    res.status(401).json({ 
      error: 'Invalid token',
      message: 'Authentication failed. Please log in again.'
    });
  }
};


export const isAdmin = async (req, res, next) => {
  try {
    const { user } = req;
    const userRecord = await auth.getUser(user.uid);
    
    if (!userRecord.customClaims?.admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    next();
  } catch (error) {
    res.status(403).json({ error: 'Access denied' });
  }
}; 