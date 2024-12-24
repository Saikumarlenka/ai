import { collection, doc, setDoc, addDoc } from 'firebase/firestore';

// Create a user document
const createUser = async (userId) => {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, { userId });  // You can add additional user data here
  console.log('User created with ID: ', userId);
};

// Create a chat document under a specific user
const createChat = async (userId, chatId) => {
  const chatRef = doc(collection(db, 'users', userId, 'chats'), chatId);
  await setDoc(chatRef, { chatId });
  console.log('Chat created with ID: ', chatId);
};

// Create a message document under a specific chat
const createMessage = async (userId, chatId, messageId, userInput, aiResponse) => {
  const messageRef = doc(collection(db, 'users', userId, 'chats', chatId, 'messages'), messageId);
  await setDoc(messageRef, { userInput, aiResponse });
  console.log('Message created with ID: ', messageId);
};

// Example: Creating a user, chat, and messages
const userId = 'user123';
const chatId = 'chat001';
const messageId1 = 'message001';
const messageId2 = 'message002';

// Step 1: Create User
createUser(userId).then(() => {
  // Step 2: Create Chat under User
  createChat(userId, chatId).then(() => {
    // Step 3: Create Messages under the Chat
    createMessage(userId, chatId, messageId1, 'What is AI?', 'AI stands for Artificial Intelligence.');
    createMessage(userId, chatId, messageId2, 'How does it work?', 'AI works by using algorithms to process data.');
  });
});
