import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#3B82F6',

                tabBarIcon: ({ color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'star';

                    if (route.name === 'index') iconName = 'star';
                    else if (route.name === 'events') iconName = 'calendar';
                    else if (route.name === 'saved') iconName = 'bookmark';
                    else if (route.name === 'weekly') iconName = 'trophy';
                    else if (route.name === 'settings') iconName = 'menu';

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tabs.Screen name="index" options={{ title: 'Start' }} />
            <Tabs.Screen name="events" options={{ title: 'Events' }} />
            <Tabs.Screen name="saved" options={{ title: 'Gemerkt' }} />
            <Tabs.Screen name="weekly" options={{ title: 'Weekly' }} />
            <Tabs.Screen name="settings" options={{ title: 'Mehr' }} />
        </Tabs>
    );
}