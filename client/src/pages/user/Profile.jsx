import React, { useEffect, useRef, useState } from 'react'
import useUserContext from '../../context/UserContext'
import UserAvatar from '../../components/util/UserAvatar';
import { Edit } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import ToastMsg from '../../components/util/AlertToast';
import api from '../../components/api';

const Profile = () => {
  const { user } = useUserContext();
  const location = useLocation();
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    if (location?.state) {
      ToastMsg(location.state.alert);
    }
  }, [])

  const [profileImg, setProfileImg] = useState(user?.profile || null);
  const [editMode, setEditMode] = useState(false);
  const [usernameEditMode, setUsernameEditMode] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [usernameChanged, setUsernameChanged] = useState(false);


  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImg(file);
      setPreview(URL.createObjectURL(file));
    }
  };
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setUsernameChanged(e.target.value !== user?.username);
  };
  const handleUsernameEdit = () => {
    setUsernameEditMode(true);
  };
  const handleUsernameBlur = () => {
    setUsernameEditMode(false);
  };
  const handleSave = async () => {
    setLoading(true);
    if (preview) setProfileImg(preview);
    try {
      const formdata = new FormData();
      formdata.append('profile', selectedImg);
      formdata.append('username', username);
      const res = await api.post('user/profile', formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res);
      if (res.data.success) {
        setEditMode(false);
        setLoading(false);
        setUsernameChanged(false);
        setSelectedImg(null);
      }
    } catch (err) {
      setLoading(false);
      console.log(err)
    }
  };



  return (
    <>
      {user && (
        <div className="max-w-[370px] mx-auto my-8 p-7 shadow-lg rounded-2xl text-center bg-white text-black border border-gray-200">
          <h2 className="font-bold text-2xl mb-5 tracking-wide text-black">Profile</h2>
          <div className="mb-5 relative inline-block">
            {preview ? (
              <img src={preview} alt="Preview" className="w-[120px] h-[120px] rounded-full object-cover border-2 border-black" />
            ) : profileImg ? (
              <img src={profileImg} alt="Profile" className="w-[120px] h-[120px] rounded-full object-cover border-2 border-black" />
            ) : (
              <UserAvatar name={username || 'User'} size={120} />
            )}
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={handleImgChange}
              className="hidden"
            />
            <label htmlFor="profile-upload" className="absolute bottom-2 right-2 bg-black rounded-full p-2 cursor-pointer shadow border border-gray-200">
              <Edit size={22} color="#fff" />
            </label>
          </div>
          <div className="mb-3 relative flex items-center justify-center">
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              onFocus={handleUsernameEdit}
              onBlur={handleUsernameBlur}
              readOnly={!usernameEditMode}
              className={`text-lg px-3 py-1.5 rounded-lg w-40 text-center outline-none transition-all duration-200 ${usernameEditMode ? 'border-2 border-black bg-white cursor-text' : 'border-2 border-gray-200 bg-gray-100 cursor-pointer'}`}
            />
          </div>
          <div className="mb-5 text-gray-700 text-base">{user.email}</div>
          {(editMode || preview || usernameChanged || usernameEditMode) && (
            <button
              onClick={handleSave}
              disabled={loading || (!preview && !usernameChanged)}
              className={`mt-3 rounded-lg px-6 py-2 font-semibold text-lg transition-all duration-200 ${(!preview && !usernameChanged) ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' : 'bg-black text-white cursor-pointer shadow'} ${loading ? 'opacity-70' : ''}`}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          )}
        </div>
      )}
    </>
  );
}

export default Profile