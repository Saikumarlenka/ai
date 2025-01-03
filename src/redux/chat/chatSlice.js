import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createChat, addMessageToChat, fetchChats } from "../../services/chatService";

// Async thunk to load chats for a user
export const loadChats = createAsyncThunk("chat/load", async (userId, thunkAPI) => {
  try {
    const chats = await fetchChats(userId);
    return chats;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Async thunk to create a new chat
export const addNewChat = createAsyncThunk("chat/create", async ({ userId, chatName }, thunkAPI) => {
  try {
    const chatData = await createChat(userId, chatName);
    return chatData;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Async thunk to send a message to a chat
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ userId, chatId, userMessage, aiResponse }, thunkAPI) => {
    try {
      const message = {
        userMessage,
        aiResponse,
        timestamp: new Date().toISOString(),
      };

      // Save message to the database
      await addMessageToChat(userId, chatId, message);

      return { chatId, message };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Chat slice definition
const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [], // List of all chats
    currentChat: null, // ID of the currently selected chat
    loading: false, // Loading state for asynchronous operations
    error: null, // Error messages
  },
  reducers: {
    setCurrentChat: (state, action) => {
        state.currentChat = action.payload;
    },
    resetCurrentChat: (state) => {
        state.currentChat = null;
    },
    updateMessage: (state, action) => {
      const { chatId, messageIndex, aiResponse } = action.payload;
      const chat = state.chats.find((c) => c.id === chatId);
      if (chat && chat.messages?.[messageIndex]) {
        chat.messages[messageIndex].aiResponse = aiResponse; // Update the specific message
      }
    },
},
  extraReducers: (builder) => {
    builder
      // Load chats
      .addCase(loadChats.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(loadChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add new chat
      .addCase(addNewChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(addNewChat.fulfilled, (state, action) => {
        state.loading = false;
        state.chats.push(action.payload);
      })
      .addCase(addNewChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        const { chatId, message } = action.payload;
        const chat = state.chats.find((c) => c.id === chatId);
        if (chat) {
          
          chat.messages.push(message);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentChat, resetCurrentChat,updateMessage } = chatSlice.actions;

export const selectallChats = (state) => {
  // console.log(state.chat.chats); 
  return state.chat.chats; 
};



export const selectCurrentChat = (state) => state.chat.currentChat;
export const selectChatError = (state) => state.chat.error;
export const selectChatLoading = (state) => state.chat.loading;
export const selectallchats= (state) => state.chat.chats

export default chatSlice.reducer;
