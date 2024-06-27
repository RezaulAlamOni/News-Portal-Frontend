import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postMethod } from "../api";
import { loginUrl } from "../constant";

const initialState = {
  value: {
    isLogged: false,
    loginData: null,
  },
};

export const authenticateUser = createAsyncThunk(
    "authentication/user",
    async (data,navigate) => {
      const response = await postMethod(loginUrl, data,navigate);
      return response; // Assuming response.data contains the relevant login data
    }
);

export const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.value = {
        isLogged: action.payload.isLogged,
        loginData: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(authenticateUser.fulfilled, (state, action) => {
          state.value.isLogged = true;
          state.value.loginData = action.payload;
        })
        .addCase(authenticateUser.rejected, (state, action) => {
          state.value.isLogged = false;
          state.value.loginData = null;
        })
        .addCase(authenticateUser.pending, (state, action) => {
          state.value.isLogged = false;
          state.value.loginData = null;
        });
  },
});

export const { updateUser } = authenticationSlice.actions;

export default authenticationSlice.reducer;
