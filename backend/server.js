const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
});

const adminAuthRoutes = require('./routes/auth/admin.auth.routes');
const facultyAuthRoutes = require('./routes/auth/faculty.auth.routes');
const studentAuthRoutes = require('./routes/auth/student.auth.routes');

app.use('/api/admin', adminAuthRoutes);
app.use('/api/student', studentAuthRoutes);
app.use('/api/faculty', facultyAuthRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



const adminCrudRoutes = require('./routes/admin.crud.routes');
app.use('/admin', adminCrudRoutes);
app.use('/api/admin', adminCrudRoutes);

const facultyCrudRoutes = require('./routes/faculty.crud.routes');

app.use('/faculty', facultyCrudRoutes);

const studentCrudRoutes = require('./routes/student.crud.routes');
app.use('/student', studentCrudRoutes);

const analyticsRoutes = require('./routes/analytics.routes');
app.use('/analytics', analyticsRoutes);

const studentAnalyticsRoutes = require('./routes/student.analytics.routes');
app.use('/student', studentAnalyticsRoutes);

const facultyAnalyticsRoutes = require('./routes/faculty.analytics.routes');
app.use('/faculty', facultyAnalyticsRoutes);

const adminDashboardRoutes = require('./routes/admin.dashboard.routes');
app.use('/api/admin/dashboard', adminDashboardRoutes);

const reportRoutes = require('./routes/report.routes');
app.use('/reports', reportRoutes);


app.get('/', (req, res) => {
  res.send('Backend running');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
