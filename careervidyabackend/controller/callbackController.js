import CallbackRequest from "../models/Admin/CallbackRequest.js";


// ==========================================
// ✅ CREATE - Naya request banane ke liye
// ==========================================
export const createRequest = async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobileNumber,
      gender,
      course,
      state,
      fullAddress,
      inquiryType,
      preferredDate,
      preferredTime
    } = req.body;

    if (!fullName || !email || !mobileNumber || !course || !state) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields."
      });
    }

    const newRequest = new CallbackRequest({
      fullName,
      email,
      mobileNumber,
      gender,
      course,
      state,
      fullAddress,
      inquiryType: inquiryType || 'Request Call Back',
      preferredDate: preferredDate || null,
      preferredTime: preferredTime || null
    });

    await newRequest.save();

    res.status(201).json({
      success: true,
      message: "Request submitted successfully!",
      data: newRequest
    });

  } catch (error) {
    console.error("Error in createRequest:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// ==========================================
// ✅ READ ALL - Saare requests dekhne ke liye
// ==========================================
export const getAllRequests = async (req, res) => {
  try {
    const requests = await CallbackRequest.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ==========================================
// ✅ READ ONE - Single request ID se dekhne ke liye
// ==========================================
export const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await CallbackRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found"
      });
    }

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ==========================================
// ✅ UPDATE - Request update karne ke liye
// ==========================================
export const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedRequest = await CallbackRequest.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        message: "Request not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Request updated successfully",
      data: updatedRequest
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ==========================================
// ✅ DELETE - Request delete karne ke liye
// ==========================================
export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRequest = await CallbackRequest.findByIdAndDelete(id);

    if (!deletedRequest) {
      return res.status(404).json({
        success: false,
        message: "Request not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Request deleted successfully",
      data: deletedRequest
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ==========================================
// ✅ BONUS - Status update karne ke liye (Admin ke liye)
// ==========================================
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await CallbackRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};