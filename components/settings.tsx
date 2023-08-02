import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { supabase } from "../services/supabase";
import { removeUser } from "../redux/slicers/userSlicer";
import { useDispatch } from "react-redux";

const Settings = ({
  roleVis,
  setIsSettingsOpen,
}: {
  roleVis: number;
  setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    dispatch(removeUser(""));
    setIsSettingsOpen(false);
  };

  return (
    <View className="absolute w-full h-full bg-black-rgba flex-1 items-center justify-center">
      <View className="bg-white w-5/6 rounded-lg my-6 flex">
        {roleVis > 1 && (
          <TouchableOpacity
            onPress={() => {
              router.push("adminDashboard");
              setIsSettingsOpen(false);
            }}
            className="border-t-2 p-4  border-gray-200"
          >
            <Text className="text-center text-sky-600">Admin Dashboard</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={signOut}
          className="border-t-2 p-4  border-gray-200"
        >
          <Text className="text-center">Sign Out</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsSettingsOpen(false)}
          className="border-t-2 p-4  border-gray-200"
        >
          <Text className="text-center">Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Settings;
