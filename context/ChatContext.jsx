import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';

export const ChatContext = createContext();

export const ChatProvider = ({children}) => {
    const [messages,setmessages] = useState([]);
    const [users,setUsers] = useState([]);
    const [selectedUser,setSelectUser] = useState(null);
    const [unseenMessage,setUnseenMessage] = useState({});

    const {axios,socket} = useContext(AuthContext);

    // function to get all users for sidebar

    const getUsers = async () => {
        try {
            const {data} = await axios.get("/api/messages/users");
            if (data.success) {
                setUsers(data.users);
                setUnseenMessage(data.unseenMessage);                 
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    // function to get message for selected user
    const getMessage = async (userId) => {
        try {
            const {data} = await axios.get(`/api/messages/${userId}`);
            if (data.success) {
                setmessage(data.messages)                
            }
        } catch (error) {
            toast.error(error.message)
        }
    };

    // function to send message to selected user
    const sendMessage = async (messageData) => {
        try {
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`,messageData);

            if (data.success) {
                setmessages((prevMessages)=>[...prevMessages,data.newMessage]);
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // function to subscrib to message messages for selected user
    const subscribeToMessages = async () => {
        if(!socket) return;

        socket.on("newMessage",(newMessage)=>{
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen=true;
                setmessages((prevMessages) => [...prevMessages,newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            } else{
                setUnseenMessage((prevUnseenMessage)=>({
                    ...prevUnseenMessage,[newMessage.senderId] : prevUnseenMessage[newMessage.senderId] ? prevUnseenMessage[newMessage.senderId] + 1 : 1
                }))
            }
        })
    } 

    // function to unsubscrib from messages
    const unsubscribFromMessages = ()=>{
        if(socket) socket.off("newMessage");
    };

    useEffect(()=>{
        subscribeToMessages();
        return ()=> unsubscribFromMessages();
    },[socket,selectedUser])


    const value = {
        messages,users,selectedUser,getUsers,getMessage,
        setmessages,sendMessage,setSelectUser,
        unseenMessage,setUnseenMessage
    };
  return (
    
    <ChatContext.Provider value={value}>
        {children}
    </ChatContext.Provider>
  )
}


