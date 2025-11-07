import React, { useContext, useState } from 'react'

import './ProfileUpdate.css'
import assets from '../../assets/assets'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';

const ProfileUpdate = () => {
  const {authUser,updateProfile} = useContext(AuthContext);

  const[selectImage,setSelectImage] = useState(null);
  const navigate = useNavigate();
  const [name,setName] = useState(authUser.fullName);
  const [bio,setBio] = useState(authUser.bio);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectImage) {
      await updateProfile({fullName:name,bio});
      navigate('/');
      return;
    };

    const reader = new FileReader();
    reader.readAsDataURL(selectImage);
    reader.onload = async () =>{
      const base64Image = reader.result;
      await updateProfile({profilePic:base64Image,fullName:name,bio});
      navigate('/');
    }


  }
  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={handleSubmit}>
          <h3>Profile Details</h3>
          <label htmlFor="avatar"> 
            {/* <input onChange={(e)=>setImage(e.target.files[0])} type="file" id='avatar' accept='.png,.jpg,.jpeg' hidden /> */}
            {/* <img src={image?URL.createObjectURL(image):assets.avatar_icon} alt="" /> */}
            <input onChange={(e)=>setSelectImage(e.target.files[0])} type="file" id='avatar' accept='.png,.jpg,.jpeg' hidden />
            <img src={selectImage?URL.createObjectURL(selectImage):assets.avatar_icon} alt="" />
            upload profile image
          </label>
          <input type="text" onChange={(e)=>setName(e.target.value)} value={name} placeholder='your name' required />
          <textarea onChange={(e)=>setBio(e.target.value)} value={bio} placeholder='write profile bio' required></textarea>
          <button type='submit'>Save</button>
        </form>
        {/* <img className='profile-pic' src={selectImage?URL.createObjectURL(selectImage):assets.logo_icon} alt="" /> */}
        <img className='profile-pic' src={authUser.profilePic || assets.logo_icon} alt="" />
      </div>
    </div>
  )
}

export default ProfileUpdate
