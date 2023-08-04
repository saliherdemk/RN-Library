import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import UserService from "../../services/userService";
import Button from "../Button";
import Container from "../Container";

const UserContainer = ({
  user,
  authRole,
  updateUser,
}: {
  user: { role: Number; username: string };
  authRole: Number;
  updateUser: (username: string, newRole: Number) => void;
}) => {
  const [selectedRole, setSelectedRole] = useState(user.role);
  const [isBtnLoading, setIsBtnLoading] = useState(false);

  const handleSave = async () => {
    setIsBtnLoading(true);
    const err = await UserService.editUserRole(user.username, selectedRole);
    err && Alert.alert("Something went wrong");
    Alert.alert("Completed!", "User Role edited successfully");
    updateUser(user.username, selectedRole);
    setIsBtnLoading(false);
  };

  return (
    <View className="bg-white p-4 mb-4">
      <Text className="text-center text-lg">{user.username}</Text>

      <Container>
        <Picker
          className="border-2 border-gray-500"
          selectedValue={selectedRole}
          onValueChange={(itemValue, itemIndex) => setSelectedRole(itemValue)}
        >
          <Picker.Item label="Admin" value={3} />
          <Picker.Item label="Moderator" value={2} />
          <Picker.Item label="User" value={1} />
        </Picker>
      </Container>
      <Button
        classList="flex-1"
        onPress={handleSave}
        title="Edit Role"
        isLoading={isBtnLoading}
      />
    </View>
  );
};

export default UserContainer;
