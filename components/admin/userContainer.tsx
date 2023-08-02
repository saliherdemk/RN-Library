import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import UserService from "../../services/userService";

const UserContainer = ({
  user,
}: {
  user: { role: Number; username: string };
}) => {
  const [selectedRole, setSelectedRole] = useState(user.role);

  const handleSave = async () => {
    const err = await UserService.editUserRole(user.username, selectedRole);
    err && Alert.alert("Something went wrong");
  };

  return (
    <View className="bg-white p-4 mb-4">
      <Text className="text-center text-lg">{user.username}</Text>

      <View className="flex-1">
        <Picker
          className="border-2 border-gray-500"
          selectedValue={selectedRole}
          onValueChange={(itemValue, itemIndex) => setSelectedRole(itemValue)}
        >
          <Picker.Item label="Admin" value={3} enabled={false} />
          <Picker.Item label="Moderator" value={2} />
          <Picker.Item label="User" value={1} />
        </Picker>
      </View>
      <View className="flex-1 flex-row">
        <TouchableOpacity
          onPress={handleSave}
          className="flex-1 bg-blue-500 p-3 rounded"
        >
          <Text className="text-center text-white">Edit Role</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserContainer;
