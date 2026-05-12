import PagerView from 'react-native-pager-view';
import { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import Home from './index';
import Events from './events';
import Saved from './saved';
import Weekly from './weekly';
import Settings from './settings';

type TabKey = 'index' | 'events' | 'saved' | 'weekly' | 'settings';

const TABS: { key: TabKey; icon: (focused: boolean) => any; label: string }[] = [
    { key: 'index',    icon: (f) => f ? 'star'     : 'star-outline',     label: 'Start'   },
    { key: 'events',   icon: (f) => f ? 'calendar' : 'calendar-outline', label: 'Events'  },
    { key: 'saved',    icon: (f) => f ? 'bookmark' : 'bookmark-outline', label: 'Gemerkt' },
    { key: 'weekly',   icon: (f) => f ? 'trophy'   : 'trophy-outline',   label: 'Weekly'  },
    { key: 'settings', icon: (f) => f ? 'menu'     : 'menu-outline',     label: 'Mehr'    },
];

const SCREENS = [Home, Events, Saved, Weekly, Settings];

export default function TabLayout() {
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const isTablet = Math.min(width, height) >= 600;
    const sideNavigation = isLandscape;
    const isTabletLandscape = isTablet && isLandscape;

    const [activeIndex, setActiveIndex] = useState(0);
    const pagerRef = useRef<PagerView>(null);

    const goToTab = (index: number) => {
        pagerRef.current?.setPage(index);
        setActiveIndex(index);
    };

    const BottomBar = (
        <View style={[styles.tabBarShell]}>
            <View style={styles.tabBar}>
                {TABS.map((tab, i) => {
                    const focused = activeIndex === i;
                    return (
                        <TouchableOpacity
                            key={tab.key}
                            activeOpacity={0.82}
                            onPress={() => goToTab(i)}
                            style={styles.tabPressArea}
                        >
                            <View style={styles.tabItem}>
                                <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
                                    <Ionicons
                                        name={tab.icon(focused)}
                                        size={22}
                                        color={focused ? '#fff' : 'rgba(255,255,255,0.35)'}
                                    />
                                </View>
                                <Text style={[styles.tabLabel, focused && styles.tabLabelActive]} numberOfLines={1}>
                                    {tab.label}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );

    const SideBar = (
        <View style={[styles.tabBarShellSide, isTabletLandscape && styles.tabBarShellTabletSide]}>
            <View style={[styles.tabBarSide, isTabletLandscape && styles.tabBarTabletSide]}>
                {TABS.map((tab, i) => {
                    const focused = activeIndex === i;
                    return (
                        <TouchableOpacity
                            key={tab.key}
                            activeOpacity={0.82}
                            onPress={() => goToTab(i)}
                            style={styles.tabPressAreaSide}
                        >
                            <View style={[styles.tabItem, styles.tabItemSide]}>
                                <View style={[
                                    styles.iconWrapper,
                                    styles.iconWrapperSide,
                                    isTabletLandscape && styles.iconWrapperTablet,
                                    focused && styles.iconWrapperActive,
                                ]}>
                                    <Ionicons
                                        name={tab.icon(focused)}
                                        size={isTabletLandscape ? 24 : 22}
                                        color={focused ? '#fff' : 'rgba(255,255,255,0.35)'}
                                    />
                                </View>
                                <Text style={[
                                    styles.tabLabel,
                                    styles.tabLabelSide,
                                    isTabletLandscape && styles.tabLabelTablet,
                                    focused && styles.tabLabelActive,
                                ]} numberOfLines={1}>
                                    {tab.label}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.root} edges={['bottom']}>
            <View style={[styles.container, sideNavigation && styles.containerLandscape]}>
                {sideNavigation && SideBar}

                <PagerView
                    ref={pagerRef}
                    style={styles.pager}
                    initialPage={0}
                    // Swipe nur im Portrait-Modus aktivieren (kein Side-Nav)
                    scrollEnabled={!sideNavigation}
                    onPageSelected={(e) => setActiveIndex(e.nativeEvent.position)}
                >
                    {SCREENS.map((Screen, i) => (
                        <View key={i} style={styles.page}>
                            <Screen />
                        </View>
                    ))}
                </PagerView>

                {!sideNavigation && BottomBar}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#0a0d14',
    },
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    containerLandscape: {
        flexDirection: 'row',
    },
    pager: {
        flex: 1,
    },
    page: {
        flex: 1,
        backgroundColor: '#0a0d14',
    },

    // ── BOTTOM NAV ──
    tabBarShell: {
        backgroundColor: '#0a0d14',
        paddingHorizontal: 14,
        paddingTop: 8,
        paddingBottom: Platform.OS === 'ios' ? 22 : 14,
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
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 24,
        elevation: 20,
    },
    tabPressArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },

    // ── SIDE NAV ──
    tabBarShellSide: {
        width: 118,
        paddingTop: Platform.OS === 'ios' ? 42 : 26,
        paddingBottom: 22,
        paddingLeft: 12,
        paddingRight: 10,
        backgroundColor: '#0a0d14',
    },
    tabBarShellTabletSide: {
        width: 138,
        paddingTop: Platform.OS === 'ios' ? 54 : 36,
        paddingBottom: 28,
        paddingLeft: 16,
        paddingRight: 12,
    },
    tabBarSide: {
        flex: 1,
        borderRadius: 32,
        backgroundColor: 'rgba(15,18,28,0.96)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        paddingHorizontal: 8,
        paddingVertical: 12,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 24,
        elevation: 20,
    },
    tabBarTabletSide: {
        borderRadius: 36,
        paddingHorizontal: 10,
        paddingVertical: 18,
    },
    tabPressAreaSide: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabItemSide: {
        gap: 6,
    },

    // ── ICONS & LABELS ──
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
        shadowOffset: { width: 0, height: 0 },
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