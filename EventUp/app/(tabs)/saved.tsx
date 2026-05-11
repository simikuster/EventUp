import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useEffect, useState } from 'react';

import { db, auth } from '@/firebaseConfig';
import { ref, onValue } from 'firebase/database';

export default function Saved() {

    const [savedEvents, setSavedEvents] = useState<any[]>([]);

    useEffect(() => {

        const user = auth.currentUser;

        if (!user) return;

        // 🔥 USER SAVED EVENTS
        const savedRef = ref(db, `saved/${user.uid}`);

        onValue(savedRef, (snapshot) => {

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

    }, []);

    return (

        <View style={styles.container}>

            {/* HEADER */}
            <View style={styles.header}>

                <Text style={styles.title}>
                    Meine Events
                </Text>

                <TouchableOpacity>
                    <Ionicons
                        name="calendar-outline"
                        size={30}
                        color="#111"
                    />
                </TouchableOpacity>

            </View>

            {/* FILTERS */}
            <View style={styles.filterRow}>

                <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterText}>Heute</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.activeFilter}>
                    <Text style={styles.activeFilterText}>
                        Diese Woche
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterText}>
                        Wochenende
                    </Text>
                </TouchableOpacity>

            </View>

            {/* EVENTS */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 120
                }}
            >

                {savedEvents.length === 0 && (

                    <View style={styles.emptyContainer}>

                        <Ionicons
                            name="bookmark-outline"
                            size={70}
                            color="#9CA3AF"
                        />

                        <Text style={styles.emptyTitle}>
                            Noch nichts gespeichert
                        </Text>

                        <Text style={styles.emptySubtitle}>
                            Speichere Events um sie hier zu sehen
                        </Text>

                    </View>

                )}

                {savedEvents.map((item) => (

                    <View key={item.id} style={styles.card}>

                        {/* IMAGE */}
                        <Image
                            source={{ uri: item.image }}
                            style={styles.image}
                        />

                        {/* BOOKMARK */}
                        <TouchableOpacity style={styles.bookmark}>
                            <Ionicons
                                name="bookmark"
                                size={28}
                                color="#2563eb"
                            />
                        </TouchableOpacity>

                        {/* CONTENT */}
                        <View style={styles.cardContent}>

                            <Text style={styles.eventTitle}>
                                {item.title}
                            </Text>

                            <View style={styles.infoRow}>
                                <Ionicons
                                    name="location-outline"
                                    size={14}
                                    color="#666"
                                />

                                <Text style={styles.infoText}>
                                    {item.location}
                                </Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Ionicons
                                    name="time-outline"
                                    size={14}
                                    color="#666"
                                />

                                <Text style={styles.infoText}>
                                    {item.date}
                                </Text>
                            </View>

                            {/* SHARE */}
                            <TouchableOpacity style={styles.shareButton}>

                                <Ionicons
                                    name="share-social-outline"
                                    size={22}
                                    color="#111"
                                />

                                <Text style={styles.shareText}>
                                    Teilen
                                </Text>

                            </TouchableOpacity>

                        </View>

                    </View>

                ))}

            </ScrollView>

        </View>

    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#efefef',
        paddingTop: 65,
    },

    // HEADER

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 20,
    },

    title: {
        fontSize: 38,
        fontWeight: '800',
        color: '#111',
    },

    // FILTERS

    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        marginBottom: 18,
    },

    filterButton: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 25,
    },

    filterText: {
        color: '#111',
        fontSize: 15,
    },

    activeFilter: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 25,
        borderWidth: 3,
        borderColor: '#3B82F6',
    },

    activeFilterText: {
        color: '#111',
        fontSize: 15,
    },

    // EMPTY

    emptyContainer: {
        alignItems: 'center',
        marginTop: 120,
    },

    emptyTitle: {
        marginTop: 18,
        fontSize: 22,
        fontWeight: '700',
        color: '#111',
    },

    emptySubtitle: {
        marginTop: 8,
        color: '#777',
        fontSize: 15,
    },

    // CARD

    card: {
        backgroundColor: '#fff',
        marginHorizontal: 18,
        marginBottom: 18,
        borderRadius: 14,
        overflow: 'hidden',

        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },

    image: {
        width: '100%',
        height: 140,
    },

    bookmark: {
        position: 'absolute',
        top: 10,
        right: 10,
    },

    cardContent: {
        padding: 12,
        position: 'relative',
    },

    eventTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
        color: '#111',
    },

    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3,
    },

    infoText: {
        marginLeft: 6,
        color: '#666',
        fontSize: 13,
    },

    // SHARE

    shareButton: {
        position: 'absolute',
        right: 14,
        bottom: 14,
        flexDirection: 'row',
        alignItems: 'center',
    },

    shareText: {
        marginLeft: 6,
        fontWeight: '700',
        color: '#111',
    },

});