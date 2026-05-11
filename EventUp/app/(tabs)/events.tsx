import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

import { db } from '@/firebaseConfig';
import { ref, onValue } from 'firebase/database';

export default function Events() {

    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {

        const eventsRef = ref(db, 'events');

        onValue(eventsRef, (snapshot) => {

            const data = snapshot.val();

            if (data) {

                const loadedEvents = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }));

                setEvents(loadedEvents);
            }
        });

    }, []);

    return (
        <View style={styles.container}>

            {/* 🔍 SEARCH */}
            <View style={styles.searchWrapper}>

                <Ionicons
                    name="search"
                    size={22}
                    color="#666"
                    style={styles.searchIcon}
                />

                <TextInput
                    placeholder="Nach Events Suchen"
                    placeholderTextColor="#777"
                    style={styles.searchInput}
                />

            </View>

            {/* 🔘 FILTERS */}
            <View style={styles.filterRow}>

                <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterText}>Datum</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterText}>Standort</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterText}>Rubriken</Text>
                </TouchableOpacity>

            </View>

            {/* 📜 EVENTS */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 120
                }}
            >

                {events.map((item) => (

                    <View key={item.id} style={styles.card}>

                        {/* 📷 IMAGE */}
                        <Image
                            source={{ uri: item.image }}
                            style={styles.cardImage}
                        />

                        {/* 🔖 BOOKMARK */}
                        <TouchableOpacity style={styles.bookmarkButton}>
                            <Ionicons
                                name="bookmark-outline"
                                size={28}
                                color="#fff"
                            />
                        </TouchableOpacity>

                        {/* 📄 CONTENT */}
                        <View style={styles.cardContent}>

                            <Text style={styles.title}>
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

                            {/* 🔗 SHARE */}
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
        paddingTop: 70,
    },

    // 🔍 SEARCH

    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 18,
        borderRadius: 30,
        paddingHorizontal: 15,
        height: 52,

        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },

    searchIcon: {
        marginRight: 10,
    },

    searchInput: {
        flex: 1,
        fontSize: 15,
    },

    // 🔘 FILTERS

    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        marginBottom: 18,
        paddingHorizontal: 18,
    },

    filterButton: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 22,
        borderRadius: 25,
    },

    filterText: {
        fontSize: 15,
        color: '#111',
    },

    // 🎫 CARD

    card: {
        backgroundColor: '#fff',
        marginHorizontal: 14,
        marginBottom: 18,
        borderRadius: 14,
        overflow: 'hidden',

        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },

    cardImage: {
        width: '100%',
        height: 140,
    },

    bookmarkButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },

    cardContent: {
        padding: 12,
        position: 'relative',
    },

    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 6,
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

    shareButton: {
        position: 'absolute',
        right: 14,
        bottom: 14,
        flexDirection: 'row',
        alignItems: 'center',
    },

    shareText: {
        marginLeft: 6,
        fontWeight: '600',
        color: '#111',
    },

});