const mongoose = require("mongoose");

const Profile = require("./model")
const User = require("../login/model")

const GetProfile = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Profile.findById(id)

    res.status(200).json(result)
  } catch(error) {
    res.status(400).json({ error: error.message });
  }
}

const CreateProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const profile = await Profile.create({...req.body})

    await User.findByIdAndUpdate(
      { _id: id },
      { $set: { "profile": profile.id }},
      { new: true } 
    );

    res.status(201).json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const UpdateProfile = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(req.body);
    console.log(id);
    const profile = await Profile.findByIdAndUpdate(
      { _id: id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  GetProfile,
  CreateProfile,
  UpdateProfile
};
