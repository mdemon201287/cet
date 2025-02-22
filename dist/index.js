"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const agencies_1 = __importDefault(require("./routes/agencies"));
const categories_1 = __importDefault(require("./routes/categories"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/agency-directory';
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve static files from the 'uploads' directory
app.use('/uploads', express_1.default.static('uploads'));
// Define your routes
app.use('/api/agencies', agencies_1.default);
app.use('/api/categories', categories_1.default);
app.get('/', (req, res) => {
    res.send('Hello World');
});
// Connect to MongoDB
mongoose_1.default.connect(MONGO_URI)
    .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch((error) => console.error('Error connecting to MongoDB:', error));
