const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
    // Verify the token first
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Check if the session exists and is active
    const session = await prisma.userSession.findFirst({
      where: { 
        userId: verified.userId,
        sessionToken: token, // Match the exact token
        expiresAt: { gt: new Date() } // Ensure not expired
      }
    });

    // If no session found, reject the request
    if (!session) {
      return res.status(401).json({ 
        message: 'Session has been invalidated or expired',
        reason: 'No active session found'
      });
    }

    // Attach user information to the request
    req.user = verified;
    req.sessionId = session.id; // Attach the actual session ID
    
    next();
  } catch (error) {
    console.error('Token authentication error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }
    
    return res.status(500).json({ 
      message: 'Authentication error',
      code: 'AUTH_ERROR'
    });
  }
};

// When generating token, include the full session token
const generateToken = (user, sessionToken) => {
  return jwt.sign(
    { 
      userId: user.id, 
      username: user.username,
      role: user.role
    }, 
    process.env.JWT_SECRET, 
    { 
      expiresIn: '1h' 
    }
  );
};

// Logout route example
const logoutRoute = async (req, res) => {
  try {
    // Delete the specific session
    await prisma.userSession.delete({
      where: { 
        id: req.sessionId // Use the session ID from middleware
      }
    });

    res.json({ 
      message: 'Logged out successfully',
      sessionId: req.sessionId 
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Error during logout' });
  }
};
const authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.some(
      role => role.toLowerCase() === req.user.role.toLowerCase()
    )) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    next();
  };
};



module.exports = { 
  authenticateToken, 
  authorizeRoles,
  generateToken
};