import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadChats, addNewChat, setCurrentChat, selectallChats, selectCurrentChat, resetCurrentChat,  } from "../redux/chat/chatSlice";
import { selectCurrentUser,checkAuth } from "../redux/auth/authSlice";
import { SearchOutlined } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
const Sidebar = ({ isSidebarOpen, }) => {
  const dispatch = useDispatch();
  const chats = useSelector(selectallChats);
  const currentUser = useSelector(selectCurrentUser);
  const selectedChat = useSelector(selectCurrentChat);
  const [newChatName, setNewChatName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    // Check if the user is already logged in when the app starts
    dispatch(checkAuth());
  }, [dispatch]);


  const userId = currentUser?.uid;

  useEffect(() => {
    if (currentUser) {
      dispatch(loadChats(userId));
    }
  }, []);

  const handleNewChat = () => {
    if (newChatName.trim()) {
      dispatch(addNewChat({ userId, chatName: newChatName.trim() }));
      setNewChatName("");
      dispatch(resetCurrentChat()); // Clear the current selection
    }
  };

  const handleChatClick = (chatId) => {
    dispatch(setCurrentChat(chatId));
    
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {isSidebarOpen && (
        <div className="w-1/5 bg-gray-900 text-white p-4 hidden md:block h-screen">
          <div>
          <button
              onClick={handleNewChat}
              className="bg-transparent p-2 rounded ml-2 hover:bg-gray-600 m-5"
            >
              <PlusOutlined className="h-5 w-5 text-white" fontSize={`36px`} /> New Chat
            </button>

          </div>

          {/* Search Bar */}
          <div className="flex items-center bg-gray-800 p-2 rounded mb-4">
            <SearchOutlined className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats"
              className="bg-transparent outline-none text-white ml-2 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Chat List */}
          <ul className="mb-4">
            {filteredChats.map((chat) => (
              <li
                key={chat.id}
                onClick={() => handleChatClick(chat.id)}
                className={`p-2 rounded cursor-pointer ${
                  selectedChat === chat.id ? "bg-gray-500" : "hover:bg-gray-700"
                }`}
              >
                {chat.name}
              </li>
            ))}
          </ul>

          {/* Add New Chat */}
         
        </div>
      )}
    </>
  );
};

export default Sidebar;
