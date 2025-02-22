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
const fs_1 = __importDefault(require("fs"));
const Agency_1 = __importDefault(require("../models/Agency"));
const router = express_1.default.Router();
// Ensure the 'uploads' directory exists
const uploadDir = 'uploads';
if (!fs_1.default.existsSync(uploadDir))
    fs_1.default.mkdirSync(uploadDir);
const upload = (0, multer_1.default)({ dest: uploadDir });
// POST: Create a new agency
router.post('/', upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, category, location, teamSize, rate, description, rating, featured } = req.body;
        const newAgency = new Agency_1.default({
            name,
            category,
            location,
            teamSize: Number(teamSize),
            rate,
            description,
            image: ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) || '',
            rating: Number(rating),
            featured: featured === 'true',
        });
        yield newAgency.save();
        res.status(201).json(newAgency);
    }
    catch (error) {
        console.error('Error creating agency:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
// PUT: Update an existing agency by ID
router.put('/:id', upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateFields = Object.assign(Object.assign({}, req.body), { teamSize: Number(req.body.teamSize), rating: Number(req.body.rating), featured: req.body.featured === 'true' });
        if (req.file)
            updateFields.image = req.file.path;
        const updatedAgency = yield Agency_1.default.findByIdAndUpdate(req.params.id, updateFields, { new: true });
        if (!updatedAgency) {
            res.status(404).json({ message: 'Agency not found' });
            return;
        }
        res.json(updatedAgency);
    }
    catch (error) {
        console.error('Error updating agency:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
// GET: Fetch all agencies
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agencies = yield Agency_1.default.find();
        res.json(agencies);
    }
    catch (error) {
        console.error('Error fetching agencies:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
// GET: Fetch an agency by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agency = yield Agency_1.default.findById(req.params.id);
        if (!agency) {
            res.status(404).json({ message: 'Agency not found' });
            return;
        }
        res.json(agency);
    }
    catch (error) {
        console.error('Error fetching agency:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
// GET: Fetch featured agencies
router.get('/featured', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const featuredAgencies = yield Agency_1.default.find({ featured: true });
        res.json(featuredAgencies);
    }
    catch (error) {
        console.error('Error fetching featured agencies:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
// DELETE: Delete an agency by ID
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedAgency = yield Agency_1.default.findByIdAndDelete(req.params.id);
        if (!deletedAgency) {
            res.status(404).json({ message: 'Agency not found' });
            return;
        }
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting agency:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
// GET: Fetch distinct categories
router.get('/categories', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield Agency_1.default.distinct('category');
        res.json(categories);
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
// GET: Fetch distinct subcategories under a category
router.get('/subcategories/:category', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.params;
    try {
        const subCategories = yield Agency_1.default.distinct('subCategory', { category });
        res.json(subCategories);
    }
    catch (error) {
        console.error('Error fetching subcategories:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
// GET: Fetch agencies by category and subcategory
router.get('/agencies/:category/:subCategory', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, subCategory } = req.params;
    try {
        const agencies = yield Agency_1.default.find({ category, subCategory });
        res.json(agencies);
    }
    catch (error) {
        console.error('Error fetching agencies:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
// POST: Add a new category
router.post('/categories', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, category, subCategory } = req.body;
    if (!name || !category) {
        res.status(400).json({ message: 'Name and category are required.' });
        return;
    }
    try {
        const newCategory = new Agency_1.default({
            name,
            category,
            subCategory,
        });
        yield newCategory.save();
        res.status(201).json({ message: 'Category added successfully!', newCategory });
    }
    catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
exports.default = router;
