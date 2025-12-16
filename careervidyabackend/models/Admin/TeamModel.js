import mongoose from "mongoose";

const teamSchema = new new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      // required: true,
      trim: true,
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String, // store the image URL or file path
      required: false,
      default: "", // optional default value
    },
    
    // --- NEW FIELDS ADDED HERE ---
    
    // Added based on user request
    expertise: {
      type: String,
      required: true, 
      trim: true,
    },
    
    // Added based on user request - I renamed 'state' to 'location' to better reflect your request
    location: {
      type: String,
      required: true, // I made this required; you can change to false if needed
      trim: true,
    },

    // --- PREVIOUSLY ADDED FIELDS BELOW ---

    fee: {
      type: Number,
      required: false, 
      min: 0,
      default: 0, 
    },
    education: {
      type: String,
      required: false,
      trim: true,
      default: "Not Specified",
    },
    mobileNumber: {
      type: String, 
      required: true, 
      trim: true,
      unique: true, 
    },
    
  },
  {
    timestamps: true, 
  }
);

const Team = mongoose.model("Team", teamSchema);

export default Team;