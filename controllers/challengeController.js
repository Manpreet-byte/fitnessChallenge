const mongoose = require("mongoose");
const Challenge = require("../models/Challenge");

const isValidDate = (value) => {
  if (!value) return true;
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
};

const normalizeStatus = (value) => {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
};

const createChallenge = async (req, res, next) => {
  try {
    const { title, description, startDate, endDate, target, progress, status } = req.body;

    if (!title || target === undefined) {
      return res.status(400).json({ message: "Title and target are required" });
    }

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      return res.status(400).json({ message: "Please provide valid startDate/endDate" });
    }

    if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      if (e < s) {
        return res.status(400).json({ message: "endDate cannot be before startDate" });
      }
    }

    const allowedStatus = ["active", "completed"];
    const safeStatus = status ? normalizeStatus(status) : "active";
    if (safeStatus && !allowedStatus.includes(safeStatus)) {
      return res.status(400).json({ message: "Status must be active or completed" });
    }

    const challenge = await Challenge.create({
      user: req.user.id,
      title,
      description: description || "",
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      target,
      progress: progress === undefined ? 0 : progress,
      status: safeStatus || "active",
    });

    res.status(201).json({ message: "Challenge created successfully", challenge });
  } catch (error) {
    next(error);
  }
};

const getChallenges = async (req, res, next) => {
  try {
    const challenges = await Challenge.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .exec();

    res.status(200).json({ count: challenges.length, challenges });
  } catch (error) {
    next(error);
  }
};

const getChallengeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const challenge = await Challenge.findOne({ _id: id, user: req.user.id });
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    res.status(200).json({ challenge });
  } catch (error) {
    next(error);
  }
};

const updateChallenge = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const challenge = await Challenge.findOne({ _id: id, user: req.user.id });
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const { title, description, startDate, endDate, target, progress, status } = req.body;

    if (title !== undefined) challenge.title = title;
    if (description !== undefined) challenge.description = description;
    if (target !== undefined) challenge.target = target;
    if (progress !== undefined) challenge.progress = progress;

    if (startDate !== undefined) {
      if (!isValidDate(startDate)) return res.status(400).json({ message: "Invalid startDate" });
      challenge.startDate = startDate || undefined;
    }

    if (endDate !== undefined) {
      if (!isValidDate(endDate)) return res.status(400).json({ message: "Invalid endDate" });
      challenge.endDate = endDate || undefined;
    }

    if (challenge.startDate && challenge.endDate) {
      if (new Date(challenge.endDate) < new Date(challenge.startDate)) {
        return res.status(400).json({ message: "endDate cannot be before startDate" });
      }
    }

    if (status !== undefined) {
      const allowedStatus = ["active", "completed"];
      const safeStatus = normalizeStatus(status);
      if (!allowedStatus.includes(safeStatus)) {
        return res.status(400).json({ message: "Status must be active or completed" });
      }
      challenge.status = safeStatus;
    }

    const updated = await challenge.save();
    res.status(200).json({ message: "Challenge updated successfully", challenge: updated });
  } catch (error) {
    next(error);
  }
};

const deleteChallenge = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const challenge = await Challenge.findOne({ _id: id, user: req.user.id });
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    await challenge.deleteOne();
    res.status(200).json({ message: "Challenge deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const updateChallengeProgress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    if (progress === undefined || Number.isNaN(Number(progress))) {
      return res.status(400).json({ message: "Progress must be a number" });
    }

    const challenge = await Challenge.findOne({ _id: id, user: req.user.id });
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    challenge.progress = Number(progress);

    if (challenge.progress >= challenge.target) {
      challenge.status = "completed";
    }

    const updated = await challenge.save();
    res.status(200).json({ message: "Progress updated successfully", challenge: updated });
  } catch (error) {
    next(error);
  }
};

const getActiveChallenges = async (req, res, next) => {
  try {
    const challenges = await Challenge.find({ user: req.user.id, status: "active" })
      .sort({ createdAt: -1 })
      .exec();
    res.status(200).json({ count: challenges.length, challenges });
  } catch (error) {
    next(error);
  }
};

const getCompletedChallenges = async (req, res, next) => {
  try {
    const challenges = await Challenge.find({ user: req.user.id, status: "completed" })
      .sort({ createdAt: -1 })
      .exec();
    res.status(200).json({ count: challenges.length, challenges });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createChallenge,
  getChallenges,
  getChallengeById,
  updateChallenge,
  deleteChallenge,
  updateChallengeProgress,
  getActiveChallenges,
  getCompletedChallenges,
};
