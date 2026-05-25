import Review from "../models/Review.js";
import Company from "../models/Company.js";

// CREATE REVIEW
export const createReview = async (req, res) => {
  try {
    const { companyId, fullName, subject, reviewText, rating } = req.body;

    // Validation
    if (!companyId || !fullName || !subject || !reviewText || !rating) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check company exists
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    // Create review
    const review = await Review.create({
      companyId,
      fullName,
      subject,
      reviewText,
      rating,
    });

    // Recalculate ratings
    const reviews = await Review.find({
      companyId,
    });

    const totalRatings = reviews.reduce((acc, item) => acc + item.rating, 0);

    const averageRating = totalRatings / reviews.length;

    // Update company
    await Company.findByIdAndUpdate(
      companyId,
      {
        averageRating: Number(averageRating.toFixed(1)),
        totalReviews: reviews.length,
      },
      { new: true },
    );

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// GET REVIEWS BY COMPANY
export const getReviewsByCompany = async (req, res) => {
  try {
    const { sort = "latest" } = req.query;

    let sortOption = {
      createdAt: -1,
    };

    if (sort === "oldest") {
      sortOption = {
        createdAt: 1,
      };
    }

    if (sort === "rating-high") {
      sortOption = {
        rating: -1,
      };
    }

    if (sort === "rating-low") {
      sortOption = {
        rating: 1,
      };
    }

    const reviews = await Review.find({
      companyId: req.params.companyId,
    }).sort(sortOption);

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
