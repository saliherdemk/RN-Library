import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-elements";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { removeUser, setUserImageUrl } from "../../../redux/slicers/userSlicer";
import { supabase } from "../../../services/supabase";
const Account = () => {
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const user = useAppSelector((state) => state.userData.user);
  const userimg = useAppSelector((state) => state.userData.userImageUrl);
  const dispatch = useAppDispatch();

  const router = useRouter();

  const uploadFromURI = async (photo: any) => {
    let uri = photo.assets[0].uri;
    const ext = uri.substring(uri.lastIndexOf(".") + 1);

    const fileName = user?.id as string;

    var formData = new FormData();
    const fileData = {
      uri: uri,
      name: fileName,
      type: photo.assets[0].type ? `image/${ext}` : `video/${ext}`,
    };

    const blob = new Blob([JSON.stringify(fileData)], {
      type: "application/json",
    });
    formData.append("files", blob);

    const { data: _, error: updateErr } = await supabase.storage
      .from("avatars")
      .update(fileName, formData, {
        cacheControl: "3600",
        upsert: true,
      });
    if (updateErr?.message == "The resource was not found") {
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(fileName, formData);
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      dispatch(setUserImageUrl(result.assets[0].uri));

      await uploadFromURI(result);
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
          onPress={pickImage}
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

        <Button
          onPress={() => {
            singOut();
            router.replace("/login");
          }}
          title="Sign Out"
        ></Button>
      </View>
    </>
  );
};

export default Account;
