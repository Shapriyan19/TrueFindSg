import { ref, push, get, update, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../config/firebase.js';

export const submitReport = async (req, res) => {
  try {
    const { uid } = req.user;
    const { productId, platform, reportType, description, evidence } = req.body;
    
    const reportRef = ref(database, 'reports');
    const newReport = {
      userId: uid,
      productId,
      platform,
      reportType,
      description,
      evidence,
      status: 'pending',
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
    const { status } = req.query;
    
    const reportsRef = ref(database, 'reports');
    let reportsQuery = query(reportsRef, orderByChild('userId'), equalTo(uid));
    
    if (status) {
      reportsQuery = query(reportsRef, orderByChild('status'), equalTo(status));
    }
    
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
    const { platform, reportType } = req.query;
    
    const reportsRef = ref(database, 'reports');
    let reportsQuery = query(reportsRef, orderByChild('status'), equalTo('verified'));
    
    const snapshot = await get(reportsQuery);
    const reports = [];
    
    snapshot.forEach((childSnapshot) => {
      const report = childSnapshot.val();
      if (
        (!platform || report.platform === platform) &&
        (!reportType || report.reportType === reportType)
      ) {
        // Anonymize the report
        const anonymizedReport = {
          id: childSnapshot.key,
          productId: report.productId,
          platform: report.platform,
          reportType: report.reportType,
          status: report.status,
          createdAt: report.createdAt,
          updatedAt: report.updatedAt
        };
        reports.push(anonymizedReport);
      }
    });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 