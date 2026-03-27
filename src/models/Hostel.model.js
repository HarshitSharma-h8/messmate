const hostelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    institutionName: {
      type: String,
      required: true,
      trim: true,
    },

    // code: {
    //   type: String,
    //   unique: true,
    //   trim: true,
    // },

    hostelType: {
      type: String,
      enum: ["BOYS", "GIRLS", "MIXED"],
    },

    capacity: {
      type: Number,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);