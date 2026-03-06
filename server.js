// backend/server.js
// This is your backend server using Node.js + Express

const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors()); // Allows frontend to talk to backend
app.use(express.json()); // Allows reading JSON data

// 📦 DATABASE - In-memory (for demo)
// In production, use MongoDB, PostgreSQL, or Firebase
let eligibleUsers = [
  {
    username: 'cryptoking',
    wallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    nftCount: 15,
    eligible: true
  },
  {
    username: 'nftwhale',
    wallet: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    nftCount: 42,
    eligible: true
  },
  {
    username: 'degen420',
    wallet: '0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c',
    nftCount: 8,
    eligible: true
  }
];

// 🔍 ENDPOINT: Check if wallet is eligible
app.post('/api/check-eligibility', (req, res) => {
  const { username, wallet } = req.body;
  
  // Validate input
  if (!username || !wallet) {
    return res.status(400).json({ 
      error: 'Username and wallet required' 
    });
  }
  
  // Validate wallet format
  if (!wallet.startsWith('0x') || wallet.length !== 42) {
    return res.status(400).json({ 
      error: 'Invalid wallet address format' 
    });
  }
  
  // Check if user is in eligible list
  const user = eligibleUsers.find(
    u => u.wallet.toLowerCase() === wallet.toLowerCase()
  );
  
  if (user) {
    return res.json({
      eligible: true,
      username: user.username,
      wallet: user.wallet,
      nftCount: user.nftCount,
      message: 'Approved for Mint'
    });
  } else {
    return res.json({
      eligible: false,
      username: username,
      wallet: wallet,
      nftCount: 0,
      message: 'Requirements Not Met'
    });
  }
});

// 📝 ENDPOINT: Add new eligible user (admin only)
app.post('/api/add-user', (req, res) => {
  const { username, wallet, nftCount } = req.body;
  
  // In production, add authentication here!
  
  eligibleUsers.push({
    username,
    wallet,
    nftCount: nftCount || 0,
    eligible: true
  });
  
  res.json({ 
    success: true, 
    message: 'User added successfully' 
  });
});

// 📋 ENDPOINT: Get all eligible users (admin only)
app.get('/api/eligible-users', (req, res) => {
  // In production, add authentication here!
  res.json(eligibleUsers);
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
