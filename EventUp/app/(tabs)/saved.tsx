import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Share,
    Alert,
    StatusBar,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useEffect, useState } from 'react';

import { db, auth } from '@/firebaseConfig';
import { ref, onValue, remove } from 'firebase/database';
import { router } from 'expo-router';

const fallbackImage = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30';

export default function Saved() {

    const [savedEvents, setSavedEvents] = useState<any[]>([]);
    const [activeFilter, setActiveFilter] = useState<'Heute' | 'Diese Woche' | 'Wochenende' | 'Alle'>('Alle');

    useEffect(() => {
        const user = auth.currentUser;

        if (!user) return;

        const savedRef = ref(db, `saved/${user.uid}`);

        const unsubscribe = onValue(savedRef, (snapshot) => {
            const data = snapshot.val();

            if (data) {
                const loadedEvents = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }));

                setSavedEvents(loadedEvents);
            } else {
                setSavedEvents([]);
            }
        });

        return () => unsubscribe();
    }, []);

    const getEventImage = (item: any) => {
        return item.image || item.imageUrl || fallbackImage;
    };

    const getEventDate = (item: any) => {
        return item.date || item.startDate || '';
    };

    const getEventCategory = (item: any) => {
        return item.category || item.eventType || 'Event';
    };

    const shareEvent = async (item: any) => {
        const title = item.title || 'Event';
        const location = item.location || 'Kein Standort angegeben';
        const date = getEventDate(item) || 'Kein Datum angegeben';
        const category = getEventCategory(item);

        const message =
            `Schau dir dieses Event auf EventUp an:\n\n` +
            `${title}\n` +
            `Rubrik: ${category}\n` +
            `Datum: ${date}\n` +
            `Standort: ${location}`;

        try {
            await Share.share({
                title,
                message,
            });
        } catch (error) {
            Alert.alert('Fehler', 'Das Event konnte nicht geteilt werden.');
        }
    };

    const removeSavedEvent = async (item: any) => {
        const user = auth.currentUser;

        if (!user) {
            Alert.alert(
                'Nicht angemeldet',
                'Du musst angemeldet sein, um gespeicherte Events zu entfernen.'
            );
            return;
        }

        if (!item.id) {
            Alert.alert(
                'Fehler',
                'Dieses Event konnte nicht entfernt werden, weil keine Event-ID vorhanden ist.'
            );
            return;
        }

        const savedRef = ref(db, `saved/${user.uid}/${item.id}`);

        try {
            await remove(savedRef);
        } catch (error) {
            Alert.alert(
                'Fehler',
                'Das Event konnte nicht aus deinen Favoriten entfernt werden.'
            );
        }
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
                startDate: getEventDate(item),
                eventType: getEventCategory(item),
                category: getEventCategory(item),
                startTime: item.startTime || '',
                endDate: item.endDate || '',
                endTime: item.endTime || '',
                description: item.description || '',
                shortDescription: item.shortDescription || '',
                organizerName: item.organizerName || '',
                ticketInfo: item.ticketInfo || '',
                ticketLink: item.ticketLink || '',
            },
        });
    };

    const filters: Array<'Heute' | 'Diese Woche' | 'Wochenende' | 'Alle'> = [
        'Alle',
        'Heute',
        'Diese Woche',
        'Wochenende',
    ];

    const parseEventDate = (dateString: string) => {
        if (!dateString) return null;

        const cleanDate = dateString.trim();

        const isoMatch = cleanDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (isoMatch) {
            const year = Number(isoMatch[1]);
            const month = Number(isoMatch[2]) - 1;
            const day = Number(isoMatch[3]);

            return new Date(year, month, day);
        }

        const swissMatch = cleanDate.match(/(\d{1,2})\.(\d{1,2})\.?(\d{4})?/);
        if (swissMatch) {
            const day = Number(swissMatch[1]);
            const month = Number(swissMatch[2]) - 1;
            const year = swissMatch[3]
                ? Number(swissMatch[3])
                : new Date().getFullYear();

            return new Date(year, month, day);
        }

        return null;
    };

    const startOfDay = (date: Date) => {
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0, 0);
        return newDate;
    };

    const getWeekRange = () => {
        const today = startOfDay(new Date());
        const day = today.getDay();

        const diffToMonday = day === 0 ? -6 : 1 - day;

        const monday = new Date(today);
        monday.setDate(today.getDate() + diffToMonday);

        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);

        return { monday, sunday };
    };

    const isToday = (date: Date) => {
        const today = startOfDay(new Date());
        const eventDate = startOfDay(date);

        return eventDate.getTime() === today.getTime();
    };

    const isThisWeek = (date: Date) => {
        const { monday, sunday } = getWeekRange();
        const eventDate = startOfDay(date);

        return eventDate >= monday && eventDate <= sunday;
    };

    const isWeekend = (date: Date) => {
        const { monday } = getWeekRange();

        const saturday = new Date(monday);
        saturday.setDate(monday.getDate() + 5);
        saturday.setHours(0, 0, 0, 0);

        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);

        const eventDate = startOfDay(date);

        return eventDate >= saturday && eventDate <= sunday;
    };

    const filteredSavedEvents = savedEvents.filter((item) => {
        if (activeFilter === 'Alle') return true;

        const eventDate = parseEventDate(getEventDate(item));
        if (!eventDate) return true;

        if (activeFilter === 'Heute') return isToday(eventDate);
        if (activeFilter === 'Diese Woche') return isThisWeek(eventDate);
        if (activeFilter === 'Wochenende') return isWeekend(eventDate);

        return true;
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* HEADER */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerKicker}>EVENTUP</Text>
                    <Text style={styles.title}>Meine Events</Text>
                </View>

                <View style={styles.headerIcon}>
                    <Ionicons name="bookmark" size={24} color="#00e5ff" />
                </View>
            </View>

            {/* FILTERS */}
            <View style={styles.filterWrapper}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterRow}
                >
                    {filters.map((filter) => {
                        const isActive = activeFilter === filter;

                        return (
                            <TouchableOpacity
                                key={filter}
                                activeOpacity={0.85}
                                onPress={() => setActiveFilter(filter)}
                            >
                                {isActive ? (
                                    <LinearGradient
                                        colors={['#00c6ff', '#0072ff']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.activeFilter}
                                    >
                                        <Text style={styles.activeFilterText}>
                                            {filter}
                                        </Text>
                                    </LinearGradient>
                                ) : (
                                    <View style={styles.filterButton}>
                                        <Text style={styles.filterText}>
                                            {filter}
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* EVENTS */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {filteredSavedEvents.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconCircle}>
                            <Ionicons
                                name="bookmark-outline"
                                size={52}
                                color="rgba(255,255,255,0.22)"
                            />
                        </View>

                        <Text style={styles.emptyTitle}>
                            Noch nichts gespeichert
                        </Text>

                        <Text style={styles.emptySubtitle}>
                            Speichere Events, damit du sie später schneller wiederfindest.
                        </Text>
                    </View>
                )}

                {filteredSavedEvents.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.card}
                        activeOpacity={0.9}
                        onPress={() => goToDetail(item)}
                    >
                        <Image
                            source={{ uri: getEventImage(item) }}
                            style={styles.image}
                        />

                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.65)']}
                            style={styles.imageGradient}
                        />

                        <TouchableOpacity
                            style={styles.bookmark}
                            activeOpacity={0.85}
                            onPress={(e) => {
                                e.stopPropagation();
                                removeSavedEvent(item);
                            }}
                        >
                            <Ionicons
                                name="bookmark"
                                size={19}
                                color="#FFD700"
                            />
                        </TouchableOpacity>

                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryBadgeText}>
                                {getEventCategory(item)}
                            </Text>
                        </View>

                        <View style={styles.cardContent}>
                            <Text style={styles.eventTitle} numberOfLines={1}>
                                {item.title}
                            </Text>

                            <View style={styles.infoContainer}>
                                <View style={styles.infoRow}>
                                    <Ionicons
                                        name="location-outline"
                                        size={13}
                                        color="#00c6ff"
                                    />

                                    <Text style={styles.infoText} numberOfLines={1}>
                                        {item.location}
                                    </Text>
                                </View>

                                <View style={styles.infoRow}>
                                    <Ionicons
                                        name="time-outline"
                                        size={13}
                                        color="#00c6ff"
                                    />

                                    <Text style={styles.infoText}>
                                        {getEventDate(item)}
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.shareButton}
                                activeOpacity={0.85}
                                onPress={(e) => {
                                    e.stopPropagation();
                                    shareEvent(item);
                                }}
                            >
                                <Ionicons
                                    name="share-social-outline"
                                    size={16}
                                    color="#00c6ff"
                                />

                                <Text style={styles.shareText}>
                                    Teilen
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#0a0d14',
        paddingTop: 62,
    },

    // ── HEADER ──

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        marginBottom: 22,
    },

    headerKicker: {
        color: '#00e5ff',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 3,
        marginBottom: 6,
    },

    title: {
        fontSize: 36,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: -1,
    },

    subtitle: {
        color: 'rgba(255,255,255,0.45)',
        fontSize: 14,
        marginTop: 4,
        maxWidth: 260,
    },

    headerIcon: {
        width: 46,
        height: 46,
        borderRadius: 999,
        backgroundColor: 'rgba(0,198,255,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(0,198,255,0.28)',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4,
    },

    // ── FILTERS ──

    filterWrapper: {
        height: 56,
        marginBottom: 6,
    },

    filterRow: {
        paddingHorizontal: 20,
        gap: 10,
        marginBottom: 22,
    },

    filterButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },

    filterText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 13,
        fontWeight: '600',
    },

    activeFilter: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 999,
    },

    activeFilterText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '700',
    },

    // ── SCROLL ──

    scrollContent: {
        paddingBottom: 120,
    },

    // ── EMPTY ──

    emptyContainer: {
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 80,
        padding: 34,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },

    emptyIconCircle: {
        width: 92,
        height: 92,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    emptyTitle: {
        marginTop: 18,
        fontSize: 20,
        fontWeight: '800',
        color: '#fff',
    },

    emptySubtitle: {
        marginTop: 8,
        color: 'rgba(255,255,255,0.35)',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },

    // ── CARD ──

    card: {
        marginHorizontal: 20,
        marginBottom: 18,
        borderRadius: 22,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },

    image: {
        width: '100%',
        height: 175,
        backgroundColor: 'rgba(255,255,255,0.06)',
    },

    imageGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 175,
    },

    bookmark: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.45)',
        padding: 9,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        zIndex: 2,
    },

    categoryBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: 'rgba(0,198,255,0.2)',
        borderWidth: 1,
        borderColor: 'rgba(0,198,255,0.4)',
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 5,
        zIndex: 2,
    },

    categoryBadgeText: {
        color: '#00e5ff',
        fontSize: 11,
        fontWeight: '800',
    },

    cardContent: {
        padding: 15,
        position: 'relative',
    },

    eventTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 9,
        color: '#fff',
        paddingRight: 80,
    },

    infoContainer: {
        gap: 5,
    },

    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        maxWidth: '72%',
    },

    infoText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 13,
    },

    // ── SHARE ──

    shareButton: {
        position: 'absolute',
        right: 14,
        bottom: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: 'rgba(0,198,255,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(0,198,255,0.25)',
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 999,
    },

    shareText: {
        fontWeight: '700',
        color: '#00c6ff',
        fontSize: 12,
    },
});