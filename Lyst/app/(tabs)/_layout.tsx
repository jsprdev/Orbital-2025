import { Image, Text } from "react-native";
import { Tabs } from "expo-router";
import { COLORS } from "@/constants/colors";
import Fontisto from '@expo/vector-icons/Fontisto';

const TabLayout = () => {
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
      <Tabs.Screen
        name="YourLyst"
        options={{
          title: "YourLyst",
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/icons/heart.png")}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? COLORS.primary : COLORS.unfocused,
                resizeMode: "contain",
              }}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontSize: 12,
                color: focused ? COLORS.primary : COLORS.unfocused,
              }}
            >
              Your Lyst
            </Text>
          ),
        }}
      />

        <Tabs.Screen
          name="Gallery"
          options={{
            title: "Gallery",
            tabBarIcon: ({ focused }) => (
              <Fontisto
                name="photograph"
                size={24}
                color={focused ? COLORS.primary : COLORS.unfocused}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  fontSize: 12,
                  color: focused ? COLORS.primary : COLORS.unfocused,
                }}
              >
                Gallery
              </Text>
            ),
          }}
        />

      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/icons/profile.png")}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? COLORS.primary : COLORS.unfocused,
              }}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontSize: 12,
                color: focused ? COLORS.primary : COLORS.unfocused,
              }}
            >
              Profile
            </Text>
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
