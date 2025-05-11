import { Text } from "react-native";
import { Tabs } from "expo-router";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          position: "absolute",
          height: 64,
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: "white",
        },
        tabBarItemStyle: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        headerShown: false,
      }}
    >
      {/* Home Page */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="home"
              size={24}
              color={focused ? "#EC4899" : "#9CA3AF"}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{ fontSize: 12, color: focused ? "#EC4899" : "#9CA3AF" }}
            >
              Home
            </Text>
          ),
        }}
      />

      {/* Notes Page */}
      <Tabs.Screen
        name="notes"
        options={{
          title: "Notes",
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="notes"
              size={24}
              color={focused ? "#EC4899" : "#9CA3AF"}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{ fontSize: 12, color: focused ? "#EC4899" : "#9CA3AF" }}
            >
              Notes
            </Text>
          ),
        }}
      />

      {/* Gallery Page */}
      <Tabs.Screen
        name="gallery"
        options={{
          title: "Gallery",
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="picture"
              size={24}
              color={focused ? "#EC4899" : "#9CA3AF"}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{ fontSize: 12, color: focused ? "#EC4899" : "#9CA3AF" }}
            >
              Gallery
            </Text>
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
