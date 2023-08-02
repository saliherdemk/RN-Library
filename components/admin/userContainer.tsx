import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import UserService from "../../services/userService";

const UserContainer = ({
  user,
  authRole,
}: {
  user: { role: Number; username: string };
  authRole: Number;
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
          <Picker.Item label="Admin" value={3} enabled={authRole > user.role} />
          <Picker.Item
            label="Moderator"
            value={2}
            enabled={authRole > user.role}
          />
          <Picker.Item label="User" value={1} enabled={authRole > user.role} />
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
