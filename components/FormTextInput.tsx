import { View, Text, TextInput } from "react-native";
import React from "react";

interface FormTextInputProps {
  label: string;
  placeHolder?: string;
  value: string;
  readOnly?: boolean;
  setValue?: React.Dispatch<React.SetStateAction<string>> | null;
  secureTextEntry?: boolean;
  keyboardType?:
    | "default"
    | "number-pad"
    | "decimal-pad"
    | "numeric"
    | "email-address"
    | "phone-pad"
    | "url";
}

export default function FormTextInput({
  label,
  placeHolder = "",
  value,
  readOnly = false,
  setValue = null,
  keyboardType = "default",
  secureTextEntry = false,
}: FormTextInputProps) {
  return (
    <View className="w-full my-2">
      {label.length > 0 && <Text className="text-lg">{label}</Text>}
      {readOnly || !setValue ? (
        <Text className="w-full bg-gray-50 text-lg pt-2.5 text-center text-black mt-2.5 border border-gray-200 rounded">
          {value}
        </Text>
      ) : (
        <TextInput
          className="w-full bg-white h-12 p-2.5 text-black mt-2.5 border border-gray-200 rounded focus:border-sky-300"
          placeholderTextColor="#808080"
          placeholder={placeHolder}
          value={value}
          onChangeText={(value) => setValue(value)}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
        />
      )}
    </View>
  );
}
