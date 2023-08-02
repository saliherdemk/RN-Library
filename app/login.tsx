import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../components/Logo";
import { isEmailValid } from "../helper/validateEmail";
import { useAppDispatch } from "../redux/hooks";
import { setBooks } from "../redux/slicers/bookSlicer";
import {
  setAuthorsFilter,
  setTypesFilter,
} from "../redux/slicers/filterSlicer";
import { setUser, setUserData } from "../redux/slicers/userSlicer";
import BookService from "../services/bookService";
import FilterService from "../services/filterService";
import { supabase } from "../services/supabase";

const Login = () => {
  const [email, setEmail] = useState("asffjd@gmail.com");
  const [password, setPassword] = useState("123456");
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [error, setError] = useState<String | null>(null);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const clear = () => {
    setEmail("");
    setPassword("");
    setIsBtnLoading(false);
  };

  const checkErrors = () => {
    setError(null);
    if (!email || !password) {
      alert("All Fields Required");
      setIsBtnLoading(false);

      return true;
    }

    if (!isEmailValid(email)) {
      setError("Please enter a valid email.");
      setIsBtnLoading(false);
      return true;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters");
      setIsBtnLoading(false);
      return true;
    }
  };

  const handleLogIn = async () => {
    setIsBtnLoading(true);
    if (checkErrors()) return;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error?.status) {
      setError("Invalid credentials");
      clear();
      return;
    }
    if (data.user) {
      const userBooks = await BookService.getUsersBooks(data.user.id);
      const favBooks = await BookService.getUsersFavBooks(data.user.id);

      dispatch(setUser(data.user));
      dispatch(
        setUserData({
          userBooks,
          favBooks,
        })
      );

      dispatch(setBooks(await BookService.getBooks()));
      dispatch(setTypesFilter(await FilterService.getAllTypeFilters()));
      dispatch(setAuthorsFilter(await FilterService.getAllAuthorFilters()));
      return;
    }
    setError("Unexpected error");
    setIsBtnLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center ">
      <StatusBar style="auto" />

      <View className="w-5/6 px-8 py-5 flex bg-white rounded-md shadow items-center">
        <Logo />
        {error && <Text className="text-rose-500">{error}</Text>}
        <TextInput
          keyboardType="email-address"
          className="w-full h-12 p-2.5 text-black mt-2.5 border border-gray-200 rounded focus:border-sky-300"
          placeholder="Email"
          placeholderTextColor="#808080"
          value={email}
          onChangeText={(email) => setEmail(email)}
        />
        <TextInput
          className="w-full h-12 p-2.5 text-black mt-2.5 border border-gray-200 rounded focus:border-sky-300"
          placeholder="Password"
          placeholderTextColor="#808080"
          secureTextEntry={true}
          value={password}
          onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity className="w-full my-3">
          <Text className="text-right text-blue-500">Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogIn}
          className="w-full bg-blue-500 rounded py-2"
        >
          {isBtnLoading ? (
            <ActivityIndicator className="h-6" color="#f2f2f2" size={30} />
          ) : (
            <Text className="text-center text-white font-semibold text-base">
              Sign In
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            router.push("register");
          }}
          className="w-full my-2 flex flex-row justify-center gap-x-1"
        >
          <Text className="">Don't you have an account?</Text>
          <Text className="text-blue-500">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Login;
