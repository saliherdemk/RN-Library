import { createSlice } from "@reduxjs/toolkit";
import { AuthorsType, TypesType } from "../../types/bookTypes";

export interface FilterState {
  types: Array<TypesType>;
  authors: Array<AuthorsType>;
}
const initialState: FilterState = {
  types: [],
  authors: [],
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setTypesFilter: (state, action) => {
      state.types = action.payload;
    },

    setAuthorsFilter: (state, action) => {
      state.authors = action.payload;
    },
  },
});

export const { setTypesFilter, setAuthorsFilter } = filterSlice.actions;

export default filterSlice.reducer;
