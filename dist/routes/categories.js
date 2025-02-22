"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const Agency_1 = __importDefault(require("../models/Agency"));
const router = express_1.default.Router();
// Multer configuration for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = (0, multer_1.default)({ storage });
// Add a new agency
router.post('/', upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, location, category, minBudget, hourlyRate, teamSize, description } = req.body;
        if (!req.file) {
            res.status(400).json({ message: 'File upload is required.' });
            return;
        }
        const newAgency = new Agency_1.default({
            name,
            location,
            category,
            minBudget,
            hourlyRate,
            teamSize,
            description,
            imageUrl: `/uploads/${req.file.filename}`,
        });
        yield newAgency.save();
        res.status(201).json(newAgency);
    }
    catch (error) {
        console.error('Error creating agency:', error);
        res.status(500).json({ message: 'Failed to add agency.' });
    }
}));
exports.default = router;
