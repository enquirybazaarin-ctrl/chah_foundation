"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const error_middleware_1 = require("./middleware/error.middleware");
const errors_1 = require("./utils/errors");
BigInt.prototype.toJSON = function () { return this.toString(); };
const app = (0, express_1.default)();
// Security & Parsing Middleware
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" } // Allow serving images cross-origin
}));
const allowedOrigins = [env_1.env.FRONTEND_URL, env_1.env.ADMIN_CORS_ORIGIN].filter(Boolean);
const devOrigins = [...allowedOrigins, 'http://localhost:3000', 'http://localhost:3001'];
app.use((0, cors_1.default)({
    origin: env_1.env.NODE_ENV === 'production' ? allowedOrigins : devOrigins,
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
// Razorpay Webhook requires raw body buffer for HMAC verification before global express.json()
const payment_routes_1 = __importDefault(require("./modules/payments/payment.routes"));
app.use('/api/v1/payments', express_1.default.raw({ type: 'application/json' }), payment_routes_1.default);
app.use(express_1.default.json({ limit: '10kb' }));
app.use((0, morgan_1.default)(env_1.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
// Serve uploaded static files
const path_1 = __importDefault(require("path"));
app.use('/media', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// Base API Routing Foundation
const apiRouter = express_1.default.Router();
app.get('/', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Welcome to CHAH Foundation API' });
});
apiRouter.get('/', (req, res) => {
    res.status(200).json({ status: 'success', message: 'CHAH Foundation API v1 is running' });
});
app.use('/api/v1', apiRouter);
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
apiRouter.use('/auth', auth_routes_1.default);
const donor_routes_1 = __importDefault(require("./modules/donors/donor.routes"));
apiRouter.use('/donors', donor_routes_1.default);
const donation_routes_1 = __importDefault(require("./modules/donations/donation.routes"));
apiRouter.use('/donations', donation_routes_1.default);
const category_routes_1 = __importDefault(require("./modules/campaigns/category.routes"));
apiRouter.use('/campaign-categories', category_routes_1.default);
const campaign_routes_1 = __importDefault(require("./modules/campaigns/campaign.routes"));
apiRouter.use('/campaigns', campaign_routes_1.default);
const media_routes_1 = __importDefault(require("./modules/media/media.routes"));
apiRouter.use('/media', media_routes_1.default);
const album_routes_1 = __importDefault(require("./modules/media/album.routes"));
apiRouter.use('/albums', album_routes_1.default);
const project_routes_1 = __importDefault(require("./modules/projects/project.routes"));
apiRouter.use('/projects', project_routes_1.default);
const testimonial_routes_1 = __importDefault(require("./modules/testimonials/testimonial.routes"));
apiRouter.use('/testimonials', testimonial_routes_1.default);
const faq_routes_1 = __importDefault(require("./modules/faqs/faq.routes"));
apiRouter.use('/faqs', faq_routes_1.default);
const metric_routes_1 = __importDefault(require("./modules/metrics/metric.routes"));
apiRouter.use('/impact-metrics', metric_routes_1.default);
const cms_routes_1 = __importDefault(require("./modules/cms/cms.routes"));
apiRouter.use('/cms', cms_routes_1.default);
const operations_routes_1 = __importDefault(require("./modules/operations/operations.routes"));
apiRouter.use('/operations', operations_routes_1.default);
// Health check endpoint (checks application and database readiness)
apiRouter.get('/health', async (req, res, next) => {
    try {
        // Ping DB to ensure connection is alive
        await database_1.prisma.$queryRaw `SELECT 1`;
        res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    }
    catch {
        next(new errors_1.AppError('Database connection failed', 503));
    }
});
// Not Found Handler
app.use((req, res, next) => {
    next(new errors_1.AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// Centralized error-handling foundation
app.use(error_middleware_1.errorHandler);
// Initialize Event Listeners
require("./events/donation.listeners");
exports.default = app;
