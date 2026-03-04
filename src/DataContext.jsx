import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const DataContext = createContext();

// API Base URL
const API_URL = "http://localhost:5000/api";

// --- Helpers ---
export const formatINR = (num) => {
  const n = Number(num) || 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
};

export const formatDT = (iso) => {
  const d = new Date(iso);
  return isNaN(d) ? "-" : d.toLocaleString();
};

export const monthKey = (d = new Date()) => d.toISOString().slice(0, 7);
export const monthLabel = (d = new Date()) =>
  d.toLocaleString(undefined, { month: "long", year: "numeric" });

export const DataProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // Data States
  const [users, setUsers] = useState([]);
  const [funds, setFunds] = useState({ balance: 0 });
  const [complaints, setComplaints] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [bills, setBills] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [poll, setPoll] = useState(null);
  const [maintenance, setMaintenance] = useState({
    defaultAmount: 2500,
    records: {},
  });

  // Axios Interceptor for Token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(currentUser));
      fetchInitialData();
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [token]);

  // Fetch Dashboard Data
  const fetchInitialData = async () => {
    try {
      const res = await axios.get(`${API_URL}/data`);
      setUsers(res.data.users);
      setFunds(res.data.funds);
      setComplaints(res.data.complaints);
      setUpdates(res.data.updates);
      setBills(res.data.bills);
      setSuggestions(res.data.suggestions);
      setPoll(res.data.poll);

      // Fetch maintenance for current month
      fetchMaintenance(monthKey());
    } catch (err) {
      console.error("Error loading data", err);
      if (err.response?.status === 401) logout();
    }
  };

  const fetchMaintenance = async (mk) => {
    try {
      const res = await axios.get(`${API_URL}/maintenance/${mk}`);
      setMaintenance(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Auth Actions ---
  const login = async (email, password, isAdmin) => {
    try {
      // Special check for hardcoded admin login in UI
      const payload = { email, password, isAdmin };
      const res = await axios.post(`${API_URL}/login`, payload);
      setToken(res.data.token);
      setCurrentUser(res.data.user);
      return true;
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
      return false;
    }
  };

  const signup = async (userObj) => {
    try {
      await axios.post(`${API_URL}/register`, userObj);
      // Auto login after signup
      return login(userObj.email, userObj.password, false);
    } catch (err) {
      alert(err.response?.data?.message || "Signup Failed");
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
  };

  // --- Data Actions ---

  const updateFunds = async (amount, updatedBy) => {
    try {
      const res = await axios.post(`${API_URL}/funds`, {
        balance: amount,
        updatedBy,
      });
      setFunds(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addComplaint = async (text, user) => {
    try {
      const payload = {
        text,
        name: user.name,
        flatNo: user.flatNo,
        userEmail: user.email,
      };
      const res = await axios.post(`${API_URL}/complaints`, payload);
      setComplaints([res.data, ...complaints]);
    } catch (err) {
      console.error(err);
    }
  };

  const updateComplaintStatus = async (id, newStatus) => {
    try {
      const res = await axios.put(`${API_URL}/complaints/${id}`, {
        status: newStatus,
      });
      setComplaints(complaints.map((c) => (c._id === id ? res.data : c)));
    } catch (err) {
      console.error(err);
    }
  };

  const addUpdate = async (text) => {
    try {
      const res = await axios.post(`${API_URL}/updates`, {
        text,
        author: "Admin",
      });
      setUpdates([res.data, ...updates]);
    } catch (err) {
      console.error(err);
    }
  };

  const addSuggestion = async (text, user) => {
    try {
      const res = await axios.post(`${API_URL}/suggestions`, {
        text,
        name: user.name,
        flatNo: user.flatNo,
      });
      setSuggestions([res.data, ...suggestions]);
    } catch (err) {
      console.error(err);
    }
  };

  const addBill = async (billObj) => {
    try {
      const res = await axios.post(`${API_URL}/bills`, billObj);
      setBills([res.data, ...bills]);
    } catch (err) {
      console.error(err);
    }
  };

  const savePoll = async (newPoll) => {
    try {
      const res = await axios.post(`${API_URL}/poll`, newPoll);
      setPoll(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const votePoll = async (optionId, userEmail) => {
    try {
      // In DB we store option._id, but UI might be passing generated IDs.
      // Ensure UI passes the correct mongoose SubDocument ID if available, or handle mapping.
      // For this implementation, we assume optionId matches.
      const res = await axios.put(`${API_URL}/poll/vote`, {
        pollId: poll._id,
        optionId,
        userEmail,
      });
      setPoll(res.data);
    } catch (err) {
      alert(err.response?.data?.msg || "Vote failed");
    }
  };

  const closePoll = async () => {
    if (!poll) return;
    try {
      const res = await axios.put(`${API_URL}/poll/close/${poll._id}`);
      setPoll(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateMaintenanceStatus = async (email, status, extra = {}) => {
    try {
      const mk = monthKey();
      const payload = { monthKey: mk, email, status, ...extra };
      const res = await axios.post(`${API_URL}/maintenance`, payload);
      // We need to merge the new record into local state for immediate UI update
      // But the API returns the whole maintenance object for that month
      setMaintenance(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DataContext.Provider
      value={{
        currentUser,
        users,
        funds,
        complaints,
        updates,
        bills,
        suggestions,
        poll,
        maintenance,
        login,
        signup,
        logout,
        updateFunds,
        addComplaint,
        updateComplaintStatus,
        addUpdate,
        addSuggestion,
        addBill,
        savePoll,
        votePoll,
        closePoll,
        updateMaintenanceStatus,
      }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
