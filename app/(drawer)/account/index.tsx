import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-elements";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { removeUser, setUserImageUrl } from "../../../redux/slicers/userSlicer";
import { supabase } from "../../../services/supabase";
import * as DocumentPicker from "expo-document-picker";

const Account = () => {
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const user = useAppSelector((state) => state.userData.user);
  const userimg = useAppSelector((state) => state.userData.userImageUrl);
  const dispatch = useAppDispatch();

  const router = useRouter();

  const handleProfilePhotoUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "image/*",
    });

    if (!result.canceled) {
      const file = {
        //@ts-expect-error
        uri: result.uri,
        name: user?.id,
        type: "image/*",
      };

      const { data, error } = await supabase.storage
        .from("avatars")
        //@ts-expect-error
        .upload(file.name, file, {
          contentType: "image/*",
        });

      if (error?.message == "The resource already exists") {
        const { data, error: updateError } = await supabase.storage
          .from("avatars")
          //@ts-expect-error
          .update(file.name, file, {
            contentType: "image/*",
            cacheControl: "3600",
            upsert: true,
          });
        updateError && alert("Error updating profile photo.");
      }
      dispatch(setUserImageUrl(file.uri));
    }
  };

  const handleSubmit = () => {
    setIsBtnLoading(true);
  };

  const singOut = async () => {
    const { error } = await supabase.auth.signOut();
    dispatch(removeUser(""));
  };

  return (
    <>
      <StatusBar />
      <View className="flex-1 mt-[20%] items-center">
        <TouchableOpacity
          className="rounded-full overflow-hidden w-40 h-40 bg-white shadow "
          onPress={handleProfilePhotoUpload}
        >
          {
            <Image
              source={
                userimg
                  ? { uri: userimg }
                  : require("../../../assets/cover_placeholder.png")
              }
              className="w-full h-full"
              resizeMode="cover"
            />
          }
        </TouchableOpacity>
        <Text>username</Text>

        <Text>{user?.email}</Text>

        <Button onPress={singOut} title="Sign Out"></Button>
      </View>
    </>
  );
};

export default Account;
