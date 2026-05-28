const express = require("express");
const { protect } = require("../middleware/auth");
const {
  createChallenge,
  getChallenges,
  getChallengeById,
  updateChallenge,
  deleteChallenge,
  updateChallengeProgress,
  getActiveChallenges,
  getCompletedChallenges,
} = require("../controllers/challengeController");

const router = express.Router();

router.use(protect);

router.get("/", getChallenges);
router.get("/active", getActiveChallenges);
router.get("/completed", getCompletedChallenges);
router.get("/:id", getChallengeById);
router.post("/", createChallenge);
router.put("/:id", updateChallenge);
router.patch("/:id/progress", updateChallengeProgress);
router.delete("/:id", deleteChallenge);

module.exports = router;
