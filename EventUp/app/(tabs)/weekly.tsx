import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useEffect, useState } from 'react';

import { db } from '@/firebaseConfig';
import { ref, onValue } from 'firebase/database';

export default function Weekly() {

    const [photo, setPhoto] = useState('');
    const [votes, setVotes] = useState<any[]>([]);

    useEffect(() => {

        // 📸 Foto der Woche
        const photoRef = ref(db, 'weeklyPhoto');

        onValue(photoRef, (snapshot) => {
            const data = snapshot.val();

            if (data) {
                setPhoto(data.image);
            }
        });

        // 🗳 Abstimmungen
        const votesRef = ref(db, 'weeklyVotes');

        onValue(votesRef, (snapshot) => {
            const data = snapshot.val();

            if (data) {
                const loadedVotes = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }));

                setVotes(loadedVotes);
            }
        });

    }, []);

    return (
        <View style={styles.container}>

            <ScrollView
                showsVerticalScrollIndicator={false}
            >

                <Text style={styles.header}>
                    Weekly
                </Text>

                {/* 📸 FOTO DER WOCHE */}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Foto der Woche
                    </Text>

                    <View style={styles.photoCard}>

                        <Image
                            source={{ uri: photo }}
                            style={styles.photo}
                        />

                        <View style={styles.badge}>
                            <Ionicons
                                name="ribbon"
                                size={34}
                                color="#000"
                            />
                        </View>

                    </View>
                </View>

                {/* 🗳 ABSTIMMUNGEN */}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Abstimmungen
                    </Text>

                    <View style={styles.grid}>

                        {votes.map((item) => (

                            <View key={item.id} style={styles.voteCard}>

                                <Text style={styles.voteTitle}>
                                    {item.title}
                                </Text>

                                <Text style={styles.location}>
                                    📍 {item.location}
                                </Text>

                                <TouchableOpacity style={styles.shareRow}>
                                    <Ionicons
                                        name="share-social"
                                        size={20}
                                        color="#000"
                                    />

                                    <Text style={styles.shareText}>
                                        Teilen
                                    </Text>
                                </TouchableOpacity>

                                <View style={styles.voteRow}>

                                    <View style={styles.voteButton}>
                                        <Ionicons
                                            name="thumbs-up-outline"
                                            size={28}
                                            color="#000"
                                        />

                                        <Text style={styles.voteText}>
                                            {item.likes}%
                                        </Text>
                                    </View>

                                    <View style={styles.voteButton}>
                                        <Ionicons
                                            name="thumbs-down-outline"
                                            size={28}
                                            color="#000"
                                        />

                                        <Text style={styles.voteText}>
                                            {item.dislikes}%
                                        </Text>
                                    </View>

                                </View>

                            </View>

                        ))}

                    </View>
                </View>

            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
    },

    header: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 70,
        marginBottom: 20,
    },

    section: {
        paddingHorizontal: 20,
        marginBottom: 25,
    },

    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
    },

    photoCard: {
        position: 'relative',
    },

    photo: {
        width: '100%',
        height: 170,
        borderRadius: 16,
    },

    badge: {
        position: 'absolute',
        right: 10,
        bottom: -10,
        backgroundColor: '#fff',
        borderRadius: 30,
        padding: 4,
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },

    voteCard: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 14,
        marginBottom: 15,
        elevation: 3,
    },

    voteTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },

    location: {
        color: '#666',
        marginBottom: 14,
    },

    shareRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 8,
    },

    shareText: {
        fontWeight: 'bold',
    },

    voteRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    voteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },

    voteText: {
        fontWeight: 'bold',
    },

});