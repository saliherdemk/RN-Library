import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

function Checkbox({
  title,
  setValues,
  initialValue,
}: {
  title: string;
  setValues: React.Dispatch<React.SetStateAction<Array<string>>>;
  initialValue: boolean;
}) {
  const [checked, setChecked] = useState(initialValue);

  useEffect(() => {
    if (checked) {
      setValues((values) => [...values, title]);
      return;
    }
    setValues((values) => values.filter((a) => a != title));
  }, [checked]);

  return (
    <View className="flex flex-row justify-center items-center mx-3 my-2">
      <Text>{title}</Text>
      <Pressable
        className={`ml-1 w-6 h-6 justify-center items-center border-2 ${
          checked ? "bg-sky-300" : "bg-white"
        } rounded`}
        onPress={() => setChecked(!checked)}
      >
        {checked && <Ionicons name="checkmark" size={16} color="white" />}
      </Pressable>
    </View>
  );
}

export default Checkbox;