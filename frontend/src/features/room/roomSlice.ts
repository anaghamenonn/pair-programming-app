import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RoomState {
  roomId: string | null;
  code: string;
  suggestion: string | null;
  isDarkTheme: boolean;
  typingUsers: string[];
}

const initialState: RoomState = {
  roomId: null,
  code: "# Start coding in Python...",
  suggestion: null,
  isDarkTheme: true,
  typingUsers: [],
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoomId(state, action: PayloadAction<string>) {
      state.roomId = action.payload;
    },
    setCode(state, action: PayloadAction<string>) {
      state.code = action.payload;
    },
    setSuggestion(state, action: PayloadAction<string | null>) {
      state.suggestion = action.payload;
    },
    toggleTheme(state) {
      state.isDarkTheme = !state.isDarkTheme;
    },
    setTypingUser(state, action: PayloadAction<{ user: string; isTyping: boolean }>) {
      if (action.payload.isTyping) {
        if (!state.typingUsers.includes(action.payload.user)) {
          state.typingUsers.push(action.payload.user);
        }
      } else {
        state.typingUsers = state.typingUsers.filter((u) => u !== action.payload.user);
      }
    },
  },
});

export const { setRoomId, setCode, setSuggestion, toggleTheme, setTypingUser } = roomSlice.actions;
export default roomSlice.reducer;