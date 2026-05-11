import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    Share,
    Alert,
    StatusBar,
    useWindowDimensions,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';

import { db } from '@/firebaseConfig';
import { ref, onValue, set, remove } from 'firebase/database';
import { router } from 'expo-router';
import { auth } from '@/firebaseConfig';

import { isEventVisibleInNormalPages } from '@/utils/eventDateUtils';

const fallbackImage = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30';

export default function Events() {
    const { width, height } = useWindowDimensions();

    const isLandscape = width > height;
    const isTablet = Math.min(width, height) >= 600;
    const compact = isLandscape && !isTablet;

    const [events, setEvents] = useState<any[]>([]);
    const [savedEvents, setSavedEvents] = useState<any>({});

    const [searchText, setSearchText] = useState('');
    const [activeFilter, setActiveFilter] = useState<'date' | 'location' | 'category' | null>(null);

    const [dateFilter, setDateFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

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

    const dateOptions = useMemo(() => {
        const allDates = visibleEvents
            .map((event) => getEventDate(event))
            .filter((date) => date && date.trim() !== '');

        return [...new Set(allDates)];
    }, [visibleEvents]);

    const locationOptions = useMemo(() => {
        const allLocations = visibleEvents
            .map((event) => event.location)
            .filter((location) => location && location.trim() !== '');

        return [...new Set(allLocations)];
    }, [visibleEvents]);

    const categoryOptions = useMemo(() => {
        const defaultCategories = ['Ausbildung', 'Sport', 'Event'];

        const firebaseCategories = visibleEvents
            .map((event) => getEventCategory(event))
            .filter((category) => category && category.trim() !== '');

        return [...new Set([...defaultCategories, ...firebaseCategories])];
    }, [visibleEvents]);

    const filteredEvents = visibleEvents.filter((event) => {
        const search = searchText.toLowerCase().trim();
        const selectedDate = dateFilter.toLowerCase().trim();
        const selectedLocation = locationFilter.toLowerCase().trim();
        const selectedCategory = categoryFilter.toLowerCase().trim();

        const titleText = event.title?.toLowerCase() || '';
        const locationText = event.location?.toLowerCase() || '';
        const dateText = getEventDate(event).toLowerCase();
        const categoryText = getEventCategory(event).toLowerCase();

        const matchesSearch =
            search === '' ||
            titleText.includes(search) ||
            locationText.includes(search) ||
            dateText.includes(search) ||
            categoryText.includes(search);

        const matchesDate =
            selectedDate === '' ||
            dateText === selectedDate;

        const matchesLocation =
            selectedLocation === '' ||
            locationText.includes(selectedLocation);

        const matchesCategory =
            selectedCategory === '' ||
            categoryText === selectedCategory;

        return matchesSearch && matchesDate && matchesLocation && matchesCategory;
    });

    const hasActiveFilters =
        searchText.trim() !== '' ||
        dateFilter.trim() !== '' ||
        locationFilter.trim() !== '' ||
        categoryFilter.trim() !== '';

    const clearFilters = () => {
        setSearchText('');
        setDateFilter('');
        setLocationFilter('');
        setCategoryFilter('');
        setActiveFilter(null);
    };

    const toggleSaveEvent = async (item: any) => {
        const user = auth.currentUser;

        if (!user) return;

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

    const renderFilterContent = () => {
        if (activeFilter === 'date') {
            return (
                <View style={[styles.filterPanel, compact && styles.filterPanelCompact]}>
                    <Text style={[styles.filterPanelTitle, compact && styles.filterPanelTitleCompact]}>
                        Datum auswählen
                    </Text>

                    {dateOptions.length === 0 ? (
                        <Text style={styles.emptyFilterText}>Noch keine Daten vorhanden</Text>
                    ) : (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.optionRow}
                        >
                            {dateOptions.map((date) => {
                                const isActive = dateFilter === date;

                                return (
                                    <TouchableOpacity
                                        key={date}
                                        activeOpacity={0.85}
                                        onPress={() => setDateFilter(isActive ? '' : date)}
                                    >
                                        {isActive ? (
                                            <LinearGradient
                                                colors={['#00c6ff', '#0072ff']}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 0 }}
                                                style={[styles.optionChip, compact && styles.optionChipCompact]}
                                            >
                                                <Ionicons name="calendar-outline" size={13} color="#fff" />
                                                <Text style={styles.optionChipTextActive}>{date}</Text>
                                            </LinearGradient>
                                        ) : (
                                            <View style={[styles.optionChipInactive, compact && styles.optionChipCompact]}>
                                                <Ionicons name="calendar-outline" size={13} color="rgba(255,255,255,0.5)" />
                                                <Text style={styles.optionChipText}>{date}</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    )}
                </View>
            );
        }

        if (activeFilter === 'location') {
            return (
                <View style={[styles.filterPanel, compact && styles.filterPanelCompact]}>
                    <View style={[styles.filterInputWrapper, compact && styles.filterInputWrapperCompact]}>
                        <Ionicons name="location-outline" size={17} color="rgba(255,255,255,0.4)" />

                        <TextInput
                            placeholder="Standort suchen..."
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            style={styles.filterInput}
                            value={locationFilter}
                            onChangeText={setLocationFilter}
                        />

                        {locationFilter.length > 0 && (
                            <TouchableOpacity onPress={() => setLocationFilter('')}>
                                <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.4)" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {locationOptions.length > 0 && (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.optionRowWithTopSpace}
                        >
                            {locationOptions.map((location) => {
                                const isActive = locationFilter === location;

                                return (
                                    <TouchableOpacity
                                        key={location}
                                        activeOpacity={0.85}
                                        onPress={() => setLocationFilter(isActive ? '' : location)}
                                    >
                                        {isActive ? (
                                            <LinearGradient
                                                colors={['#00c6ff', '#0072ff']}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 0 }}
                                                style={[styles.optionChip, compact && styles.optionChipCompact]}
                                            >
                                                <Ionicons name="location-outline" size={13} color="#fff" />
                                                <Text style={styles.optionChipTextActive}>{location}</Text>
                                            </LinearGradient>
                                        ) : (
                                            <View style={[styles.optionChipInactive, compact && styles.optionChipCompact]}>
                                                <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.5)" />
                                                <Text style={styles.optionChipText}>{location}</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    )}
                </View>
            );
        }

        if (activeFilter === 'category') {
            return (
                <View style={[styles.filterPanel, compact && styles.filterPanelCompact]}>
                    <Text style={[styles.filterPanelTitle, compact && styles.filterPanelTitleCompact]}>
                        Rubrik auswählen
                    </Text>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.optionRow}
                    >
                        {categoryOptions.map((category) => {
                            const isActive = categoryFilter === category;

                            return (
                                <TouchableOpacity
                                    key={category}
                                    activeOpacity={0.85}
                                    onPress={() => setCategoryFilter(isActive ? '' : category)}
                                >
                                    {isActive ? (
                                        <LinearGradient
                                            colors={['#00c6ff', '#0072ff']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={[styles.optionChip, compact && styles.optionChipCompact]}
                                        >
                                            <Ionicons name="grid-outline" size={13} color="#fff" />
                                            <Text style={styles.optionChipTextActive}>{category}</Text>
                                        </LinearGradient>
                                    ) : (
                                        <View style={[styles.optionChipInactive, compact && styles.optionChipCompact]}>
                                            <Ionicons name="grid-outline" size={13} color="rgba(255,255,255,0.5)" />
                                            <Text style={styles.optionChipText}>{category}</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
            );
        }

        return null;
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[
                    styles.pageScrollContent,
                    compact && styles.pageScrollContentCompact,
                ]}
            >
                <View style={[styles.header, compact && styles.headerCompact]}>
                    <Text style={styles.headerKicker}>EVENTUP</Text>
                    <Text style={[styles.headerTitle, compact && styles.headerTitleCompact]}>
                        Events
                    </Text>
                    <Text style={styles.headerSubtitle}>
                        Finde Events nach Datum, Standort oder Rubrik.
                    </Text>
                </View>

                <View style={[styles.searchWrapper, compact && styles.searchWrapperCompact]}>
                    <Ionicons
                        name="search"
                        size={18}
                        color="rgba(255,255,255,0.4)"
                    />

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

                <View style={[styles.filterRow, compact && styles.filterRowCompact]}>
                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => setActiveFilter(activeFilter === 'date' ? null : 'date')}
                    >
                        {activeFilter === 'date' || dateFilter ? (
                            <LinearGradient
                                colors={['#00c6ff', '#0072ff']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={[styles.filterButton, compact && styles.filterButtonCompact]}
                            >
                                <Ionicons name="calendar-outline" size={15} color="#fff" />
                                <Text style={styles.filterTextActive}>Datum</Text>
                            </LinearGradient>
                        ) : (
                            <View style={[styles.filterButtonInactive, compact && styles.filterButtonCompact]}>
                                <Ionicons name="calendar-outline" size={15} color="rgba(255,255,255,0.5)" />
                                <Text style={styles.filterText}>Datum</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => setActiveFilter(activeFilter === 'location' ? null : 'location')}
                    >
                        {activeFilter === 'location' || locationFilter ? (
                            <LinearGradient
                                colors={['#00c6ff', '#0072ff']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={[styles.filterButton, compact && styles.filterButtonCompact]}
                            >
                                <Ionicons name="location-outline" size={15} color="#fff" />
                                <Text style={styles.filterTextActive}>Standort</Text>
                            </LinearGradient>
                        ) : (
                            <View style={[styles.filterButtonInactive, compact && styles.filterButtonCompact]}>
                                <Ionicons name="location-outline" size={15} color="rgba(255,255,255,0.5)" />
                                <Text style={styles.filterText}>Standort</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => setActiveFilter(activeFilter === 'category' ? null : 'category')}
                    >
                        {activeFilter === 'category' || categoryFilter ? (
                            <LinearGradient
                                colors={['#00c6ff', '#0072ff']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={[styles.filterButton, compact && styles.filterButtonCompact]}
                            >
                                <Ionicons name="grid-outline" size={15} color="#fff" />
                                <Text style={styles.filterTextActive}>Rubriken</Text>
                            </LinearGradient>
                        ) : (
                            <View style={[styles.filterButtonInactive, compact && styles.filterButtonCompact]}>
                                <Ionicons name="grid-outline" size={15} color="rgba(255,255,255,0.5)" />
                                <Text style={styles.filterText}>Rubriken</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {renderFilterContent()}

                {hasActiveFilters && (
                    <View style={styles.resultRow}>
                        <Text style={styles.resultText}>
                            {filteredEvents.length} Event{filteredEvents.length === 1 ? '' : 's'} gefunden
                        </Text>

                        <TouchableOpacity activeOpacity={0.8} onPress={clearFilters}>
                            <Text style={styles.clearText}>Filter löschen</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {filteredEvents.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="search-outline" size={48} color="rgba(255,255,255,0.15)" />
                        <Text style={styles.emptyTitle}>Keine Events gefunden</Text>
                        <Text style={styles.emptyText}>Passe deine Suche oder Filter an.</Text>
                    </View>
                ) : (
                    filteredEvents.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[styles.card, compact && styles.cardCompact]}
                            activeOpacity={0.9}
                            onPress={() => goToDetail(item)}
                        >
                            <Image
                                source={{ uri: getEventImage(item) }}
                                style={[styles.cardImage, compact && styles.cardImageCompact]}
                            />

                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.65)']}
                                style={[styles.cardImageGradient, compact && styles.cardImageGradientCompact]}
                            />

                            <TouchableOpacity
                                style={styles.bookmarkButton}
                                activeOpacity={0.85}
                                onPress={(e) => {
                                    e.stopPropagation();
                                    toggleSaveEvent(item);
                                }}
                            >
                                <Ionicons
                                    name={
                                        savedEvents[item.id]
                                            ? 'bookmark'
                                            : 'bookmark-outline'
                                    }
                                    size={19}
                                    color={
                                        savedEvents[item.id]
                                            ? '#FFD700'
                                            : '#fff'
                                    }
                                />
                            </TouchableOpacity>

                            <View style={styles.categoryBadge}>
                                <Text style={styles.categoryBadgeText}>{getEventCategory(item)}</Text>
                            </View>

                            <View style={styles.cardContent}>
                                <Text style={styles.title} numberOfLines={1}>
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
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#0a0d14',
    },

    pageScrollContent: {
        paddingTop: 62,
        paddingBottom: 120,
    },

    pageScrollContentCompact: {
        paddingTop: 26,
        paddingBottom: 60,
    },

    header: {
        paddingHorizontal: 20,
        marginBottom: 18,
    },

    headerCompact: {
        marginBottom: 10,
    },

    headerKicker: {
        color: '#00e5ff',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 3,
        marginBottom: 6,
    },

    headerTitle: {
        color: '#fff',
        fontSize: 36,
        fontWeight: '900',
        letterSpacing: -1,
    },

    headerTitleCompact: {
        fontSize: 30,
    },

    headerSubtitle: {
        color: 'rgba(255,255,255,0.45)',
        fontSize: 14,
        marginTop: 4,
    },

    searchWrapper: {
        marginHorizontal: 20,
        marginBottom: 14,
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

    searchWrapperCompact: {
        paddingVertical: 11,
        marginBottom: 10,
    },

    searchInput: {
        flex: 1,
        color: '#fff',
        fontSize: 15,
        padding: 0,
    },

    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 14,
        paddingHorizontal: 20,
        gap: 8,
    },

    filterRowCompact: {
        marginBottom: 10,
    },

    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 13,
        borderRadius: 999,
        minWidth: 104,
        justifyContent: 'center',
    },

    filterButtonInactive: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 13,
        borderRadius: 999,
        minWidth: 104,
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },

    filterButtonCompact: {
        paddingVertical: 8,
        minWidth: 100,
    },

    filterTextActive: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 13,
    },

    filterText: {
        color: 'rgba(255,255,255,0.5)',
        fontWeight: '600',
        fontSize: 13,
    },

    filterPanel: {
        marginHorizontal: 20,
        marginBottom: 14,
        padding: 14,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.09)',
    },

    filterPanelCompact: {
        padding: 11,
        marginBottom: 10,
    },

    filterPanelTitle: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '800',
        marginBottom: 12,
    },

    filterPanelTitleCompact: {
        marginBottom: 9,
    },

    filterInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'rgba(255,255,255,0.07)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },

    filterInputWrapperCompact: {
        paddingVertical: 9,
    },

    filterInput: {
        flex: 1,
        color: '#fff',
        fontSize: 14,
        padding: 0,
    },

    optionRow: {
        gap: 10,
        paddingRight: 8,
    },

    optionRowWithTopSpace: {
        gap: 10,
        paddingRight: 8,
        paddingTop: 12,
    },

    optionChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 9,
        paddingHorizontal: 14,
        borderRadius: 999,
    },

    optionChipInactive: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 9,
        paddingHorizontal: 14,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },

    optionChipCompact: {
        paddingVertical: 7,
        paddingHorizontal: 12,
    },

    optionChipTextActive: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '700',
    },

    optionChipText: {
        color: 'rgba(255,255,255,0.55)',
        fontSize: 13,
        fontWeight: '600',
    },

    emptyFilterText: {
        color: 'rgba(255,255,255,0.35)',
        fontSize: 13,
    },

    resultRow: {
        marginHorizontal: 20,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    resultText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 13,
    },

    clearText: {
        color: '#00c6ff',
        fontSize: 13,
        fontWeight: '700',
    },

    card: {
        marginHorizontal: 20,
        marginBottom: 18,
        borderRadius: 22,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },

    cardCompact: {
        marginBottom: 14,
    },

    cardImage: {
        width: '100%',
        height: 175,
        backgroundColor: 'rgba(255,255,255,0.06)',
    },

    cardImageCompact: {
        height: 145,
    },

    cardImageGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 175,
    },

    cardImageGradientCompact: {
        height: 145,
    },

    bookmarkButton: {
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

    title: {
        fontSize: 18,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 9,
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

    emptyState: {
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 24,
        padding: 30,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },

    emptyTitle: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '800',
        marginTop: 14,
    },

    emptyText: {
        color: 'rgba(255,255,255,0.35)',
        fontSize: 14,
        marginTop: 5,
        textAlign: 'center',
    },
});