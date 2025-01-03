import React, { useState ,useEffect,useRef} from "react";
import { FaUpload, FaArrowUp, FaCopy, FaArrowDown } from "react-icons/fa";
import TextArea from "antd/es/input/TextArea";
import { Skeleton,message } from "antd";
import { AiFillDelete } from "react-icons/ai";
import { classifyAndFormat } from "../helper functions";
import { run } from "../gemini";
import { Modal, Button } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from 'react-redux';
import {addNewChat,setCurrentChat,sendMessage, selectCurrentChat, selectallChats,updateMessage, loadChats} from '../redux/chat/chatSlice'
import { loginWithGoogle,selectCurrentUser,checkAuth, logout, users ,fetchAllUsers} from "../redux/auth/authSlice";
import { TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";




const PromptInput = ({ isSidebarOpen, toggleSidebar }) => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);
  const [chatMessages,setChatmessages]= useState([])
  const [Currentuser, setCurrentUser] = useState(null);
  const [uid,setuid]=useState(null)
  const usersdata = useSelector(users)
  console.log(usersdata);
  
  const user = useSelector(selectCurrentUser)
  console.log(user);
  

  const currentChatid=useSelector(selectCurrentChat)

  const containerRef = useRef(null);


  useEffect(() => {
    if (user && user.uid) {
      dispatch(loadChats(user.uid)); // Pass user.uid to the thunk
    }
  }, [user, dispatch,currentChatid]);

  const allchats=useSelector(selectallChats)
  console.log(allchats);
  


  // const currentChatid=useSelector(selectCurrentChat)
  console.log(currentChatid);
  
    useEffect(()=>{
    const chatMessages = allchats.find((chat) => chat.id === currentChatid)?.messages || [];
    setChatmessages(chatMessages)

  },[allchats])

  
  
  const [text, setText] = useState("");
  const [pastedCodes, setPastedCodes] = useState([]);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadedFileContent, setUploadedFileContent] = useState("");
  const [selectedContent, setSelectedContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState([])
  const chatContainerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const downArrowRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatTitle,setChatTitle] = useState('')
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    // Check if the user is already logged in when the app starts
    dispatch(checkAuth());
  }, [dispatch]);



  console.log("Chat Messages:", chatMessages);
  
  // setMessages(chatMessages.map(({ userMessage, aiResponse }) => ({ userMessage, aiResponse })));

  const showModal = () => {
    setIsModalOpen(true);
  };
  
  
  
  const handleImageClick = () => {
    setShowLogout((prev) => !prev); // Toggle logout button
  };

  const handleOutsideClick = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setShowLogout(false); // Hide logout button if clicking outside
    }
  };

  useEffect(() => {
    // Add event listener to detect clicks outside
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleOk = async () => {
    try {
      
      await dispatch(loginWithGoogle()).unwrap();
      // setCurrentUser({uid: userData.uid, email: userData.email, name: userData.displayName , profilephoto:userData.photoURL})
      

      setCurrentUser(user)
      // console.log("User signed in:", Currentuser);
      message.success("Login successful")
      setIsModalOpen(false);
      // You can add logic here to save the user data to your database or state
    } catch (error) {
      message.error("Error during sign-in:", error);
      setIsModalOpen(false);
    }
  };
  // console.log(user);
  

  // console.log(user);
  const handleLogout=()=>{
    dispatch(logout())
  }
  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (container) {
      const isAtBottom =
        container.scrollHeight - container.scrollTop <= container.clientHeight + 10;
      setIsAtBottom(isAtBottom);
    }
  };

  // Scroll to the bottom with a delay and smooth behavior
  const scrollToBottom = () => {
    const container = chatContainerRef.current;
    if (container) {
      setTimeout(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth", // Smooth scrolling effect
        });
      }, 500); // Delay of 500ms (adjust as needed)
    }
  };

  // Add event listener on mount and cleanup on unmount
  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    // Cleanup event listener on unmount
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setUploadedFileName(file.name); // Store the file name
        setUploadedFileContent(content); // Store the file content
      };
      reader.readAsText(file);
    }
  };

  const handlePaste = (e) => {
    const pastedText = e.clipboardData.getData("Text");
    if (pastedText.length > 500) {
      setPastedCodes((prev) => [...prev, pastedText]);
    } else {
      setText(pastedText);
    }
    e.preventDefault();
  };

  const handleRemovePastedCode = (index) => {
    setPastedCodes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCloseModal = () => {
    setSelectedContent("");
  };

  // Function to get all input content
  const getAllInputContent = () => {
    // Combine text from textarea, pasted codes, and uploaded file content
    const allInputs = [text, ...pastedCodes, uploadedFileContent].filter(
      Boolean
    );
    return allInputs.join("\n"); // You can adjust how you join them (e.g., with new lines)
  };
//   const handleSubmit1 = async (e) => {
//     e.preventDefault()
//     setLoading(true);
//     const userId = user.uid; // Assuming user object contains the userId
//     const inputContent = getAllInputContent(); // Function that gets the input content from your UI
//     if (inputContent.trim() === '') return; // If input is empty, don't proceed

//     const newChatTitle = inputContent.split(' ').slice(0, 3).join(' ') + '...';
  
//     try {

        
//         // Send user input to run function to get AI response
//         const response = await run(inputContent);
//         // console.log("User Message:", inputContent);
//         // console.log("AI Response:", response);

//         if (currentChatid) {
//             // If there is an active chat, send the message to that chat
//             dispatch(sendMessage({
//                 userId, 
//                 chatId: currentChatid,
//                 userMessage: inputContent, 
//                 aiResponse: response
//             }));
//         } else {
//             // Otherwise, create a new chat and set it as the current chat
//             const chatData = await dispatch(addNewChat({
//                 userId,
//                 chatName: newChatTitle
//             })).unwrap();

//             dispatch(setCurrentChat(chatData.id)); // Set the newly created chat as current
            
//             // Send message to newly created chat
//              dispatch(sendMessage({
//                 userId, 
//                 chatId: chatData.id, 
//                 userMessage: inputContent, 
//                 aiResponse: response
//             }))
//             }
            
       

//         // Update messages state (be sure to track both userMessage and aiResponse)

//     } catch (error) {
//         console.error("Error during chat submission:", error);
//         message.error("An error occurred while generating the response, please try again.");
//     } finally {
//         setLoading(false);
//         setText(''); // Clear the input field
//         setPastedCodes([]); // Clear pasted codes
//         setUploadedFileContent(''); // Clear uploaded file content
//     }
// };

 
// const handleSubmit1 = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   const userId = user.uid; // Assuming user object contains the userId
//   const inputContent = getAllInputContent(); // Function that gets the input content from your UI

//   if (inputContent.trim() === '') {
//       setLoading(false);
//       return; // If input is empty, don't proceed
//   }

//   const newChatTitle = inputContent.split(' ').slice(0, 3).join(' ') + '...';

//   try {
//       // If there's an active chat, send the message with aiResponse as null
//       if (currentChatid) {
//           // Dispatch message with AI response initially null
//           const messageData = await dispatch(
//               sendMessage({
//                   userId,
//                   chatId: currentChatid,
//                   userMessage: inputContent,
//                   aiResponse: null,
//               })
//           ).unwrap();

//           // Fetch AI response and update the specific message
//           const response = await run(inputContent);
//           dispatch(
//               updateMessageResponse({
//                   chatId: currentChatid,
//                   messageId: messageData.messageId,
//                   aiResponse: response,
//               })
//           );
//       } else {
//           // Create a new chat and set it as the current chat
//           const chatData = await dispatch(
//               addNewChat({
//                   userId,
//                   chatName: newChatTitle,
//               })
//           ).unwrap();

//           dispatch(setCurrentChat(chatData.id)); // Set the newly created chat as current

//           // Dispatch message with AI response initially null
//           const messageData = await dispatch(
//               sendMessage({
//                   userId,
//                   chatId: chatData.id,
//                   userMessage: inputContent,
//                   aiResponse: null,
//               })
//           ).unwrap();

//           // Fetch AI response and update the specific message
//           const response = await run(inputContent);
//           dispatch(
//               updateMessageResponse({
//                   chatId: chatData.id,
//                   messageId: messageData.messageId,
//                   aiResponse: response,
//               })
//           );
//       }
//   } catch (error) {
//       console.error('Error during chat submission:', error);
//       message.error('An error occurred while generating the response, please try again.');
//   } finally {
//       setLoading(false);
//       setText(''); // Clear the input field
//       setPastedCodes([]); // Clear pasted codes
//       setUploadedFileContent(''); // Clear uploaded file content
//   }
// };
const handleSubmit1 = async (e) => {
  e.preventDefault();
  setLoading(true);

  const userId = user.uid; // Assuming user object contains the userId
  const inputContent = getAllInputContent(); // Function that gets the input content from your UI
  if (inputContent.trim() === '') return; // If input is empty, don't proceed

  const newChatTitle = inputContent.split(' ').slice(0, 3).join(' ') + '...';

  try {
    let currentChatId = currentChatid;

    if (!currentChatId) {
      // Create a new chat if none is active
      const chatData = await dispatch(addNewChat({ userId, chatName: newChatTitle })).unwrap();
      currentChatId = chatData.id;
      dispatch(setCurrentChat(currentChatId));
    }

    // Add the new message to the chat
    // dispatch(sendMessage({ userId, chatId: currentChatId, userMessage: inputContent, aiResponse: null }));

    // Call AI service and update the specific message when response arrives
    const response = await run(inputContent);
    dispatch(sendMessage({ userId, chatId: currentChatId, userMessage: inputContent, aiResponse: response }));

    // const messageIndex = allchats.find((chat) => chat.id === currentChatId)?.messages?.length - 1;
    console.log("all chats:",allchats)
    // console.log(messageIndex)

    // dispatch(updateMessage({ chatId: currentChatId, messageIndex, aiResponse: response }));
  } catch (error) {
    console.error("Error during chat submission:", error);
    message.error("An error occurred while generating the response, please try again.");
  } finally {
    setLoading(false);
    setText(''); // Clear the input field
    setPastedCodes([]); // Clear pasted codes
    setUploadedFileContent(''); // Clear uploaded file content
  }
};

  const handleSubmit = async () => {
    const inputContent = getAllInputContent();
    if(!inputContent) return
    const newChat = [...chat,{input:inputContent,response:null}];
    setChat(newChat);
    // Pass the input content to the run function
    try {
        setLoading(true);
        const response = await run(inputContent)
        setChat((prev) =>
            prev.map((item, index) =>
              index === prev.length - 1
                ? { ...item, response: classifyAndFormat(response) } // Apply classifyAndFormat here
                : item
            )
          );
          
    } catch (error) {
        //antd error message
        message.error("An error occurred while generating please try again ")
        

    }
    finally{
        setLoading(false)
        setText(null)
        setPastedCodes([])
        setUploadedFileContent(null)
        
    }

  };
  
  return (
    // <div className="bg-gray-900 h-screen relative flex  flex-col  items-center">
      <div ref={containerRef}
      className={`flex-1 bg-gray-900 p-6 transition-all duration-300 mx-auto  relative${
        isSidebarOpen ? "md:ml-0" : "w-full mx-auto"
      }`}
    >
      <div className="flex justify-between ">
      <button
        onClick={toggleSidebar}
        className="mb-4 px-4 py-2 bg-transparent text-white rounded-md "
      >
        {isSidebarOpen ? (<TbLayoutSidebarLeftCollapse  className="bg-gray-900" size ="36px" title="close Sidebar"/>

) : (<TbLayoutSidebarLeftExpand className="bg-gray-900" size ="36px" title="open sidebar"/>
)}
      </button>
      <div className="relative">
        {
          !user?(<button  className="bg-gray-300 text-gray-900 rounded-2xl px-10 py-2" onClick={showModal}>Log in </button>):
          (<img 
            src={user.photo}
            alt={user.name}
            className="w-10 h-10 rounded-full border-2 border-gray-400 cursor-pointer"
            title={user.name}
            onClick={handleImageClick}

          />
        )
        

        }

      {/* Logout Button */}
      {showLogout && user &&(
        <button
          onClick={handleLogout}
          className="absolute left-1/2 transform -translate-x-1/2 mt-1 px-3 py-1 bg-white text-gray-800 border border-gray-300 rounded shadow-md"
        >
          Logout
        </button>
      )}
      
      

      </div>
      <Modal
        title="Login"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <Button
          className="w-full bg-gray-600 text-white py-5 px-10 flex flex-row items-center justify-center gap-2 rounded-lg hover:bg-gray-900"
          onClick={handleOk}
        >
          <GoogleOutlined />
          <span>Continue with Google</span>
        </Button>
      </Modal>
      
      </div>
     
      <div className="w-9/12 bg-gray-900 rounded-lg shadow-md p-4 overflow-auto relative custom-scrollbar mx-auto"
     style={{ height: `calc(${100}vh - ${200}px)` }} ref={chatContainerRef}>
    {loading && chat.length === -1 ? (
        <Skeleton active paragraph={{ rows: 10 }} style={{ backgroundImage: "linear-gradient(90deg, #d1d5db 25%, #e5e7eb 50%, #d1d5db 75%)" }} />
    ) : chatMessages.length === 0 ? (
        <p className="text-gray-500 text-center">No messages yet. Start chatting!</p>
    ) : (
        <ul className="w-full">
            {chatMessages.map((chat, index) => (
                <li key={index} className="mb-4 w-full">
                    {/* User Message */}
                    <div className="flex items-start flex-row-reverse mb-2">
                        <div className="bg-gray-500 text-white w-10 h-10 rounded-full flex items-center justify-center ml-3">U</div>
                        <div className="bg-gray-800 p-2 rounded-2xl text-white max-w-[60%]">
                            <p className="p-4">{chat.userMessage}</p>
                        </div>
                    </div>
                    {/* AI Response */}
                    {chat.aiResponse && (
                        <div className="flex items-start">
                            <div className="bg-gray-900 text-white w-10 h-10 rounded-full flex items-center justify-center mr-3">AI</div>
                            <div className="bg-gray-800 p-2 rounded-2xl text-white max-w-[90%]">
                                <p className="p-4">{classifyAndFormat(chat.aiResponse)}</p>
                            </div>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    )}
</div>

      
      <div>

      </div>

      <div className="bg-gray-800  flex items-center justify-center ">

        {/* <div id="out" className="text-white"></div> */}
        <div className="bg-gray-900 shadow-lg p-1 rounded-xl w-full max-w-3xl absolute bottom-2">
          <div className="relative bg-gray-700 pb-9 rounded-xl p-3 border border-white">
          {!isAtBottom && (
        <div
          className="absolute top-[-100px] left-1/2  bg-white p-2 rounded-full shadow-md cursor-pointer"
          onClick={scrollToBottom}
        >
          <FaArrowDown className="text-gray-800" />
        </div>
      )}
            {/* Text Area */}
            <TextArea
              autoSize={{ minRows: 1, maxRows: 6 }}
              onKeyDown={(e) => {
                if (e.key === 'Enter'&& !e.shiftKey) {
                  e.preventDefault(); // Prevents a newline in case of a multiline input
                  handleSubmit();
                }
                if (e.key === 'Enter' && e.shiftKey) {
                  return; // Do nothing, allow new line
                }
              }}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onPaste={handlePaste}
              placeholder="Paste your code or enter your prompt here..."
              className=" custom-scrollbar p-3 w-full !text-gray-300 !focus:outline-none !border-none !focus:border-none  !bg-transparent !placeholder-gray-500 resize-none overflow-y-auto "
            ></TextArea>

            {/* Upload Button */}
            <div className="absolute left-4 bottom-3 flex items-center">
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-gray-300 hover:text-white bg-transparent hover:bg-gray-700 p-2 rounded-full flex items-center justify-center"
              >
                <FaUpload className="h-5 w-5" />
              </label>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />

              {/* Uploaded File Name */}
              {uploadedFileName && (
                <span
                  className="ml-4 text-gray-300 cursor-pointer hover:text-blue-400"
                  onClick={() => setSelectedContent(uploadedFileContent)}
                >
                  {uploadedFileName}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <div className="absolute right-4 bottom-3">
              <button
                className={`bg-white hover:bg-white p-2 rounded-full shadow-md flex items-center justify-center ${
                  (!text && pastedCodes.length === 0 && !uploadedFileContent) ||
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={handleSubmit1}
                

                disabled={
                  (!text && pastedCodes.length === 0 && !uploadedFileContent) ||
                  loading
                }
              >
                {loading ? (
                  <svg
                    className="animate-spin h-4 w-4 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                ) : (
                  <FaArrowUp className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Pasted Codes */}
          <div className="mt-4 flex flex-wrap gap-4 ">
            {pastedCodes.map((code, index) => (
              <div
                key={index}
                className="bg-gray-700 text-gray-300 rounded-md p-2 shadow-md cursor-pointer relative"
                onClick={() => setSelectedContent(code)}
              >
                <div className="text-xs overflow-hidden">
                  {code.substring(0, 50)}...
                </div>
                <div className="text-center text-green-400 mt-2">Pasted</div>
                <div
                  className="w-5 h-5  absolute bottom-2 right-2 text-red-600 hover:text-red-950"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering parent onClick
                    handleRemovePastedCode(index);
                  }}
                >
                  <AiFillDelete />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for Displaying Content */}
        {selectedContent && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center custom-scrollbar">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg relative w-3/4 max-w-3xl">
              <button
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                onClick={handleCloseModal}
              >
                &#x2715;
              </button>
              <div className="text-gray-300 whitespace-pre-wrap overflow-y-auto max-h-96">
                {selectedContent}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  
  );
};

export default PromptInput;