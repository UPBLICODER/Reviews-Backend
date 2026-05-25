import Company from "../models/Company.js";

export const createCompany = async (req, res) => {
  try {
    const { name, location, city, foundedOn } = req.body;

    if (!name || !location || !city || !foundedOn) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    
    const company = await Company.create(req.body);

    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCompanies = async (req, res) => {
  try {
    const { search = "", sort = "name" } = req.query;

    const companies = await Company.find({
      name: { $regex: search, $options: "i" },
    }).sort(sort);

    res.status(200).json({
      success: true,
      data: companies,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
