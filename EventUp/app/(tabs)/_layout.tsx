import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Platform } from 'react-native';

function TabIcon({
                     name,
                     color,
                     focused,
                     label,
                 }: {
    name: keyof typeof Ionicons.glyphMap;
    color: string;
    focused: boolean;
    label: string;
}) {
    return (
        <View style={styles.tabItem}>
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
                <Ionicons name={name} size={22} color={focused ? '#fff' : 'rgba(255,255,255,0.35)'} />
            </View>
            <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
                {label}
            </Text>
        </View>
    );
}

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: styles.tabBar,

                tabBarIcon: ({ color, focused }) => {
                    type IconMap = {
                        [key: string]: {
                            icon: keyof typeof Ionicons.glyphMap;
                            label: string;
                        };
                    };

                    const map: IconMap = {
                        index:    { icon: focused ? 'star'          : 'star-outline',          label: 'Start'   },
                        events:   { icon: focused ? 'calendar'      : 'calendar-outline',      label: 'Events'  },
                        saved:    { icon: focused ? 'bookmark'      : 'bookmark-outline',      label: 'Gemerkt' },
                        weekly:   { icon: focused ? 'trophy'        : 'trophy-outline',        label: 'Weekly'  },
                        settings: { icon: focused ? 'menu'          : 'menu-outline',          label: 'Mehr'    },
                    };

                    const { icon, label } = map[route.name] ?? { icon: 'ellipse', label: '' };

                    return (
                        <TabIcon
                            name={icon}
                            color={color}
                            focused={focused}
                            label={label}
                        />
                    );
                },
            })}
        >
            <Tabs.Screen name="index"    options={{ title: 'Start'   }} />
            <Tabs.Screen name="events"   options={{ title: 'Events'  }} />
            <Tabs.Screen name="saved"    options={{ title: 'Gemerkt' }} />
            <Tabs.Screen name="weekly"   options={{ title: 'Weekly'  }} />
            <Tabs.Screen name="settings" options={{ title: 'Mehr'    }} />
        </Tabs>
    );
}

const styles = StyleSheet.create({

    // ── TAB BAR ──
    tabBar: {
        position: 'absolute',
        bottom: 24,
        left: 20,
        right: 20,
        height: 72,
        borderRadius: 28,
        backgroundColor: 'rgba(15,18,28,0.96)',
        borderTopWidth: 0,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        paddingBottom: 0,
        paddingTop: 0,

        // Shadow iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 24,

        // Shadow Android
        elevation: 20,
    },

    // ── TAB ITEM ──
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        paddingTop: 6,
    },

    // ── ICON WRAPPER ──
    iconWrapper: {
        width: 42,
        height: 32,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapperActive: {
        backgroundColor: '#0072ff',
        shadowColor: '#00c6ff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
        elevation: 8,
    },

    // ── LABEL ──
    tabLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.35)',
        letterSpacing: 0.3,
    },
    tabLabelActive: {
        color: '#00c6ff',
    },
});