import Profile from '../models/Profile.js';

const toHttpsUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  return url.replace(/^http:\/\//i, 'https://');
};

const getUploadedFileUrl = (file) => {
  return toHttpsUrl(file?.secure_url || file?.path || file?.url || null);
};

const getProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({}); // Create default profile if none exists
    }

    // Keep old stored URLs safe on HTTPS frontends.
    if (profile.profileImage) profile.profileImage = toHttpsUrl(profile.profileImage);
    if (profile.resumeUrl) profile.resumeUrl = toHttpsUrl(profile.resumeUrl);

    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export { getProfile };

export const updateProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile();
    }
    
    // Update fields
    const fields = ['name', 'title', 'bio', 'about', 'email', 'phone', 'location'];
    fields.forEach(f => {
      if (req.body[f] !== undefined) profile[f] = req.body[f];
    });

    if (req.body.achievements !== undefined) {
      console.log('Updating achievements:', req.body.achievements);
      profile.achievements = req.body.achievements;
      profile.markModified('achievements');
    }

    if (req.body.socialLinks) {
      profile.socialLinks = { ...profile.socialLinks, ...req.body.socialLinks };
      profile.markModified('socialLinks');
    }
    
    if (req.body.heroTypingRoles) {
      profile.heroTypingRoles = req.body.heroTypingRoles;
      profile.markModified('heroTypingRoles');
    }

    const savedProfile = await profile.save();
    console.log('Profile saved successfully');
    res.json(savedProfile);
  } catch (error) {
    next(error);
  }
};

export const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    console.log('Uploaded file:', req.file);
    const imageUrl = getUploadedFileUrl(req.file);

    if (!imageUrl) {
      return res.status(500).json({
        success: false,
        message: 'Cloudinary did not return a valid file URL'
      });
    }

    const profile = await Profile.findOneAndUpdate(
      {},
      { profileImage: imageUrl },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: 'Profile image uploaded successfully',
      imageUrl,
      profile
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const uploadResumePDF = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    console.log('Uploaded resume:', req.file);
    const resumeUrl = getUploadedFileUrl(req.file);

    if (!resumeUrl) {
      return res.status(500).json({
        success: false,
        message: 'Cloudinary did not return a valid file URL'
      });
    }

    const profile = await Profile.findOneAndUpdate(
      {},
      { resumeUrl },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      resumeUrl,
      profile
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
