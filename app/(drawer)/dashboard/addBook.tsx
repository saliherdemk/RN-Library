import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";

const AddBook = () => {
  const [title, setTitle] = useState("");
  const [isbn, setIsbn] = useState("");
  const [type, setType] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isBtnLoading, setIsBtnLoading] = useState(false);

  const router = useRouter();
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    setIsBtnLoading(true);
  };

  return (
    <>
      <View className="flex-1 py-12 items-center px-8 gap-3">
        <Text className="text-lg">Cover</Text>
        <TouchableOpacity
          className="rounded-full overflow-hidden w-40 h-40 bg-white shadow "
          onPress={pickImage}
        >
          {
            <Image
              source={
                image
                  ? { uri: image }
                  : require("../../../assets/cover_placeholder.png")
              }
              className="w-full h-full"
              resizeMode="cover"
            />
          }
        </TouchableOpacity>

        <View className="w-full ">
          <Text className="text-lg">Title</Text>
          <TextInput
            className="w-full bg-white h-12 p-2.5 text-black mt-2.5 border border-gray-200 rounded focus:border-sky-300"
            placeholderTextColor="#808080"
            value={title}
            onChangeText={(title) => setTitle(title)}
          />
        </View>

        <View className="w-full ">
          <Text className="text-lg">ISBN</Text>
          <TextInput
            className="w-full bg-white h-12 p-2.5 text-black mt-2.5 border border-gray-200 rounded focus:border-sky-300"
            placeholderTextColor="#808080"
            value={isbn}
            onChangeText={(isbn) => setIsbn(isbn)}
          />
        </View>

        <View className="w-full ">
          <Text className="text-lg">Type</Text>
          <TextInput
            className="w-full bg-white h-12 p-2.5 text-black mt-2.5 border border-gray-200 rounded focus:border-sky-300"
            placeholderTextColor="#808080"
            value={type}
            onChangeText={(type) => setType(type)}
          />
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          className="w-full bg-green-500 rounded py-2"
        >
          {isBtnLoading ? (
            <ActivityIndicator className="h-6" color="#f2f2f2" size={30} />
          ) : (
            <Text className="text-center text-white font-semibold text-base">
              Add
            </Text>
          )}
        </TouchableOpacity>
        <Pressable
          onPress={() => {
            router.back();
          }}
          className="w-full bg-rose-500 rounded py-2 "
        >
          <Text className="text-center text-white font-semibold text-base">
            Cancel
          </Text>
        </Pressable>
      </View>
    </>
  );
};

export default AddBook;
