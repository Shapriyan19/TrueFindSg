import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 70,
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons name="home" color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="flag"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons name="flag" color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons name="magnify" color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name="account-circle-outline"
              color={color}
              size={28}
            />
          ),
        }}
      />
    </Tabs>
  );
}
