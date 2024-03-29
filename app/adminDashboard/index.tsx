import { AntDesign, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import Container from "../../components/Container";
import Loading from "../../components/Loading";
import NoBooks from "../../components/NoBooks";
import SwitchMenu from "../../components/switchMenu";
import BookContainer from "../../components/admin/bookContainer";
import UserContainer from "../../components/admin/userContainer";
import { useAppSelector } from "../../redux/hooks";
import UserService from "../../services/userService";

const AdminDashboard = () => {
  const [users, setUsers] = useState<
    Array<{ created_at: string; id: string; role: Number; username: string }>
  >([]);
  const user = useAppSelector((state) => state.userData.user);
  const [isLoading, setIsLoading] = useState(true);
  const books = useAppSelector((state) => state.bookData.books);
  const [showBooks, setShowBooks] = useState(true);
  const [userRole, setUserRole] = useState<{ name: string; vis: Number }>({
    name: "user",
    vis: 1,
  });

  const updateUser = (username: string, newRole: Number) => {
    setUsers((curr) =>
      curr.map((u) => (u.username == username ? { ...u, role: newRole } : u))
    );
  };

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
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [userRole]);

  useEffect(() => {
    setIsLoading(true);
    fetchRole();
  }, [user]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Container classList="p-4">
          <Stack.Screen
            options={{ headerTitle: userRole.name + " Dashboard" }}
          />
          <SwitchMenu
            switchValue={showBooks}
            setSwitchValue={setShowBooks}
            iconLeft={
              <AntDesign
                name="addusergroup"
                size={24}
                color={!showBooks ? "black" : "gray"}
              />
            }
            iconRight={
              <Entypo
                name="book"
                size={24}
                color={showBooks ? "black" : "gray"}
              />
            }
            iconLeftDisabled={Number(userRole.vis) < 3}
          />

          <Container>
            {showBooks ? (
              <FlatList
                data={books}
                className="px-3"
                renderItem={({ item }) => <BookContainer book={item} />}
                keyExtractor={(item) => item.isbn}
                ListEmptyComponent={() => <NoBooks text="There is no books" />}
              />
            ) : (
              <FlatList
                data={users}
                className="px-3"
                renderItem={({ item }) => (
                  <UserContainer user={item} updateUser={updateUser} />
                )}
                ListEmptyComponent={() => (
                  <NoBooks
                    text="There is no user that you can edit"
                    icon={
                      <MaterialCommunityIcons
                        name="account-off"
                        size={100}
                        color="black"
                      />
                    }
                  />
                )}
                keyExtractor={(item) => item.id}
              />
            )}
          </Container>
        </Container>
      )}
    </>
  );
};

export default AdminDashboard;
