import { ref, push, get, query, orderByChild, limitToLast } from 'firebase/database';
import { database } from '../config/firebase.js';
import axios from 'axios';

const CASE_API_URL = process.env.CASE_API_URL;
const IPOS_API_URL = process.env.IPOS_API_URL;

export const fetchLatestAlerts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const alertsRef = ref(database, 'alerts');
    const alertsQuery = query(alertsRef, orderByChild('timestamp'), limitToLast(parseInt(limit)));
    
    const snapshot = await get(alertsQuery);
    const alerts = [];
    
    snapshot.forEach((childSnapshot) => {
      alerts.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });

    res.status(200).json(alerts.reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const ingestAlerts = async (req, res) => {
  try {
    const [caseAlerts, iposAlerts] = await Promise.all([
      fetchCaseAlerts(),
      fetchIposAlerts()
    ]);

    const alertsRef = ref(database, 'alerts');
    const newAlerts = [...caseAlerts, ...iposAlerts];
    
    for (const alert of newAlerts) {
      await push(alertsRef, {
        ...alert,
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      message: 'Alerts ingested successfully',
      count: newAlerts.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const fetchCaseAlerts = async () => {
  try {
    const response = await axios.get(CASE_API_URL);
    return response.data.alerts.map(alert => ({
      source: 'CASE',
      title: alert.title,
      description: alert.description,
      severity: alert.severity,
      category: alert.category,
      url: alert.url
    }));
  } catch (error) {
    console.error('CASE API error:', error);
    return [];
  }
};

const fetchIposAlerts = async () => {
  try {
    const response = await axios.get(IPOS_API_URL);
    return response.data.alerts.map(alert => ({
      source: 'IPOS',
      title: alert.title,
      description: alert.description,
      severity: alert.severity,
      category: alert.category,
      url: alert.url
    }));
  } catch (error) {
    console.error('IPOS API error:', error);
    return [];
  }
}; 