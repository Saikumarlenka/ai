import React, { useState ,useEffect,useRef} from "react";
import { FaUpload, FaArrowUp, FaCopy, FaArrowDown } from "react-icons/fa";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import TextArea from "antd/es/input/TextArea";
import { Skeleton,message } from "antd";
import { FaDeleteLeft } from "react-icons/fa6";
import { AiFillDelete } from "react-icons/ai";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { classifyAndFormat } from "../helper functions";
import { run } from "../gemini";

const PromptInput = () => {
  const [data, setData] = useState(null);
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
  

  console.log(data);
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
    <div className="bg-gray-900 h-screen relative flex  flex-col  items-center">
      {/* <div
        className="mt-6 w-full max-w-3xl overflow-auto"
        style={{ height: calc(100vh - 200px) }}
      >
        {loading ? (
          <Skeleton
            active
            paragraph={{ rows: 10 }}
            // style={{
            // //   backgroundColor: "#d1d5db", // Base gray color
            //   backgroundImage:
            //     "linear-gradient(90deg, #d1d5db 25%, #e5e7eb 50%, #d1d5db 75%)", // Stripe animation colors
            // }}
          />
        ) : data ? (
          classifyAndFormat(data)
        ) : (
          <p className="text-gray-500"></p>
        )}
      </div> */}
       <div
        className="w-9/12 bg-gray-900 rounded-lg shadow-md p-4 overflow-auto relative custom-scrollbar"
        style={{ height: `calc(${100}vh - ${200}px)` }}
        ref={chatContainerRef}
      >
        {loading && chat.length === 0 ? (
          <Skeleton
            active
            paragraph={{ rows: 10 }}
            style={{
              backgroundImage:
                "linear-gradient(90deg, #d1d5db 25%, #e5e7eb 50%, #d1d5db 75%)",
            }}
          />
        ) : chat.length === 0 ? (
          <p className="text-gray-500 text-center">No messages yet. Start chatting!</p>
        ) : (
            <ul className="w-full">
            {chat.map((chat, index) => (
              <li key={index} className="mb-4 w-full">
                {/* User Message */}
                <div className="flex items-start flex-row-reverse mb-2">
                  <div className="bg-gray-500 text-white w-10 h-10 rounded-full flex items-center justify-center ml-3">
                    U
                  </div>
                  <div className="bg-gray-800 p-2 rounded-2xl text-white max-w-[60%]">
                    <p className="p-4">{chat.input}</p>
                  </div>
                </div>
                {/* AI Response */}
                {chat.response && (
                  <div className="flex items-start">
                    <div className="bg-gray-900 text-white w-10 h-10 rounded-full flex items-center justify-center mr-3">
                      AI
                    </div>
                    <div className="bg-gray-800 p-2 rounded-2xl text-white max-w-[90%]">
                      <p className="p-4">{chat.response}</p>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
          
          
        )}
       
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
                onClick={handleSubmit}
                

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
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
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