import { db } from "../firebase";
import { collection, addDoc, getDocs, getDoc, updateDoc, doc } from "firebase/firestore";

// Fetch chats from Firestore

export const fetchChats = async (userId) => {
  if (!userId) {
    throw new Error("userId is required to fetch chats");
  }

  try {
    console.log("Fetching chats for userId:", userId);
    const chatsRef = collection(db, "users", userId, "chats");
    const snapshot = await getDocs(chatsRef);

    if (snapshot.empty) {
      console.warn("No chats found for userId:", userId);
      return [];
    }

    // Fetch chats and their messages
    const chats = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const chatData = { id: doc.id, ...doc.data() };

        // Fetch messages for this chat
        const messagesRef = collection(db, "users", userId, "chats", doc.id, "messages");
        const messagesSnapshot = await getDocs(messagesRef);

        // Add messages to chatData
        chatData.messages = messagesSnapshot.docs.map((msgDoc) => ({
          id: msgDoc.id,
          ...msgDoc.data(),
        }));

        return chatData;
      })
    );

    return chats;
  } catch (error) {
    console.error("Error fetching chats:", error);
    throw error;
  }
};

// Create a new chat
export const createChat = async (userId, chatName) => {
  if (!chatName) {
    throw new Error("Chat name is required.");
  }

  const chatData = {
    name: chatName,
    userId,
    createdAt: new Date().toISOString(),
    messages: [],
  };

  try {
    const chatDocRef = await addDoc(collection(db, "users", userId, "chats"), chatData);
    return { id: chatDocRef.id, ...chatData }; // Return the chat with its generated ID
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
};

// Add a message to a chat
export const addMessageToChat = async (userId, chatId, message) => {
  if (!userId || !chatId || !message) {
    throw new Error("User ID, Chat ID, and message are required.");
  }

  try {
    // Validate if chat exists
    const chatRef = doc(db, "users", userId, "chats", chatId);
    const chatDoc = await getDoc(chatRef);

    if (!chatDoc.exists()) {
      throw new Error("Chat not found.");
    }

    // Add message to the messages subcollection in Firestore
    const messageRef = collection(chatRef, "messages");
    await addDoc(messageRef, {
      ...message,
      timestamp: new Date().toISOString(),
    });

    console.log("Message added successfully to chat:", chatId);
  } catch (error) {
    console.error("Error in addMessageToChat:", error.message);
    throw error;
  }
};
