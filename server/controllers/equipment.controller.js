import Equipment from "../models/Equipment.js";

// Get all available equipment for rent
export const getAllEquipment = async (req, res) => {
  try {
    const equipmentList = await Equipment.find({ isAvailable: true }).sort({ createdAt: -1 });
    res.status(200).json(equipmentList);
  } catch (err) {
    console.error("Error fetching equipment:", err);
    res.status(500).json({ error: "Failed to fetch equipment" });
  }
};

// Get equipment owned by specific user
export const getMyEquipment = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const equipmentList = await Equipment.find({ ownerId }).sort({ createdAt: -1 });
    res.status(200).json(equipmentList);
  } catch (err) {
    console.error("Error fetching user equipment:", err);
    res.status(500).json({ error: "Failed to fetch your equipment" });
  }
};

// Add new equipment
export const addEquipment = async (req, res) => {
  try {
    const { name, description, pricePerHour, pricePerDay, image, ownerId, location } = req.body;
    
    if (!name || pricePerHour === undefined || pricePerHour === null || pricePerHour === "" || !ownerId || !location) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const hourlyRate = Number(pricePerHour);
    if (!Number.isFinite(hourlyRate) || hourlyRate < 0) {
      return res.status(400).json({ error: "Price per hour must be a non-negative number" });
    }

    const dailyRate = Number(pricePerDay) || 0;
    if (dailyRate < 0) {
      return res.status(400).json({ error: "Price per day must be a non-negative number" });
    }

    const newEquipment = new Equipment({
      name,
      description,
      pricePerHour: hourlyRate,
      pricePerDay: dailyRate,
      image,
      ownerId,
      location
    });

    const savedEquipment = await newEquipment.save();
    res.status(201).json(savedEquipment);
  } catch (err) {
    console.error("Error adding equipment:", err);
    res.status(500).json({ error: "Failed to add equipment" });
  }
};

// Update the hourly rate and/or image for an equipment listing
export const updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const { ownerId, pricePerHour, pricePerDay, image } = req.body;
    const equipment = await Equipment.findById(id);

    if (!equipment) {
      return res.status(404).json({ error: "Equipment not found" });
    }
    if (!ownerId || equipment.ownerId !== ownerId) {
      return res.status(403).json({ error: "You are not allowed to update this equipment" });
    }
    if (pricePerHour === undefined && pricePerDay === undefined && image === undefined) {
      return res.status(400).json({ error: "Provide a price or image to update" });
    }

    if (pricePerHour !== undefined) {
      const hourlyRate = Number(pricePerHour);
      if (!Number.isFinite(hourlyRate) || hourlyRate < 0) {
        return res.status(400).json({ error: "Price per hour must be a non-negative number" });
      }
      equipment.pricePerHour = hourlyRate;
    }
    if (pricePerDay !== undefined) {
      const dailyRate = Number(pricePerDay);
      if (!Number.isFinite(dailyRate) || dailyRate < 0) {
        return res.status(400).json({ error: "Price per day must be a non-negative number" });
      }
      equipment.pricePerDay = dailyRate;
    }
    if (image !== undefined) {
      if (typeof image !== "string" || image.length === 0) {
        return res.status(400).json({ error: "Image must be a non-empty string" });
      }
      equipment.image = image;
    }

    await equipment.save();
    return res.status(200).json(equipment);
  } catch (err) {
    console.error("Error updating equipment:", err);
    return res.status(500).json({ error: "Failed to update equipment" });
  }
};

// Delete equipment
export const deleteEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    await Equipment.findByIdAndDelete(id);
    res.status(200).json({ message: "Equipment deleted successfully" });
  } catch (err) {
    console.error("Error deleting equipment:", err);
    res.status(500).json({ error: "Failed to delete equipment" });
  }
};

// Toggle availability status
export const toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const equipment = await Equipment.findById(id);
    if (!equipment) return res.status(404).json({ error: "Equipment not found" });

    equipment.isAvailable = !equipment.isAvailable;
    await equipment.save();

    res.status(200).json(equipment);
  } catch (err) {
    console.error("Error toggling status:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
};
