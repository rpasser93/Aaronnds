import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getBoardAsync = createAsyncThunk(
  'board/getBoardAsync',
  async (board) => {
    const response = await axios.get(`http://localhost:5000/api/boards/${board.id}`);
    return { response }
  })

export const editBoardAsync = createAsyncThunk(
  'board/editBoardAsync',
  async (board) => {
    const response = await axios.put(`/api/boards/${board.id}`, board);
    return { response }
  }
)

  const boardSlice = createSlice({
    name:'board',
    initialState: {},
    reducers: {},
    extraReducers: {
      [getBoardAsync.fulfilled]: (state, action) => {
        return action.payload.response.data
      }
    }
  })

 export default boardSlice.reducer; 