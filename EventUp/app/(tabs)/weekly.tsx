import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Share,
    Alert,
    StatusBar,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useEffect, useState } from 'react';

import { db, auth } from '@/firebaseConfig';
import { ref, onValue, set, remove, get, update } from 'firebase/database';

const fallbackImage = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30';

export default function Weekly() {

    const [photo, setPhoto] = useState('');
    const [votes, setVotes] = useState<any[]>([]);
    const [userVotes, setUserVotes] = useState<any>({});

    useEffect(() => {
        const photoRef = ref(db, 'weeklyPhoto');

        const unsubscribePhoto = onValue(photoRef, (snapshot) => {
            const data = snapshot.val();

            if (data?.image) {
                setPhoto(data.image);
            } else {
                setPhoto('');
            }
        });

        const votesRef = ref(db, 'weeklyVotes');

        const unsubscribeVotes = onValue(votesRef, (snapshot) => {
            const data = snapshot.val();

            if (data) {
                const loadedVotes = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }));

                setVotes(loadedVotes);
            } else {
                setVotes([]);
            }
        });

        return () => {
            unsubscribePhoto();
            unsubscribeVotes();
        };
    }, []);

    useEffect(() => {
        const user = auth.currentUser;

        if (!user) return;

        const userVotesRef = ref(db, `weeklyUserVotes/${user.uid}`);

        const unsubscribeUserVotes = onValue(userVotesRef, (snapshot) => {
            const data = snapshot.val();

            if (data) {
                setUserVotes(data);
            } else {
                setUserVotes({});
            }
        });

        return () => unsubscribeUserVotes();
    }, []);

    const getVoteNumbers = (item: any) => {
        const likeCount = Number(item.likeCount ?? item.likes ?? 0);
        const dislikeCount = Number(item.dislikeCount ?? item.dislikes ?? 0);
        const total = likeCount + dislikeCount;

        if (total === 0) {
            return {
                likePercent: 0,
                dislikePercent: 0,
                likeCount,
                dislikeCount,
            };
        }

        return {
            likePercent: Math.round((likeCount / total) * 100),
            dislikePercent: Math.round((dislikeCount / total) * 100),
            likeCount,
            dislikeCount,
        };
    };

    const shareWeeklyPhoto = async () => {
        try {
            await Share.share({
                title: 'Foto der Woche',
                message: `Schau dir das Foto der Woche auf EventUp an:\n\n${photo || 'Kein Foto vorhanden'}`,
            });
        } catch (error) {
            Alert.alert('Fehler', 'Das Foto konnte nicht geteilt werden.');
        }
    };

    const shareVote = async (item: any) => {
        const title = item.title || 'Abstimmung';
        const location = item.location || 'Kein Standort angegeben';

        try {
            await Share.share({
                title,
                message:
                    `Stimme bei dieser EventUp-Abstimmung ab:\n\n` +
                    `${title}\n` +
                    `Standort: ${location}`,
            });
        } catch (error) {
            Alert.alert('Fehler', 'Die Abstimmung konnte nicht geteilt werden.');
        }
    };

    const vote = async (item: any, type: 'like' | 'dislike') => {
        const user = auth.currentUser;

        if (!user) {
            Alert.alert('Nicht angemeldet', 'Du musst angemeldet sein, um abzustimmen.');
            return;
        }

        const currentVote = userVotes[item.id];
        const voteRef = ref(db, `weeklyVotes/${item.id}`);
        const userVoteRef = ref(db, `weeklyUserVotes/${user.uid}/${item.id}`);

        const snapshot = await get(voteRef);
        const currentData = snapshot.val();

        if (!currentData) return;

        let likeCount = Number(currentData.likeCount ?? currentData.likes ?? 0);
        let dislikeCount = Number(currentData.dislikeCount ?? currentData.dislikes ?? 0);

        if (currentVote === type) {
            if (type === 'like') {
                likeCount = Math.max(0, likeCount - 1);
            } else {
                dislikeCount = Math.max(0, dislikeCount - 1);
            }

            await update(voteRef, {
                likeCount,
                dislikeCount,
            });

            await remove(userVoteRef);
            return;
        }

        if (currentVote === 'like') {
            likeCount = Math.max(0, likeCount - 1);
        }

        if (currentVote === 'dislike') {
            dislikeCount = Math.max(0, dislikeCount - 1);
        }

        if (type === 'like') {
            likeCount += 1;
        } else {
            dislikeCount += 1;
        }

        await update(voteRef, {
            likeCount,
            dislikeCount,
        });

        await set(userVoteRef, type);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* HEADER */}
                <View style={styles.header}>
                    <Text style={styles.headerKicker}>EVENTUP</Text>
                    <Text style={styles.headerTitle}>Weekly</Text>
                </View>

                {/* FOTO DER WOCHE */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Foto der Woche</Text>

                        <TouchableOpacity
                            style={styles.sectionAction}
                            activeOpacity={0.85}
                            onPress={shareWeeklyPhoto}
                        >
                            <Ionicons name="share-social-outline" size={15} color="#00c6ff" />
                            <Text style={styles.sectionActionText}>Teilen</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.photoCard}>
                        <Image
                            source={{ uri: photo || fallbackImage }}
                            style={styles.photo}
                        />

                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.8)']}
                            style={styles.photoGradient}
                        />

                        <View style={styles.photoBadge}>
                            <Ionicons
                                name="ribbon"
                                size={18}
                                color="#00e5ff"
                            />
                            <Text style={styles.photoBadgeText}>Winner</Text>
                        </View>

                        <View style={styles.photoContent}>
                            <Text style={styles.photoTitle}>Best Moment</Text>
                        </View>
                    </View>
                </View>

                {/* ABSTIMMUNGEN */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Abstimmungen</Text>
                        <Text style={styles.sectionCount}>
                            {votes.length} Vote{votes.length === 1 ? '' : 's'}
                        </Text>
                    </View>

                    {votes.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons
                                name="podium-outline"
                                size={50}
                                color="rgba(255,255,255,0.16)"
                            />

                            <Text style={styles.emptyTitle}>
                                Noch keine Abstimmungen
                            </Text>

                            <Text style={styles.emptySubtitle}>
                                Sobald neue Weekly-Votes erstellt werden, erscheinen sie hier.
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.grid}>
                            {votes.map((item) => {
                                const selectedVote = userVotes[item.id];
                                const numbers = getVoteNumbers(item);

                                return (
                                    <View key={item.id} style={styles.voteCard}>
                                        <View style={styles.voteIconCircle}>
                                            <Ionicons
                                                name="sparkles-outline"
                                                size={18}
                                                color="#00e5ff"
                                            />
                                        </View>

                                        <Text style={styles.voteTitle} numberOfLines={2}>
                                            {item.title}
                                        </Text>

                                        <View style={styles.locationRow}>
                                            <Ionicons
                                                name="location-outline"
                                                size={13}
                                                color="#00c6ff"
                                            />

                                            <Text style={styles.location} numberOfLines={1}>
                                                {item.location || 'Kein Standort'}
                                            </Text>
                                        </View>

                                        <TouchableOpacity
                                            style={styles.shareRow}
                                            activeOpacity={0.85}
                                            onPress={() => shareVote(item)}
                                        >
                                            <Ionicons
                                                name="share-social-outline"
                                                size={15}
                                                color="#00c6ff"
                                            />

                                            <Text style={styles.shareText}>
                                                Teilen
                                            </Text>
                                        </TouchableOpacity>

                                        <View style={styles.progressContainer}>
                                            <View style={styles.progressBackground}>
                                                <LinearGradient
                                                    colors={['#00c6ff', '#0072ff']}
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 0 }}
                                                    style={[
                                                        styles.progressFill,
                                                        { width: `${numbers.likePercent}%` },
                                                    ]}
                                                />
                                            </View>

                                            <Text style={styles.progressText}>
                                                {numbers.likePercent}% dafür · {numbers.dislikePercent}% dagegen
                                            </Text>
                                        </View>

                                        <View style={styles.voteRow}>
                                            <TouchableOpacity
                                                activeOpacity={0.85}
                                                onPress={() => vote(item, 'like')}
                                            >
                                                {selectedVote === 'like' ? (
                                                    <LinearGradient
                                                        colors={['#00c6ff', '#0072ff']}
                                                        start={{ x: 0, y: 0 }}
                                                        end={{ x: 1, y: 0 }}
                                                        style={styles.voteButtonActive}
                                                    >
                                                        <Ionicons
                                                            name="thumbs-up"
                                                            size={18}
                                                            color="#fff"
                                                        />

                                                        <Text style={styles.voteTextActive}>
                                                            {numbers.likeCount}
                                                        </Text>
                                                    </LinearGradient>
                                                ) : (
                                                    <View style={styles.voteButton}>
                                                        <Ionicons
                                                            name="thumbs-up-outline"
                                                            size={18}
                                                            color="rgba(255,255,255,0.55)"
                                                        />

                                                        <Text style={styles.voteText}>
                                                            {numbers.likeCount}
                                                        </Text>
                                                    </View>
                                                )}
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                activeOpacity={0.85}
                                                onPress={() => vote(item, 'dislike')}
                                            >
                                                {selectedVote === 'dislike' ? (
                                                    <LinearGradient
                                                        colors={['#00c6ff', '#0072ff']}
                                                        start={{ x: 0, y: 0 }}
                                                        end={{ x: 1, y: 0 }}
                                                        style={styles.voteButtonActive}
                                                    >
                                                        <Ionicons
                                                            name="thumbs-down"
                                                            size={18}
                                                            color="#fff"
                                                        />

                                                        <Text style={styles.voteTextActive}>
                                                            {numbers.dislikeCount}
                                                        </Text>
                                                    </LinearGradient>
                                                ) : (
                                                    <View style={styles.voteButton}>
                                                        <Ionicons
                                                            name="thumbs-down-outline"
                                                            size={18}
                                                            color="rgba(255,255,255,0.55)"
                                                        />

                                                        <Text style={styles.voteText}>
                                                            {numbers.dislikeCount}
                                                        </Text>
                                                    </View>
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#0a0d14',
    },

    scrollContent: {
        paddingTop: 62,
        paddingBottom: 120,
    },

    // ── HEADER ──

    header: {
        paddingHorizontal: 20,
        marginBottom: 24,
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
        fontSize: 38,
        fontWeight: '900',
        letterSpacing: -1,
    },

    headerSubtitle: {
        color: 'rgba(255,255,255,0.45)',
        fontSize: 14,
        marginTop: 5,
        maxWidth: 310,
        lineHeight: 20,
    },

    // ── SECTIONS ──

    section: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },

    sectionTitle: {
        fontSize: 21,
        fontWeight: '800',
        color: '#fff',
    },

    sectionCount: {
        color: 'rgba(255,255,255,0.35)',
        fontSize: 13,
    },

    sectionAction: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: 'rgba(0,198,255,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(0,198,255,0.25)',
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 7,
    },

    sectionActionText: {
        color: '#00c6ff',
        fontSize: 12,
        fontWeight: '700',
    },

    // ── PHOTO ──

    photoCard: {
        height: 220,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },

    photo: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },

    photoGradient: {
        ...StyleSheet.absoluteFillObject,
    },

    photoBadge: {
        position: 'absolute',
        top: 14,
        right: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(0,0,0,0.45)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        borderRadius: 999,
        paddingHorizontal: 11,
        paddingVertical: 8,
    },

    photoBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },

    photoContent: {
        position: 'absolute',
        left: 18,
        right: 18,
        bottom: 18,
    },

    photoTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '900',
    },

    photoSubtitle: {
        color: 'rgba(255,255,255,0.62)',
        fontSize: 13,
        marginTop: 4,
    },

    // ── VOTES ──

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },

    voteCard: {
        width: '48%',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        borderRadius: 22,
        padding: 14,
        marginBottom: 2,
    },

    voteIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 999,
        backgroundColor: 'rgba(0,198,255,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(0,198,255,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },

    voteTitle: {
        fontWeight: '800',
        fontSize: 15,
        marginBottom: 8,
        color: '#fff',
        minHeight: 38,
    },

    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginBottom: 12,
    },

    location: {
        color: 'rgba(255,255,255,0.45)',
        fontSize: 12,
        flex: 1,
    },

    shareRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
        gap: 6,
        alignSelf: 'flex-start',
    },

    shareText: {
        color: '#00c6ff',
        fontWeight: '700',
        fontSize: 12,
    },

    progressContainer: {
        marginBottom: 14,
    },

    progressBackground: {
        height: 7,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 999,
        overflow: 'hidden',
        marginBottom: 6,
    },

    progressFill: {
        height: '100%',
        borderRadius: 999,
    },

    progressText: {
        color: 'rgba(255,255,255,0.35)',
        fontSize: 11,
        fontWeight: '600',
    },

    voteRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },

    voteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        paddingVertical: 9,
        paddingHorizontal: 10,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        minWidth: 62,
    },

    voteButtonActive: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        paddingVertical: 9,
        paddingHorizontal: 10,
        borderRadius: 999,
        minWidth: 62,
    },

    voteText: {
        color: 'rgba(255,255,255,0.55)',
        fontWeight: '700',
        fontSize: 12,
    },

    voteTextActive: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 12,
    },

    // ── EMPTY ──

    emptyContainer: {
        alignItems: 'center',
        padding: 34,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },

    emptyTitle: {
        marginTop: 16,
        fontSize: 18,
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
});