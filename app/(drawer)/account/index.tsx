import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { FlatList, Image, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-elements";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { removeUser, setUserImageUrl } from "../../../redux/slicers/userSlicer";
import { supabase } from "../../../services/supabase";
import * as DocumentPicker from "expo-document-picker";
import { COVER_URL_PREFIX } from "../../../helper/coverUrlPrefix";
import { MaterialIcons, Fontisto } from '@expo/vector-icons';

const Account = () => {
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const user = useAppSelector((state) => state.userData.user);
  const userimg = useAppSelector((state) => state.userData.userImageUrl);
  const books = useAppSelector((state) => state.userData.userBooks);
  const [switchToFav, setSwitchToFav] = useState(false)

  const dispatch = useAppDispatch();

  const router = useRouter();

  const handleProfilePhotoUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "image/*",
    });

    if (result.type == "success") {
      const file = {
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
      <>
        <View className="flex-1 bg-white items-center pt-14">
        <TouchableOpacity
          className="rounded-full overflow-hidden w-36 h-36 bg-white shadow "
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
        <Text className="text-lg font-semibold my-1">{user?.user_metadata.username}</Text>
        <Text className="text-sm text-gray-600 ">{user?.email}</Text>
        <View className="flex-row px-3 pt-0 my-2">
          <Pressable className={`${!switchToFav && "border-t-2 "} flex-1 items-center pt-2`} onPress={()=> setSwitchToFav(false)}>
          <MaterialIcons name="grid-on" size={24} color={!switchToFav? "black": "gray"} />
          </Pressable>
          <Pressable className={`${switchToFav && "border-t-2 "} flex-1 items-center pt-2`} onPress={()=> setSwitchToFav(true)}>
          <Fontisto name="favorite" size={24} color={switchToFav? "black": "gray"} />
          </Pressable>

        </View>
        {books.length && <FlatList
        data={books}
        numColumns={3}
        renderItem={({item}) => <View className="w-[33%] p-1 aspect-square">
          <Image
        source={{
          uri: COVER_URL_PREFIX + item.cover_url_suffix,
        }}
        className="w-full h-full"
        resizeMode="cover"
      />
        </View>}
        keyExtractor={item => item.isbn}
      />}

        </View>
        {/* <Button onPress={singOut} title="Sign Out"></Button> */}
      </>
    </>
  );
};

export default Account;
