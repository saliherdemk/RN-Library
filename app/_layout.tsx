import { Redirect, Stack, useRouter } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { useEffect } from "react";
import { useAppSelector } from "../redux/hooks";

function Layout() {
  const user = useAppSelector((state) => state.userData.user);
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.replace("/login");
    } else {
      router.replace("/books");
    }
  }, [user]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default () => {
  return (
    <Provider store={store}>
      <Layout />
    </Provider>
  );
};
