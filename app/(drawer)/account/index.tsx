import { Fontisto, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import Container from "../../../components/Container";
import Loading from "../../../components/Loading";
import ProfileBookComponent from "../../../components/ProfileBookComponent";
import Settings from "../../../components/Settings";
import SwitchMenu from "../../../components/SwitchMenu";
import AccountHeaderContainer from "../../../components/headers/AccountHeaderContainer";
import { useAppSelector } from "../../../redux/hooks";
import UserService from "../../../services/userService";
import { BookType } from "../../../types/bookTypes";
import NoBooks from "../../../components/NoBooks";

const Account = () => {
  const user = useAppSelector((state) => state.userData.user);
  const userData = useAppSelector((state) => state.userData.data);
  const favBooks = userData.favBooks;
  const books = userData.userBooks;
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [shownBooks, setShownBooks] = useState(books);
  const [switchToFav, setSwitchToFav] = useState(false);
  const [userRole, setUserRole] = useState<{ name: string; vis: Number }>({
    name: "user",
    vis: 1,
  });

  const fetchRole = async () => {
    const data = await UserService.getUserByUsername(
      user?.user_metadata.username
    );
    //@ts-expect-error
    data?.role && setUserRole(data?.role);
    setIsLoading(false);
  };
  useEffect(() => {
    fetchRole();
  });

  useEffect(() => {
    setShownBooks(switchToFav ? favBooks : books);
  }, [switchToFav, favBooks]);

  const renderItem = ({ item }: { item: BookType }) => (
    <ProfileBookComponent
      isbn={item.isbn}
      cover_url_suffix={item.cover_url_suffix}
    />
  );

  const keyExtractor = (item: BookType) => item.isbn;

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Container classList="bg-white items-center pt-6">
            <View className="w-full px-10">
              <AccountHeaderContainer
                title={(user?.user_metadata.username).toUpperCase()}
              />

              <TouchableOpacity
                onPress={() => setIsSettingsOpen(true)}
                className="absolute right-5 top-5"
              >
                <Ionicons name="settings" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <Text className="text-sm text-gray-600 ">{user?.email}</Text>
            <SwitchMenu
              switchValue={switchToFav}
              setSwitchValue={setSwitchToFav}
              iconLeft={
                <MaterialIcons
                  name="grid-on"
                  size={24}
                  color={!switchToFav ? "black" : "gray"}
                />
              }
              iconRight={
                <Fontisto
                  name="favorite"
                  size={24}
                  color={switchToFav ? "black" : "gray"}
                />
              }
            />
            <FlatList
              data={shownBooks}
              numColumns={3}
              className="w-full"
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              ListEmptyComponent={() => (
                <NoBooks
                  text={
                    !switchToFav
                      ? "You Haven't Published Any Books Yet"
                      : "No Saved Books Yet"
                  }
                  icon={
                    switchToFav && (
                      <Ionicons name="md-book" size={100} color="black" />
                    )
                  }
                />
              )}
            />
          </Container>
          {isSettingsOpen && (
            <Settings
              roleVis={Number(userRole.vis)}
              setIsSettingsOpen={setIsSettingsOpen}
            />
          )}
        </>
      )}
    </>
  );
};

export default Account;
