"use strict";
// src/controllers/agencyController.ts
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
exports.deleteAgency = exports.updateAgency = exports.getAgency = exports.getAgencies = void 0;
const Agency_1 = __importDefault(require("../models/Agency")); // Make sure the path is correctly referenced to the model
const getAgencies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agencies = yield Agency_1.default.find();
        res.status(200).json(agencies);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch agencies' });
    }
});
exports.getAgencies = getAgencies;
const getAgency = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agency = yield Agency_1.default.findById(req.params.id);
        if (!agency) {
            return res.status(404).json({ message: 'Agency not found' });
        }
        res.status(200).json(agency);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch agency' });
    }
});
exports.getAgency = getAgency;
const createAgency = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, category, description, location, teamSize, rate, rating } = req.body;
    // Validate teamSize to ensure it's a number
    const parsedTeamSize = Number(teamSize);
    if (isNaN(parsedTeamSize)) {
        return res.status(400).json({ message: "teamSize must be a number" });
    }
    const newAgency = new Agency_1.default({
        name,
        category,
        description,
        location,
        teamSize: parsedTeamSize, // Use parsed number
        rate,
        rating: Number(rating) || 0,
        image: req.file ? req.file.path : '', // Use the image path if uploaded
    });
    try {
        const savedAgency = yield newAgency.save();
        res.status(201).json(savedAgency);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create agency" });
    }
});
const updateAgency = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, category, description, location, teamSize, rate, rating } = req.body;
    // Validate and parse fields as needed
    const updateFields = {
        name,
        category,
        description,
        location,
        rate,
        rating: Number(rating) || 0,
    };
    // Parse teamSize if provided
    if (teamSize !== undefined) {
        const parsedTeamSize = Number(teamSize);
        if (isNaN(parsedTeamSize)) {
            return res.status(400).json({ message: "teamSize must be a number" });
        }
        updateFields.teamSize = parsedTeamSize;
    }
    // Include image path if a new file is uploaded
    if (req.file) {
        updateFields.image = req.file.path;
    }
    try {
        const updatedAgency = yield Agency_1.default.findByIdAndUpdate(req.params.id, updateFields, { new: true });
        if (!updatedAgency) {
            return res.status(404).json({ message: 'Agency not found' });
        }
        res.status(200).json(updatedAgency);
    }
    catch (error) {
        console.error('Error updating agency:', error);
        res.status(500).json({ message: 'Failed to update agency' });
    }
});
exports.updateAgency = updateAgency;
const deleteAgency = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Attempting to delete agency with ID:', req.params.id);
        const deletedAgency = yield Agency_1.default.findByIdAndDelete(req.params.id);
        if (!deletedAgency) {
            console.log('Agency not found');
            return res.status(404).json({ message: 'Agency not found' });
        }
        console.log('Agency deleted successfully');
        res.status(200).json({ message: 'Agency deleted successfully' });
    }
    catch (error) {
        console.error('Error in deleteAgency:', error);
        res.status(500).json({ message: 'Failed to delete agency' });
    }
});
exports.deleteAgency = deleteAgency;
