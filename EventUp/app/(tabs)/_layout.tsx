import { withLayoutContext } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { Ionicons } from '@expo/vector-icons';

import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

const { Navigator } = createMaterialTopTabNavigator();

const MaterialTopTabs = withLayoutContext(Navigator);

function TabIcon({
    name,
    focused,
    label,
}: {
    name: keyof typeof Ionicons.glyphMap;
    focused: boolean;
    label: string;
}) {
    return (
        <View style={styles.tabItem}>
            <View
                style={[
                    styles.iconWrapper,
                    focused && styles.iconWrapperActive,
                ]}
            >
                <Ionicons
                    name={name}
                    size={22}
                    color={focused ? '#fff' : 'rgba(255,255,255,0.35)'}
                />
            </View>

            <Text
                style={[
                    styles.tabLabel,
                    focused && styles.tabLabelActive,
                ]}
            >
                {label}
            </Text>
        </View>
    );
}

export default function TabLayout() {
    return (
        <MaterialTopTabs
            tabBarPosition="bottom"
            screenOptions={({ route }) => ({
                swipeEnabled: true,

                animationEnabled: true,

                lazy: true,

                tabBarShowLabel: false,

                tabBarStyle: styles.tabBar,

                sceneStyle: {
                    backgroundColor: '#0a0d14',
                },

                tabBarIndicatorStyle: {
                    backgroundColor: 'transparent',
                },

                tabBarIcon: ({ focused }) => {
                    type IconMap = {
                        [key: string]: {
                            icon: keyof typeof Ionicons.glyphMap;
                            label: string;
                        };
                    };

                    const map: IconMap = {
                        index: {
                            icon: focused
                                ? 'star'
                                : 'star-outline',
                            label: 'Start',
                        },

                        events: {
                            icon: focused
                                ? 'calendar'
                                : 'calendar-outline',
                            label: 'Events',
                        },

                        saved: {
                            icon: focused
                                ? 'bookmark'
                                : 'bookmark-outline',
                            label: 'Gemerkt',
                        },

                        weekly: {
                            icon: focused
                                ? 'trophy'
                                : 'trophy-outline',
                            label: 'Weekly',
                        },

                        settings: {
                            icon: focused
                                ? 'menu'
                                : 'menu-outline',
                            label: 'Mehr',
                        },
                    };

                    const { icon, label } =
                        map[route.name] ?? {
                            icon: 'ellipse',
                            label: '',
                        };

                    return (
                        <TabIcon
                            name={icon}
                            focused={focused}
                            label={label}
                        />
                    );
                },
            })}
        >
            <MaterialTopTabs.Screen
                name="index"
                options={{
                    title: 'Start',
                }}
            />

            <MaterialTopTabs.Screen
                name="events"
                options={{
                    title: 'Events',
                }}
            />

            <MaterialTopTabs.Screen
                name="saved"
                options={{
                    title: 'Gemerkt',
                }}
            />

            <MaterialTopTabs.Screen
                name="weekly"
                options={{
                    title: 'Weekly',
                }}
            />

            <MaterialTopTabs.Screen
                name="settings"
                options={{
                    title: 'Mehr',
                }}
            />
        </MaterialTopTabs>
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
        paddingTop: 12,

        shadowColor: '#000',

        shadowOffset: {
            width: 0,
            height: 8,
        },

        shadowOpacity: 0.35,
        shadowRadius: 24,

        elevation: 20,
    },

    // ── TAB ITEM ──

    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',

        gap: 4,

        marginTop: -10,

        width: 90,
    },

    // ── ICON ──

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

        shadowOffset: {
            width: 0,
            height: 0,
        },

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
