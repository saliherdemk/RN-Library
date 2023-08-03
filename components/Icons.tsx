import { Fontisto, MaterialIcons } from "@expo/vector-icons";

export function Favorite({ isActive }: { isActive: boolean }) {
  return <Fontisto name="favorite" size={24} />;
}

export function GridOn({ isActive }: { isActive: boolean }) {
  return <MaterialIcons name="grid-on" size={24} />;
}
