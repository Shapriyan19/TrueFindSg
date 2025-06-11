import { ref, push, get, update, query, orderByChild, equalTo, remove, set } from 'firebase/database';
import { database } from '../config/firebase.js';

export const submitReport = async (req, res) => {
  try {
    const { uid } = req.user;
    const { productName, sellerName, reportType, description, evidence } = req.body;
    
    // Ensure reportType is a string (comma-separated if array)
    const formattedReportType = Array.isArray(reportType) ? reportType.join(', ') : reportType;

    const reportRef = ref(database, 'reports');
    const newReport = {
      userId: uid,
      productName: productName || null,
      sellerName: sellerName || null,
      productId: req.body.productId || null,
      platform: req.body.platform || null,
      reportType: formattedReportType,
      description: description || null,
      evidence: evidence || null,
      upvotes: 0, // Initialize upvotes
      downvotes: 0, // Initialize downvotes
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const reportId = await push(reportRef, newReport);
    res.status(201).json({
      message: 'Report submitted successfully',
      reportId: reportId.key
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReports = async (req, res) => {
  try {
    const { uid } = req.user;
    
    const reportsRef = ref(database, 'reports');
    // Fetch all reports for the current user
    const reportsQuery = query(reportsRef, orderByChild('userId'), equalTo(uid));
    
    const snapshot = await get(reportsQuery);
    const reports = [];
    
    snapshot.forEach((childSnapshot) => {
      reports.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status, adminNotes } = req.body;
    
    const reportRef = ref(database, `reports/${reportId}`);
    const updates = {
      status,
      adminNotes,
      updatedAt: new Date().toISOString()
    };
    
    await update(reportRef, updates);
    res.status(200).json({ message: 'Report status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPublicReports = async (req, res) => {
  try {
    const reportsRef = ref(database, 'reports');
    // Fetch all reports, ordered by upvotes (or a combined score if preferred)
    const reportsQuery = query(reportsRef, orderByChild('upvotes')); 
    
    const snapshot = await get(reportsQuery);
    const reports = [];
    
    snapshot.forEach((childSnapshot) => {
      const report = childSnapshot.val();
      // Anonymize the report for public view (remove userId, etc.)
      const publicReport = {
        id: childSnapshot.key,
        productName: report.productName,
        sellerName: report.sellerName,
        reportType: report.reportType,
        description: report.description,
        evidence: report.evidence,
        upvotes: report.upvotes || 0,
        downvotes: report.downvotes || 0,
        createdAt: report.createdAt,
        // Do NOT include userId or any sensitive user info
      };
      reports.push(publicReport);
    });

    // Reverse to show higher upvotes first if desired
    res.status(200).json(reports.reverse()); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const upvoteReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { uid } = req.user;
    
    // Check if user has already voted
    const userVoteRef = ref(database, `votes/${reportId}/${uid}`);
    const userVoteSnapshot = await get(userVoteRef);
    
    if (userVoteSnapshot.exists()) {
      const currentVote = userVoteSnapshot.val();
      if (currentVote === 'upvote') {
        // User is removing their upvote
        await remove(userVoteRef);
        const reportRef = ref(database, `reports/${reportId}`);
        const reportSnapshot = await get(reportRef);
        const currentUpvotes = reportSnapshot.val().upvotes || 0;
        await update(reportRef, { upvotes: currentUpvotes - 1 });
        return res.status(200).json({ message: 'Upvote removed successfully' });
      } else if (currentVote === 'downvote') {
        // User is changing from downvote to upvote
        await set(userVoteRef, 'upvote');
        const reportRef = ref(database, `reports/${reportId}`);
        const reportSnapshot = await get(reportRef);
        const currentUpvotes = reportSnapshot.val().upvotes || 0;
        const currentDownvotes = reportSnapshot.val().downvotes || 0;
        await update(reportRef, { 
          upvotes: currentUpvotes + 1,
          downvotes: currentDownvotes - 1
        });
        return res.status(200).json({ message: 'Vote changed to upvote successfully' });
      }
    }

    // New upvote
    const reportRef = ref(database, `reports/${reportId}`);
    const reportSnapshot = await get(reportRef);

    if (!reportSnapshot.exists()) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Record the user's vote
    await set(userVoteRef, 'upvote');
    
    // Update the report's upvote count
    const currentUpvotes = reportSnapshot.val().upvotes || 0;
    await update(reportRef, { upvotes: currentUpvotes + 1 });

    res.status(200).json({ message: 'Report upvoted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const downvoteReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { uid } = req.user;
    
    // Check if user has already voted
    const userVoteRef = ref(database, `votes/${reportId}/${uid}`);
    const userVoteSnapshot = await get(userVoteRef);
    
    if (userVoteSnapshot.exists()) {
      const currentVote = userVoteSnapshot.val();
      if (currentVote === 'downvote') {
        // User is removing their downvote
        await remove(userVoteRef);
        const reportRef = ref(database, `reports/${reportId}`);
        const reportSnapshot = await get(reportRef);
        const currentDownvotes = reportSnapshot.val().downvotes || 0;
        await update(reportRef, { downvotes: currentDownvotes - 1 });
        return res.status(200).json({ message: 'Downvote removed successfully' });
      } else if (currentVote === 'upvote') {
        // User is changing from upvote to downvote
        await set(userVoteRef, 'downvote');
        const reportRef = ref(database, `reports/${reportId}`);
        const reportSnapshot = await get(reportRef);
        const currentUpvotes = reportSnapshot.val().upvotes || 0;
        const currentDownvotes = reportSnapshot.val().downvotes || 0;
        await update(reportRef, { 
          upvotes: currentUpvotes - 1,
          downvotes: currentDownvotes + 1
        });
        return res.status(200).json({ message: 'Vote changed to downvote successfully' });
      }
    }

    // New downvote
    const reportRef = ref(database, `reports/${reportId}`);
    const reportSnapshot = await get(reportRef);

    if (!reportSnapshot.exists()) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Record the user's vote
    await set(userVoteRef, 'downvote');
    
    // Update the report's downvote count
    const currentDownvotes = reportSnapshot.val().downvotes || 0;
    await update(reportRef, { downvotes: currentDownvotes + 1 });

    res.status(200).json({ message: 'Report downvoted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 