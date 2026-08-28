import Finance from "../models/Finance.js";

export const getFinances = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const records = await Finance.find({ sellerId }).sort({ date: -1 });
    res.status(200).json(records);
  } catch (err) {
    console.error("Error fetching finances:", err);
    res.status(500).json({ error: "Failed to fetch finances" });
  }
};

export const addFinanceRecord = async (req, res) => {
  try {
    const { sellerId, type, amount, description } = req.body;
    
    if (!sellerId || !type || !amount || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newRecord = new Finance({ sellerId, type, amount, description });
    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (err) {
    console.error("Error adding finance record:", err);
    res.status(500).json({ error: "Failed to add record" });
  }
};

export const deleteFinanceRecord = async (req, res) => {
  try {
    const { id } = req.params;
    await Finance.findByIdAndDelete(id);
    res.status(200).json({ message: "Record deleted" });
  } catch (err) {
    console.error("Error deleting finance record:", err);
    res.status(500).json({ error: "Failed to delete record" });
  }
};
