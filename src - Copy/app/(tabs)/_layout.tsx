import { Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View style={styles.tabIconContainer}>
      <Text style={[styles.tabEmoji, focused && styles.tabEmojiFocused]}>
        {emoji}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#8b5cf6',
        tabBarInactiveTintColor: '#52525b',
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dərslər',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📚" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="vocabulary"
        options={{
          title: 'Lüğətim',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📖" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👤" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#13132b',
    borderTopWidth: 1,
    borderTopColor: 'rgba(139, 92, 246, 0.15)',
    height: 80,
    paddingTop: 12,
    paddingBottom: 20,
    position: 'absolute',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  tabItem: { paddingVertical: 4 },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabEmoji: { fontSize: 22, opacity: 0.5 },
  tabEmojiFocused: { opacity: 1 },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});