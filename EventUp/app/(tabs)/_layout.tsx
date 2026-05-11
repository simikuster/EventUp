import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    useWindowDimensions,
    Platform,
} from 'react-native';

type TabIconProps = {
    name: keyof typeof Ionicons.glyphMap;
    focused: boolean;
    label: string;
    sideNavigation: boolean;
    isTabletLandscape: boolean;
};

function getTabConfig(routeName: string, focused: boolean) {
    const map: Record<
        string,
        {
            icon: keyof typeof Ionicons.glyphMap;
            label: string;
        }
    > = {
        index: {
            icon: focused ? 'star' : 'star-outline',
            label: 'Start',
        },

        events: {
            icon: focused ? 'calendar' : 'calendar-outline',
            label: 'Events',
        },

        saved: {
            icon: focused ? 'bookmark' : 'bookmark-outline',
            label: 'Gemerkt',
        },

        weekly: {
            icon: focused ? 'trophy' : 'trophy-outline',
            label: 'Weekly',
        },

        settings: {
            icon: focused ? 'menu' : 'menu-outline',
            label: 'Mehr',
        },
    };

    return (
        map[routeName] ?? {
            icon: 'ellipse',
            label: '',
        }
    );
}

function TabIcon({
    name,
    focused,
    label,
    sideNavigation,
    isTabletLandscape,
}: TabIconProps) {
    return (
        <View
            style={[
                styles.tabItem,
                sideNavigation && styles.tabItemSide,
            ]}
        >
            <View
                style={[
                    styles.iconWrapper,
                    sideNavigation && styles.iconWrapperSide,
                    isTabletLandscape && styles.iconWrapperTablet,
                    focused && styles.iconWrapperActive,
                ]}
            >
                <Ionicons
                    name={name}
                    size={isTabletLandscape ? 24 : 22}
                    color={focused ? '#fff' : 'rgba(255,255,255,0.35)'}
                />
            </View>

            <Text
                style={[
                    styles.tabLabel,
                    sideNavigation && styles.tabLabelSide,
                    isTabletLandscape && styles.tabLabelTablet,
                    focused && styles.tabLabelActive,
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
            >
                {label}
            </Text>
        </View>
    );
}

function CustomTabBar({ state, navigation, sideNavigation, isTabletLandscape }: any) {
    return (
        <View
            style={[
                styles.tabBarShell,
                sideNavigation && styles.tabBarShellSide,
                isTabletLandscape && styles.tabBarShellTabletSide,
            ]}
        >
            <View
                style={[
                    styles.tabBar,
                    sideNavigation && styles.tabBarSide,
                    isTabletLandscape && styles.tabBarTabletSide,
                ]}
            >
                {state.routes.map((route: any, index: number) => {
                    const focused = state.index === index;
                    const { icon, label } = getTabConfig(route.name, focused);

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!focused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    return (
                        <TouchableOpacity
                            key={route.key}
                            activeOpacity={0.82}
                            onPress={onPress}
                            style={[
                                styles.tabPressArea,
                                sideNavigation && styles.tabPressAreaSide,
                            ]}
                        >
                            <TabIcon
                                name={icon}
                                focused={focused}
                                label={label}
                                sideNavigation={sideNavigation}
                                isTabletLandscape={isTabletLandscape}
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

export default function TabLayout() {
    const { width, height } = useWindowDimensions();

    const isLandscape = width > height;
    const isTablet = Math.min(width, height) >= 600;

    // Genau nach Wunsch:
    // Handy Hochformat  -> unten
    // Handy Querformat  -> links
    // Tablet Hochformat -> unten
    // Tablet Querformat -> links
    const sideNavigation = isLandscape;
    const isTabletLandscape = isTablet && isLandscape;

    return (
        <Tabs
            tabBar={(props) => (
                <CustomTabBar
                    {...props}
                    sideNavigation={sideNavigation}
                    isTabletLandscape={isTabletLandscape}
                />
            )}
            screenOptions={{
                headerShown: false,
                tabBarPosition: sideNavigation ? 'left' : 'bottom',
                sceneStyle: {
                    backgroundColor: '#0a0d14',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Start',
                }}
            />

            <Tabs.Screen
                name="events"
                options={{
                    title: 'Events',
                }}
            />

            <Tabs.Screen
                name="saved"
                options={{
                    title: 'Gemerkt',
                }}
            />

            <Tabs.Screen
                name="weekly"
                options={{
                    title: 'Weekly',
                }}
            />

            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Mehr',
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({

    tabBarShell: {
        backgroundColor: '#0a0d14',
        paddingHorizontal: 14,
        paddingTop: 8,
        paddingBottom: Platform.OS === 'ios' ? 22 : 14,
    },

    tabBarShellSide: {
        width: 118,
        paddingTop: Platform.OS === 'ios' ? 42 : 26,
        paddingBottom: 22,
        paddingLeft: 12,
        paddingRight: 10,
    },

    tabBarShellTabletSide: {
        width: 138,
        paddingTop: Platform.OS === 'ios' ? 54 : 36,
        paddingBottom: 28,
        paddingLeft: 16,
        paddingRight: 12,
    },

    tabBar: {
        height: 78,
        borderRadius: 30,
        backgroundColor: 'rgba(15,18,28,0.96)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        paddingHorizontal: 5,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.35,
        shadowRadius: 24,
        elevation: 20,
    },

    tabBarSide: {
        flex: 1,
        height: undefined,
        width: '100%',
        borderRadius: 32,
        paddingHorizontal: 8,
        paddingVertical: 12,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },

    tabBarTabletSide: {
        borderRadius: 36,
        paddingHorizontal: 10,
        paddingVertical: 18,
    },

    tabPressArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 0,
    },

    tabPressAreaSide: {
        width: '100%',
        flex: 1,
    },

    tabItem: {
        width: '100%',
        minWidth: 0,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },

    tabItemSide: {
        gap: 6,
    },

    iconWrapper: {
        width: 42,
        height: 32,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
    },

    iconWrapperSide: {
        width: 52,
        height: 40,
        borderRadius: 16,
    },

    iconWrapperTablet: {
        width: 58,
        height: 46,
        borderRadius: 18,
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

    tabLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.35)',
        letterSpacing: 0.2,
        textAlign: 'center',
        maxWidth: 64,
    },

    tabLabelSide: {
        fontSize: 10,
        maxWidth: 86,
    },

    tabLabelTablet: {
        fontSize: 12,
        maxWidth: 108,
    },

    tabLabelActive: {
        color: '#00c6ff',
    },
});