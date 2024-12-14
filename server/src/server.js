const express = require('express');
const cors = require('cors');

const { errorHandler } = require('./middleware/error.middleware');
const { authenticateToken } = require('./utils/verify');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/roles', authenticateToken, require('./routes/user/userRole.routes'));
app.use('/api/v1/users', authenticateToken, require('./routes/user/user.routes'));
app.use('/api/v1/permissions', authenticateToken, require('./routes/user/userPermission.routes'));
app.use('/api/v1/user-activity-logs', authenticateToken, require('./routes/user/userActivityLogRoutes'));
app.use('/api/v1/password-reset-tokens', authenticateToken, require('./routes/user/passwordResetTokenRoutes'));
app.use('/api/v1/sessions',require('./routes/user/auth.routes'))
app.use('/api/v1/user-sessions', authenticateToken,require('./routes/user/userSessionRoutes'))
app.use('/api/v1', authenticateToken,require('./utils/profileupload'))
app.use('/api/v1/smtp-details', authenticateToken,require('./routes/user/smtp.routes'));
// Error handling
app.use(errorHandler);
app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
 