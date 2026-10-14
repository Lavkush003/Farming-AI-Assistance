import express from "express";
import { 
  getAllEquipment, 
  getMyEquipment, 
  addEquipment, 
  deleteEquipment, 
  updateEquipment,
  toggleAvailability 
} from "../controllers/equipment.controller.js";

const router = express.Router();

router.get("/", getAllEquipment);
router.get("/my-equipment/:ownerId", getMyEquipment);
router.post("/", addEquipment);
router.patch("/:id", updateEquipment);
router.delete("/:id", deleteEquipment);
router.patch("/:id/toggle", toggleAvailability);

export default router;
