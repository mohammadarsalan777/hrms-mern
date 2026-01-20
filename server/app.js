import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN, // Removed trailing slash
    // credentials: true, // Note: 'credentials' not 'withCredentials' on server
}));

// Cookie parser
app.use(cookieParser());

// Security headers with helmet
// app.use(helmet({
//     crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin requests
// }));

// Routes
import employeeRoutes from './routes/employeeAuth.routes.js';
app.use('/api/v1/auth/employees', employeeRoutes);

export { app };