import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { BookType } from "../types/bookTypes";
import { supabase } from "./supabase";

const getAllTypeFilters = async () => {
  const { data, error } = await supabase.from("types").select("name");
  return data;
};

const getAllAuthorFilters = async () => {
  const { data, error } = await supabase.from("authors").select("name");
  return data;
};

const FilterService = { getAllTypeFilters, getAllAuthorFilters };

export default FilterService;
