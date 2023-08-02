import { Fontisto, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Settings from "../../../components/settings";
import { COVER_URL_PREFIX } from "../../../helper/coverUrlPrefix";
import { useAppSelector } from "../../../redux/hooks";
import UserService from "../../../services/userService";

const Account = () => {
  const user = useAppSelector((state) => state.userData.user);
  const userData = useAppSelector((state) => state.userData.data);
  const favBooks = userData.favBooks;
  const books = userData.userBooks;
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [shownBooks, setShownBooks] = useState(books);
  const [switchToFav, setSwitchToFav] = useState(false);
  const [userRole, setUserRole] = useState<{ name: string; vis: Number }>({
    name: "user",
    vis: 1,
  });

  const router = useRouter();

  const fetchRole = async () => {
    const data = await UserService.getUserByUsername(
      user?.user_metadata.username
    );
    //@ts-expect-error
    data?.role && setUserRole(data?.role);
  };
  useEffect(() => {
    fetchRole();
  });

  useEffect(() => {
    setShownBooks(switchToFav ? favBooks : books);
  }, [switchToFav, favBooks]);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-white items-center pt-12">
        <View className="w-full px-10">
          <Text className="text-xl font-semibold my-1  text-center">
            {(user?.user_metadata.username).toUpperCase()}
          </Text>
          <TouchableOpacity
            onPress={() => setIsSettingsOpen(true)}
            className="absolute right-5 top-5"
          >
            <Ionicons name="settings" size={24} color="black" />
          </TouchableOpacity>
        </View>
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
      {isSettingsOpen && (
        <Settings
          roleVis={Number(userRole.vis)}
          setIsSettingsOpen={setIsSettingsOpen}
        />
      )}
    </SafeAreaView>
  );
};

export default Account;
