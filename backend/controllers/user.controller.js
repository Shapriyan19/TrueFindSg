const { db, admin } = require('../utils/firebase');

// -- Profile --
exports.saveUserProfile = async (req, res) => {
  const uid = req.user.uid;
  const { username, profilePic } = req.body;

  try {
    await db.collection('users').doc(uid).set({
      profile: {
        email: req.user.email,
        username,
        profilePic: profilePic || ''
      }
    }, { merge: true });

    res.json({ status: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserProfile = async (req, res) => {
  const uid = req.user.uid;

  try {
    const doc = await db.collection('users').doc(uid).get();
    if (!doc.exists) return res.status(404).json({ error: 'Profile not found' });
    res.json(doc.data().profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -- Verified Products --
exports.addToVerified = async (req, res) => {
  const uid = req.user.uid;
  const product = req.body;

  try {
    await db.collection('users').doc(uid).update({
      verifiedProducts: admin.firestore.FieldValue.arrayUnion(product)
    });
    res.json({ status: 'Product added to verified list' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getVerified = async (req, res) => {
  const uid = req.user.uid;

  try {
    const doc = await db.collection('users').doc(uid).get();
    const data = doc.exists ? doc.data().verifiedProducts || [] : [];
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -- Watchlist --
exports.addToWatchlist = async (req, res) => {
  const uid = req.user.uid;
  const product = req.body;

  try {
    await db.collection('users').doc(uid).update({
      watchlist: admin.firestore.FieldValue.arrayUnion(product)
    });
    res.json({ status: 'Product added to watchlist' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getWatchlist = async (req, res) => {
  const uid = req.user.uid;

  try {
    const doc = await db.collection('users').doc(uid).get();
    const data = doc.exists ? doc.data().watchlist || [] : [];
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -- User Reports --
exports.submitUserReport = async (req, res) => {
  const uid = req.user.uid;
  const report = req.body;

  try {
    await db.collection('users').doc(uid).collection('reports').add({
      ...report,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    res.json({ status: 'Report submitted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserReports = async (req, res) => {
  const uid = req.user.uid;

  try {
    const snapshot = await db.collection('users').doc(uid).collection('reports').get();
    const reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
