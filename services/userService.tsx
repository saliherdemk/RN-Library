import { supabase } from "./supabase";

const getUserByUsername = async (username: string) => {
  const { data: userData, error } = await supabase
    .from("users")
    .select("id,role(name,vis)")
    .eq("username", username)
    .single();
  return userData;
};

const getUserByVis = async (visId: Number) => {
  const { data, error } = await supabase
    .from("users")
    .select()
    .lt("role", visId);
  return data;
};

const getAllUsers = async () => {
  const { data } = await supabase.from("users").select();
  return data;
};

const editUserRole = async (username: string, role_vis: Number) => {
  const { error } = await supabase
    .from("users")
    .update({ role: role_vis })
    .eq("username", username);

  return error;
};

const UserService = {
  getUserByUsername,
  getAllUsers,
  getUserByVis,
  editUserRole,
};

export default UserService;
