import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signInWithGoogle, signOutUser, checkAuthStatus ,fetchAllUsersdata} from "../../services/authService";

// Thunk for Google Sign-In
export const loginWithGoogle = createAsyncThunk(
  "auth/login",
  async (_, thunkAPI) => {
    try {
      return await signInWithGoogle();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Thunk for Sign-Out
export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await signOutUser();
    return true;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Thunk to check auth status
export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, thunkAPI) => {
  try {
    const user = await checkAuthStatus();
    return user;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});
export const fetchAllUsers = createAsyncThunk(
  "auth/fetchAllUsers",
  async (_, thunkAPI) => {
    try {
      return await fetchAllUsersdata();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Redux Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    users: [], // List of all users
    currentUser: null, // Currently logged-in user
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;

        // Add the user to the `users` array if not already present
        if (!state.users.some((user) => user.uid === action.payload.uid)) {
          state.users.push(action.payload);
        }
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.currentUser = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.currentUser = null;
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectCurrentUser = (state) => state.auth.currentUser;
export const users = (state)=>state.auth.users

export default authSlice.reducer;
