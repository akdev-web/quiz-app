import cloudinary from "../../config/cloudinary.js";
import connectDB from "../../config/conn.js";
import users from "../../models/user.js";
export default async function updateProfile(req, res) {
    const { user } = req;
    const { profile, username } = req.body;
    console.log(user, profile, username);
    try {
        const userdata = await users.findById(user.id);
        const oldProfile = userdata.profile;
        if (profile?.url && profile?.cloudId) {
            if (oldProfile && oldProfile.cloudId) {
                cloudinary.uploader.destroy(oldProfile.cloudId, (err, result) => {
                    if (err) {
                        console.error('cloud image updating error :', err);
                        return res.status(500).json({ err: 'cloud image updating error' });
                    }
                })
            }
            userdata.profile = profile;
        }
        if (username && username !== userdata.username) {
            userdata.username = username;
        }
        await userdata.save();
        const update = { profile: userdata.profile, username }
        return res.status(200).json({ success: true, update })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ err: 'Unexpected Error' });
    }

}