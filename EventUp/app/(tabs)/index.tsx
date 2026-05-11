import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TextInput,
    ImageBackground,
    Animated,
    TouchableOpacity,
    StatusBar,
    Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useEffect, useMemo, useState } from 'react';

import { db, auth } from '@/firebaseConfig';
import { ref, onValue, set, remove } from 'firebase/database';
import { router } from 'expo-router';

import { isEventVisibleInNormalPages } from '@/utils/eventDateUtils';

const fallbackImage = 'https://images.unsplash.com/photo-1506157786151-b8491531f063';

export default function Home() {

    const [events, setEvents] = useState<any[]>([]);
    const [savedEvents, setSavedEvents] = useState<any>({});
    const [searchText, setSearchText] = useState('');
    const [activeCategory, setActiveCategory] = useState('Alle');

    useEffect(() => {
        const eventsRef = ref(db, 'events');

        const unsubscribe = onValue(eventsRef, (snapshot) => {
            const data = snapshot.val();

            if (data) {
                const loadedEvents = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }));

                setEvents(loadedEvents);
            } else {
                setEvents([]);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const user = auth.currentUser;

        if (!user) return;

        const savedRef = ref(db, `saved/${user.uid}`);

        const unsubscribe = onValue(savedRef, (snapshot) => {
            const data = snapshot.val();

            if (data) {
                setSavedEvents(data);
            } else {
                setSavedEvents({});
            }
        });

        return () => unsubscribe();
    }, []);

    const scrollY = useRef(new Animated.Value(0)).current;
    const scrollRef = useRef<ScrollView>(null);

    const headerHeight = scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [280, 100],
        extrapolate: 'clamp',
    });

    const logoOpacity = scrollY.interpolate({
        inputRange: [0, 120],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const miniTitleOpacity = scrollY.interpolate({
        inputRange: [100, 160],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const fabOpacity = scrollY.interpolate({
        inputRange: [100, 150],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const scrollToTop = () => scrollRef.current?.scrollTo({ y: 0, animated: true });

    const getEventImage = (event: any) => {
        return event.image || event.imageUrl || fallbackImage;
    };

    const getEventDate = (event: any) => {
        return event.date || event.startDate || '';
    };

    const getEventCategory = (event: any) => {
        return event.category || event.eventType || 'Event';
    };

    const visibleEvents = useMemo(() => {
        return events.filter((event) => isEventVisibleInNormalPages(event));
    }, [events]);

    const categories = useMemo(() => {
        const defaultCategories = ['Musik', 'Sport', 'Food', 'Bildung', 'Event'];

        const firebaseCategories = visibleEvents
            .map((event) => getEventCategory(event))
            .filter((category) => category && category.trim() !== '');

        return ['Alle', ...new Set([...defaultCategories, ...firebaseCategories])];
    }, [visibleEvents]);

    const categoryIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
        Alle: 'apps-outline',
        Musik: 'musical-notes-outline',
        Sport: 'football-outline',
        Food: 'restaurant-outline',
        Bildung: 'school-outline',
        Ausbildung: 'school-outline',
        Event: 'calendar-outline',
        Kultur: 'color-palette-outline',
        Party: 'sparkles-outline',
        Workshop: 'construct-outline',
    };

    const goToDetail = (item: any) => {
        router.push({
            pathname: '/detail',
            params: {
                id: item.id,
                title: item.title,
                image: getEventImage(item),
                imageUrl: getEventImage(item),
                location: item.location,
                date: getEventDate(item),
                startDate: item.startDate || item.date,
                startTime: item.startTime,
                endDate: item.endDate,
                endTime: item.endTime,
                description: item.description,
                shortDescription: item.shortDescription,
                organizerName: item.organizerName,
                ticketInfo: item.ticketInfo,
                ticketLink: item.ticketLink,
                eventType: item.eventType || item.category,
                category: item.category || item.eventType,
            },
        });
    };

    const toggleSaveEvent = async (item: any) => {
        const user = auth.currentUser;

        if (!user) {
            Alert.alert(
                'Nicht angemeldet',
                'Du musst angemeldet sein, um Events zu speichern.'
            );
            return;
        }

        if (!item.id) {
            Alert.alert(
                'Fehler',
                'Dieses Event kann nicht gespeichert werden, weil keine Event-ID vorhanden ist.'
            );
            return;
        }

        const savedRef = ref(db, `saved/${user.uid}/${item.id}`);

        if (savedEvents[item.id]) {
            await remove(savedRef);
        } else {
            await set(savedRef, {
                title: item.title || '',
                image: getEventImage(item),
                imageUrl: getEventImage(item),
                location: item.location || '',
                date: getEventDate(item),
                startDate: item.startDate || item.date || '',
                startTime: item.startTime || '',
                endDate: item.endDate || '',
                endTime: item.endTime || '',
                description: item.description || '',
                shortDescription: item.shortDescription || '',
                organizerName: item.organizerName || '',
                ticketInfo: item.ticketInfo || '',
                ticketLink: item.ticketLink || '',
                eventType: getEventCategory(item),
                category: getEventCategory(item),
            });
        }
    };

    const filteredEvents = visibleEvents.filter((event) => {
        const search = searchText.toLowerCase();

        const matchesSearch =
            event.title?.toLowerCase().includes(search) ||
            event.location?.toLowerCase().includes(search) ||
            getEventDate(event).toLowerCase().includes(search) ||
            getEventCategory(event).toLowerCase().includes(search);

        const matchesCategory =
            activeCategory === 'Alle' || getEventCategory(event) === activeCategory;

        return matchesSearch && matchesCategory;
    });

    const featuredEvent = visibleEvents[0];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <Animated.View style={[styles.headerContainer, { height: headerHeight }]}>
                <ImageBackground
                    source={require('../../assets/images/logo.png')}
                    style={StyleSheet.absoluteFillObject}
                    resizeMode="cover"
                />

                <LinearGradient
                    colors={['rgba(0,0,0,0.15)', 'rgba(10,13,20,0.92)', '#0a0d14']}
                    style={StyleSheet.absoluteFillObject}
                />

                <Animated.View style={[styles.miniHeader, { opacity: miniTitleOpacity }]}>
                    <Text style={styles.miniTitle}>
                        EVENT<Text style={{ color: '#00e5ff' }}>UP</Text>
                    </Text>
                </Animated.View>

                <Animated.View style={[styles.headerBottom, { opacity: logoOpacity }]}>
                    <Text style={styles.headerLogo}>
                        EVENT<Text style={{ color: '#00e5ff' }}>UP</Text>
                    </Text>

                    <Text style={styles.headerTagline}>
                        DA WO WAS LÄUFT
                    </Text>
                </Animated.View>
            </Animated.View>

            <Animated.ScrollView
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                contentContainerStyle={{ paddingBottom: 120 }}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
            >
                <View style={{ height: 280 }} />

                <View style={styles.searchWrapper}>
                    <Ionicons name="search" size={18} color="rgba(255,255,255,0.4)" />

                    <TextInput
                        placeholder="Nach Events suchen..."
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        style={styles.searchInput}
                        value={searchText}
                        onChangeText={setSearchText}
                    />

                    {searchText.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchText('')}>
                            <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.4)" />
                        </TouchableOpacity>
                    )}
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryRow}
                >
                    {categories.map((cat) => {
                        const isActive = activeCategory === cat;

                        return (
                            <TouchableOpacity
                                key={cat}
                                onPress={() => setActiveCategory(cat)}
                                activeOpacity={0.8}
                            >
                                {isActive ? (
                                    <LinearGradient
                                        colors={['#00c6ff', '#0072ff']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.categoryChip}
                                    >
                                        <Ionicons
                                            name={categoryIcons[cat] || 'pricetag-outline'}
                                            size={15}
                                            color="#fff"
                                        />

                                        <Text style={styles.categoryChipTextActive}>
                                            {cat}
                                        </Text>
                                    </LinearGradient>
                                ) : (
                                    <View style={styles.categoryChipInactive}>
                                        <Ionicons
                                            name={categoryIcons[cat] || 'pricetag-outline'}
                                            size={15}
                                            color="rgba(255,255,255,0.5)"
                                        />

                                        <Text style={styles.categoryChipText}>
                                            {cat}
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Für Dich</Text>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/events')}>
                        <Text style={styles.sectionLink}>Alle sehen</Text>
                    </TouchableOpacity>
                </View>

                {featuredEvent ? (
                    <TouchableOpacity
                        style={styles.featuredCard}
                        activeOpacity={0.92}
                        onPress={() => goToDetail(featuredEvent)}
                    >
                        <Image
                            source={{ uri: getEventImage(featuredEvent) }}
                            style={styles.featuredImage}
                        />

                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.8)']}
                            style={styles.featuredGradient}
                        />

                        <TouchableOpacity
                            style={styles.bookmarkBadge}
                            activeOpacity={0.85}
                            onPress={(e) => {
                                e.stopPropagation();
                                toggleSaveEvent(featuredEvent);
                            }}
                        >
                            <Ionicons
                                name={savedEvents[featuredEvent.id] ? 'bookmark' : 'bookmark-outline'}
                                size={18}
                                color={savedEvents[featuredEvent.id] ? '#FFD700' : '#fff'}
                            />
                        </TouchableOpacity>

                        <View style={styles.featuredContent}>
                            <View style={styles.featuredBadge}>
                                <Text style={styles.featuredBadgeText}>🔥 Top Pick</Text>
                            </View>

                            <Text style={styles.featuredTitle} numberOfLines={1}>
                                {featuredEvent.title}
                            </Text>

                            <View style={styles.featuredMeta}>
                                <Ionicons
                                    name="location-outline"
                                    size={13}
                                    color="rgba(255,255,255,0.7)"
                                />

                                <Text style={styles.featuredMetaText} numberOfLines={1}>
                                    {featuredEvent.location}
                                </Text>

                                <Text style={styles.featuredDot}>·</Text>

                                <Ionicons
                                    name="time-outline"
                                    size={13}
                                    color="rgba(255,255,255,0.7)"
                                />

                                <Text style={styles.featuredMetaText}>
                                    {getEventDate(featuredEvent)}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ) : null}

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Events entdecken</Text>
                    <Text style={styles.sectionCount}>{filteredEvents.length} Events</Text>
                </View>

                {filteredEvents.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="search-outline" size={48} color="rgba(255,255,255,0.15)" />
                        <Text style={styles.emptyText}>Keine Events gefunden</Text>
                    </View>
                ) : (
                    filteredEvents.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.card}
                            activeOpacity={0.9}
                            onPress={() => goToDetail(item)}
                        >
                            <Image
                                source={{ uri: getEventImage(item) }}
                                style={styles.cardImage}
                            />

                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.55)']}
                                style={styles.cardImageGradient}
                            />

                            <TouchableOpacity
                                style={styles.cardBookmark}
                                activeOpacity={0.85}
                                onPress={(e) => {
                                    e.stopPropagation();
                                    toggleSaveEvent(item);
                                }}
                            >
                                <Ionicons
                                    name={savedEvents[item.id] ? 'bookmark' : 'bookmark-outline'}
                                    size={17}
                                    color={savedEvents[item.id] ? '#FFD700' : '#fff'}
                                />
                            </TouchableOpacity>

                            <View style={styles.cardContent}>
                                <Text style={styles.cardTitle} numberOfLines={1}>
                                    {item.title}
                                </Text>

                                <View style={styles.cardMeta}>
                                    <View style={styles.cardMetaItem}>
                                        <Ionicons name="location-outline" size={13} color="#00c6ff" />

                                        <Text style={styles.cardMetaText} numberOfLines={1}>
                                            {item.location}
                                        </Text>
                                    </View>

                                    <View style={styles.cardMetaItem}>
                                        <Ionicons name="time-outline" size={13} color="#00c6ff" />

                                        <Text style={styles.cardMetaText}>
                                            {getEventDate(item)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </Animated.ScrollView>

            <Animated.View style={[styles.fab, { opacity: fabOpacity }]}>
                <TouchableOpacity onPress={scrollToTop} activeOpacity={0.85}>
                    <LinearGradient
                        colors={['#00c6ff', '#0072ff']}
                        style={styles.fabInner}
                    >
                        <Ionicons name="arrow-up" size={22} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#0a0d14',
    },

    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        justifyContent: 'flex-end',
        overflow: 'hidden',
    },

    miniHeader: {
        position: 'absolute',
        top: 54,
        alignSelf: 'center',
    },

    miniTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#fff',
        fontStyle: 'italic',
        letterSpacing: -0.5,
    },

    headerBottom: {
        paddingHorizontal: 24,
        paddingBottom: 28,
    },

    headerLogo: {
        fontSize: 42,
        fontWeight: '900',
        color: '#fff',
        fontStyle: 'italic',
        letterSpacing: -1,
        textTransform: 'uppercase',
    },

    headerTagline: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.5)',
        letterSpacing: 4,
        marginTop: 2,
    },

    searchWrapper: {
        marginHorizontal: 20,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'rgba(255,255,255,0.07)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },

    searchInput: {
        flex: 1,
        color: '#fff',
        fontSize: 15,
        padding: 0,
    },

    categoryRow: {
        paddingHorizontal: 20,
        gap: 10,
        marginBottom: 28,
    },

    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 999,
    },

    categoryChipInactive: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },

    categoryChipTextActive: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 13,
    },

    categoryChipText: {
        color: 'rgba(255,255,255,0.5)',
        fontWeight: '600',
        fontSize: 13,
    },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 14,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#fff',
    },

    sectionLink: {
        fontSize: 13,
        color: '#00c6ff',
        fontWeight: '600',
    },

    sectionCount: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.35)',
    },

    featuredCard: {
        marginHorizontal: 20,
        marginBottom: 32,
        borderRadius: 24,
        overflow: 'hidden',
        height: 220,
    },

    featuredImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },

    featuredGradient: {
        ...StyleSheet.absoluteFillObject,
    },

    bookmarkBadge: {
        position: 'absolute',
        top: 14,
        right: 14,
        backgroundColor: 'rgba(0,0,0,0.45)',
        padding: 9,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },

    featuredContent: {
        position: 'absolute',
        bottom: 18,
        left: 18,
        right: 18,
    },

    featuredBadge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(0,198,255,0.2)',
        borderWidth: 1,
        borderColor: 'rgba(0,198,255,0.4)',
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginBottom: 8,
    },

    featuredBadgeText: {
        color: '#00e5ff',
        fontSize: 11,
        fontWeight: '700',
    },

    featuredTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 6,
    },

    featuredMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },

    featuredMetaText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        maxWidth: 145,
    },

    featuredDot: {
        color: 'rgba(255,255,255,0.4)',
        marginHorizontal: 2,
    },

    card: {
        marginHorizontal: 20,
        marginBottom: 16,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },

    cardImage: {
        width: '100%',
        height: 170,
        backgroundColor: 'rgba(255,255,255,0.06)',
    },

    cardImageGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 170,
    },

    cardBookmark: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.45)',
        padding: 8,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },

    cardContent: {
        padding: 14,
    },

    cardTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 8,
    },

    cardMeta: {
        flexDirection: 'row',
        gap: 14,
    },

    cardMetaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        flex: 1,
    },

    cardMetaText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 13,
    },

    emptyState: {
        alignItems: 'center',
        paddingTop: 48,
        gap: 12,
    },

    emptyText: {
        color: 'rgba(255,255,255,0.25)',
        fontSize: 15,
    },

    fab: {
        position: 'absolute',
        bottom: 110,
        right: 20,
    },

    fabInner: {
        width: 52,
        height: 52,
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center',
    },
});