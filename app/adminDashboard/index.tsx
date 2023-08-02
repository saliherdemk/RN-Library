import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import UserService from "../../services/userService";
import { Stack } from "expo-router";
import { FlatList, TouchableOpacity } from "react-native";
import UserContainer from "../../components/admin/userContainer";
import { useAppSelector } from "../../redux/hooks";
import BookService from "../../services/bookService";
import BookContainer from "../../components/admin/bookContainer";
import { Fontisto, MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

const AdminDashboard = () => {
  const [users, setUsers] = useState<
    Array<{ created_at: string; id: string; role: Number; username: string }>
  >([]);
  const user = useAppSelector((state) => state.userData.user);

  const books = useAppSelector((state) => state.bookData.books);
  const [showBooks, setShowBooks] = useState(true);
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
  };

  const fetchData = async () => {
    const usersData = await UserService.getUserByVis(userRole.vis);

    usersData && setUsers(usersData);
  };

  useEffect(() => {
    fetchData();
  }, [userRole]);

  useEffect(() => {
    fetchRole();
  }, [user]);

  return (
    <View>
      <View className="flex-row px-3 pt-0 my-2">
        <Pressable
          disabled={Number(userRole.vis) < 3}
          onPress={() => {
            setShowBooks(false);
          }}
          className={` flex-1 items-center pt-2 ${
            Number(userRole.vis) < 3 && "opacity-25"
          }`}
        >
          <AntDesign name="addusergroup" size={24} color="black" />
        </Pressable>
        <Pressable
          onPress={() => {
            setShowBooks(true);
          }}
          className={` flex-1 items-center pt-2`}
        >
          <Entypo name="book" size={24} color="black" />
        </Pressable>
      </View>
      {showBooks ? (
        <FlatList
          data={books}
          className="p-3"
          renderItem={({ item }) => <BookContainer book={item} />}
          keyExtractor={(item) => item.isbn}
        />
      ) : (
        <FlatList
          data={users}
          className="p-3"
          renderItem={({ item }) => <UserContainer user={item} />}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

export default AdminDashboard;
