import { AntDesign, Entypo } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import BookContainer from "../../components/admin/bookContainer";
import UserContainer from "../../components/admin/userContainer";
import { useAppSelector } from "../../redux/hooks";
import UserService from "../../services/userService";

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
    <View className="flex-1">
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
      <View className="flex-1">
        {showBooks ? (
          <FlatList
            data={books}
            className="px-3"
            renderItem={({ item }) => <BookContainer book={item} />}
            keyExtractor={(item) => item.isbn}
          />
        ) : (
          <FlatList
            data={users}
            className="px-3"
            renderItem={({ item }) => (
              <UserContainer user={item} authRole={userRole.vis} />
            )}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
    </View>
  );
};

export default AdminDashboard;
