import { createSlice } from "@reduxjs/toolkit";
import { AuthorsType, TypesType } from "../../types/bookTypes";
import { AppliedFilterType, AppliedSortsType } from "../../types/filters";

export interface FilterState {
  types: Array<TypesType>;
  authors: Array<AuthorsType>;
  appliedFilters: AppliedFilterType;
  appliedSorts: AppliedSortsType;
}
const initialState: FilterState = {
  types: [],
  authors: [],
  appliedFilters: {
    title: "",
    isbn: "",
    publisher: "",
    types: [],
    authors: [],
  },
  appliedSorts: {
    sortBy: null,
    sortOrder: null,
  },
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

    setAppliedFilter: (state, action) => {
      state.appliedFilters = action.payload;
    },

    resetAppliedFilter: (state) => {
      state.appliedFilters = {
        title: "",
        isbn: "",
        publisher: "",
        types: [],
        authors: [],
      };
    },

    setAppliedSorts: (state, action) => {
      state.appliedSorts = action.payload;
    },
  },
});

export const {
  setTypesFilter,
  setAuthorsFilter,
  setAppliedFilter,
  resetAppliedFilter,
  setAppliedSorts,
} = filterSlice.actions;

export default filterSlice.reducer;
