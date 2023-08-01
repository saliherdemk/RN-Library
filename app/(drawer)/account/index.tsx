import { Fontisto, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { COVER_URL_PREFIX } from "../../../helper/coverUrlPrefix";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { removeUser } from "../../../redux/slicers/userSlicer";
import { supabase } from "../../../services/supabase";

const Account = () => {
  const user = useAppSelector((state) => state.userData.user);
  const favBooks = useAppSelector((state) => state.userData.favBooks);
  const books = useAppSelector((state) => state.userData.userBooks);

  const [shownBooks, setShownBooks] = useState(books);
  const [switchToFav, setSwitchToFav] = useState(false);

  const dispatch = useAppDispatch();

  const router = useRouter();

  useEffect(() => {
    setShownBooks(switchToFav ? favBooks : books);
  }, [switchToFav]);

  const singOut = async () => {
    const { error } = await supabase.auth.signOut();
    dispatch(removeUser(""));
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-white items-center pt-12">
        <Text className="text-xl font-semibold my-1">
          {(user?.user_metadata.username).toUpperCase()}
        </Text>
        <Text className="text-sm text-gray-600 ">{user?.email}</Text>
        <View className="flex-row px-3 pt-0 my-2">
          <Pressable
            className={`${
              !switchToFav && "border-t-2 "
            } flex-1 items-center pt-2`}
            onPress={() => setSwitchToFav(false)}
          >
            <MaterialIcons
              name="grid-on"
              size={24}
              color={!switchToFav ? "black" : "gray"}
            />
          </Pressable>
          <Pressable
            className={`${
              switchToFav && "border-t-2 "
            } flex-1 items-center pt-2`}
            onPress={() => setSwitchToFav(true)}
          >
            <Fontisto
              name="favorite"
              size={24}
              color={switchToFav ? "black" : "gray"}
            />
          </Pressable>
        </View>
        {shownBooks.length > 0 && (
          <>
            <FlatList
              data={shownBooks}
              numColumns={3}
              className="w-full"
              renderItem={({ item }) => (
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "bookDetails/[isbn]",
                      params: { isbn: item.isbn },
                    })
                  }
                  className="w-[33%] p-1 aspect-square"
                >
                  <Image
                    source={{
                      uri: COVER_URL_PREFIX + item.cover_url_suffix,
                    }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </Pressable>
              )}
              keyExtractor={(item) => item.isbn}
            />
          </>
        )}
      </View>
      <Button onPress={singOut} title="Sign Out"></Button>
    </SafeAreaView>
  );
};

export default Account;
