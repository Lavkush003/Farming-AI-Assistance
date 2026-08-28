import express from "express";
import { 
  getAllEquipment, 
  getMyEquipment, 
  addEquipment, 
  deleteEquipment, 
  toggleAvailability 
} from "../controllers/equipment.controller.js";

const router = express.Router();

router.get("/", getAllEquipment);
router.get("/my-equipment/:ownerId", getMyEquipment);
router.post("/", addEquipment);
router.delete("/:id", deleteEquipment);
router.patch("/:id/toggle", toggleAvailability);

export default router;
