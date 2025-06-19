"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const validation_2 = require("../middleware/validation");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get("/profile", user_1.userController.getProfile);
router.put("/profile", (0, validation_1.validate)(validation_2.updateProfileSchema), user_1.userController.updateProfile);
router.get("/stats", user_1.userController.getStats);
router.post("/credits/add", user_1.userController.addCredits);
router.post("/plan/upgrade", user_1.userController.upgradePlan);
router.post("/verify-email", user_1.userController.verifyEmail);
router.delete("/account", user_1.userController.deleteAccount);
exports.default = router;
//# sourceMappingURL=user.js.map