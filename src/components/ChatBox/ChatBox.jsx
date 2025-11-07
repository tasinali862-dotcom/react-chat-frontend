import React, { useContext, useEffect, useRef, useState } from 'react'
import './ChatBox.css'
import assets from '../../assets/assets'
import { ChatContext } from '../../../context/ChatContext';
import { AuthContext } from '../../../context/AuthContext';
import toast from 'react-hot-toast';


const ChatBox = () => {
  const [input,setInput] = useState("");
  const scrollEnd = useRef();

  const {messages,getMessage,selectedUser,sendMessage,setSelectUser} = useContext(ChatContext);
  const {authUser,onlineUsers} = useContext(AuthContext);

  // handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return null ;
    await sendMessage({text:input.trim()});
    setInput("");
  }

  // Handle sending an image
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("select an image file")
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({image:reader.result});
      e.target.value = "";
    }

    reader.readAsDataURL(file);
  }

  useEffect(()=>{
    if (selectedUser) {
      getMessage(selectedUser._id)
    }
  },[selectedUser]);

  useEffect(()=>{
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({behavior:"smooth"});
    }
  },[messages]);
  return(selectedUser ? (
    <div className='chat-box'>
      <div className="chat-user">
        <img src={selectedUser.profilePic || assets.profile_img} alt="" />
        {/* <img src={selectedUser.profilePic ? selectedUser.profilePic : assets.profile_img} alt="" /> */}
        <p>{selectedUser.fullName} 
          {onlineUsers.includes(selectedUser._id)}<img className='dot' src={assets.green_dot} alt="" /></p>

        <img onClick={()=>setSelectUser(null)} src={assets.arrow_icon} className='md:hidden max-w-7' alt="" />
        <img src={assets.help_icon} className='help' alt="" />
      </div>

      <div className="chat-msg">
        {messages.map((msg,index)=>(
          <div key={index} className={`s-msg ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
            {msg.image ? (
              <img src={msg.image} alt="" className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8' />
            ):(
              <p className={`msg ${msg.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none' }`}>{msg.text}</p>
            )}
            
            <div>
              <img src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} alt="" />
              <p>2:30 pm</p>
            </div>
          </div>
        ))}

        <div className="s-msg">
          <img className='msg-img' src={assets.pic1} alt="" />
          <div>
            <img src={assets.profile_img} alt="" />
            <p>2:30 pm</p>
          </div>
        </div>

        <div className="r-msg">
          <p className="msg">Lorem ipsum is placeholder text commonly used in ..</p>
          <div>
            <img src={assets.profile_img} alt="" />
            <p>2:30 pm</p>
          </div>
        </div>
      </div>

      <div className="chat-input">
        <input onChange={(e)=>setInput(e.target.value)} value={input}
         onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null}
          type="text" placeholder='Send a message' />
        <input onChange={{handleSendImage}} type="file" id='image' accept='image/png,image/jpeg' hidden />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img onClick={handleSendMessage} src={assets.send_button} alt="" />
      </div>
    </div>
  ) : (<div>hello</div>))
}

export default ChatBox
