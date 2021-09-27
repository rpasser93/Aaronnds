import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import socket from '../socket-connect';
import store from './store'

// Listen for when a new board is posted
// All socket listeners may be moved to their own file(s) in the future
socket.on('newBoard', board => {
  // console.log(board);
  store.dispatch(addBoardAsync(board));
})

export const getBoardsAsync = createAsyncThunk(
  'boards/getBoardsAsync',
  async () => {
    const response = await axios.get('http://localhost:5000/api/workspace/boards');
    const data = response.data
    return { data }
  })

export const addBoardAsync = createAsyncThunk(
  'boards/addBoardAsync',
  async (board) => {

    let data = {};

    if (board.hasOwnProperty('_id')) {
      data = board;
    } else {
      const response = await axios.post('http://localhost:5000/api/workspace/boards/', board)
      data = response.data;    
    }
    return { data }
  }
)

const boardsSlice = createSlice({
  name: 'boards',
  initialState: [],
  reducers: {},
  extraReducers: {
    [getBoardsAsync.fulfilled]: (state, action) => {
      return action.payload.data
    },
    [addBoardAsync.fulfilled]: (state, action) => {
      state.push(action.payload.data)
    },
  }
});


export const { addBoard } = boardsSlice.actions;

export default boardsSlice.reducer;