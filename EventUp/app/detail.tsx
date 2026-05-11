// 🔥 DETAIL PAGE — EventUp Modern UI

import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Linking,
    StatusBar,
    Share,
    Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';

import { db, auth } from '@/firebaseConfig';
import { ref, onValue, set, remove } from 'firebase/database';

const fallbackImage = 'https://images.unsplash.com/photo-1506157786151-b8491531f063';

export default function Detail() {

    const {
        id,
        title,
        image,
        imageUrl,
        location,
        date,
        startDate,
        endDate,
        startTime,
        endTime,
        description,
        shortDescription,
        organizerName,
        ticketInfo,
        ticketLink,
        eventType,
        category,
    } = useLocalSearchParams();

    const [isSaved, setIsSaved] = useState(false);

    const eventId = id as string;

    const eventTitle = (title as string) || 'Event';

    const eventImage =
        (image as string) ||
        (imageUrl as string) ||
        fallbackImage;

    const eventLocation =
        (location as string) ||
        'Kein Standort angegeben';

    const eventDate =
        (startDate as string) ||
        (date as string) ||
        '';

    const eventStartTime =
        (startTime as string) ||
        '';

    const eventEndDate =
        (endDate as string) ||
        '';

    const eventEndTime =
        (endTime as string) ||
        '';

    const eventDescription =
        (description as string) ||
        'Keine Beschreibung vorhanden';

    const eventShortDescription =
        (shortDescription as string) ||
        '';

    const eventOrganizerName =
        (organizerName as string) ||
        'Nicht angegeben';

    const eventTicketInfo =
        (ticketInfo as string) ||
        'Zum Ticket';

    const eventTicketLink =
        (ticketLink as string) ||
        '';

    const eventCategory =
        (eventType as string) ||
        (category as string) ||
        'Event';

    useEffect(() => {
        const user = auth.currentUser;

        if (!user || !eventId) return;

        const savedRef = ref(db, `saved/${user.uid}/${eventId}`);

        const unsubscribe = onValue(savedRef, (snapshot) => {
            setIsSaved(snapshot.exists());
        });

        return () => unsubscribe();
    }, [eventId]);

    const toggleSaveEvent = async () => {
        const user = auth.currentUser;

        if (!user) {
            Alert.alert(
                'Nicht angemeldet',
                'Du musst angemeldet sein, um Events zu speichern.'
            );
            return;
        }

        if (!eventId) {
            Alert.alert(
                'Fehler',
                'Dieses Event kann nicht gespeichert werden, weil keine Event-ID vorhanden ist.'
            );
            return;
        }

        const savedRef = ref(db, `saved/${user.uid}/${eventId}`);

        if (isSaved) {
            await remove(savedRef);
        } else {
            await set(savedRef, {
                title: eventTitle,
                image: eventImage,
                imageUrl: eventImage,
                location: eventLocation,
                date: eventDate,
                startDate: eventDate,
                startTime: eventStartTime,
                endDate: eventEndDate,
                endTime: eventEndTime,
                description: eventDescription,
                shortDescription: eventShortDescription,
                organizerName: eventOrganizerName,
                ticketInfo: eventTicketInfo,
                ticketLink: eventTicketLink,
                eventType: eventCategory,
                category: eventCategory,
            });
        }
    };

    const shareEvent = async () => {
        const message =
            `Schau dir dieses Event auf EventUp an:\n\n` +
            `${eventTitle}\n` +
            `Rubrik: ${eventCategory}\n` +
            `Datum: ${eventDate || 'Kein Datum angegeben'}\n` +
            `Standort: ${eventLocation}`;

        try {
            await Share.share({
                title: eventTitle,
                message,
            });
        } catch (error) {
            Alert.alert('Fehler', 'Das Event konnte nicht geteilt werden.');
        }
    };

    const openTicketLink = () => {
        if (!eventTicketLink) {
            Alert.alert(
                'Keine Tickets',
                'Für dieses Event wurde kein Ticket-Link angegeben.'
            );
            return;
        }

        Linking.openURL(eventTicketLink);
    };

    const openMap = () => {
        const encodedLocation = encodeURIComponent(eventLocation);
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;

        Linking.openURL(mapUrl);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >

                {/* ── HERO IMAGE ── */}
                <View style={styles.heroWrapper}>
                    <Image
                        source={{ uri: eventImage }}
                        style={styles.heroImage}
                    />

                    <LinearGradient
                        colors={['rgba(0,0,0,0.35)', 'transparent', '#0a0d14']}
                        locations={[0, 0.4, 1]}
                        style={StyleSheet.absoluteFillObject}
                    />

                    {/* TOP BAR */}
                    <View style={styles.topBar}>
                        <TouchableOpacity
                            style={styles.iconButton}
                            activeOpacity={0.85}
                            onPress={() => router.back()}
                        >
                            <Ionicons name="chevron-back" size={22} color="#fff" />
                        </TouchableOpacity>

                        <View style={styles.topIcons}>
                            <TouchableOpacity
                                style={styles.iconButton}
                                activeOpacity={0.85}
                                onPress={toggleSaveEvent}
                            >
                                <Ionicons
                                    name={isSaved ? 'bookmark' : 'bookmark-outline'}
                                    size={20}
                                    color={isSaved ? '#FFD700' : '#fff'}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.iconButton}
                                activeOpacity={0.85}
                                onPress={shareEvent}
                            >
                                <Ionicons name="share-outline" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* HERO CONTENT */}
                    <View style={styles.heroContent}>
                        <View style={styles.typeBadge}>
                            <Text style={styles.typeBadgeText}>
                                {eventCategory}
                            </Text>
                        </View>

                        <Text style={styles.heroTitle}>
                            {eventTitle}
                        </Text>

                        <View style={styles.heroMeta}>
                            <Ionicons
                                name="location-outline"
                                size={14}
                                color="rgba(255,255,255,0.7)"
                            />

                            <Text style={styles.heroMetaText}>
                                {eventLocation}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* ── CONTENT ── */}
                <View style={styles.content}>

                    {/* DATE / TIME ROW */}
                    <View style={styles.metaRow}>
                        <View style={styles.metaCard}>
                            <Ionicons name="calendar-outline" size={20} color="#00c6ff" />

                            <Text style={styles.metaCardLabel}>
                                Datum
                            </Text>

                            <Text style={styles.metaCardValue}>
                                {eventDate || 'Kein Datum'}
                            </Text>

                            {eventEndDate ? (
                                <Text style={styles.metaCardSub}>
                                    bis {eventEndDate}
                                </Text>
                            ) : null}
                        </View>

                        <View style={styles.metaCard}>
                            <Ionicons name="time-outline" size={20} color="#00c6ff" />

                            <Text style={styles.metaCardLabel}>
                                Uhrzeit
                            </Text>

                            <Text style={styles.metaCardValue}>
                                {eventStartTime ? `${eventStartTime} Uhr` : 'Keine Zeit'}
                            </Text>

                            {eventEndTime ? (
                                <Text style={styles.metaCardSub}>
                                    bis {eventEndTime} Uhr
                                </Text>
                            ) : null}
                        </View>

                        <View style={styles.metaCard}>
                            <Ionicons name="pricetag-outline" size={20} color="#00c6ff" />

                            <Text style={styles.metaCardLabel}>
                                Kategorie
                            </Text>

                            <Text style={styles.metaCardValue} numberOfLines={1}>
                                {eventCategory}
                            </Text>
                        </View>
                    </View>

                    {/* SHORT DESCRIPTION */}
                    {eventShortDescription ? (
                        <Text style={styles.shortDesc}>
                            {eventShortDescription}
                        </Text>
                    ) : null}

                    {/* BESCHREIBUNG */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="document-text-outline" size={18} color="#00c6ff" />

                            <Text style={styles.sectionTitle}>
                                Beschreibung
                            </Text>
                        </View>

                        <Text style={styles.sectionText}>
                            {eventDescription}
                        </Text>
                    </View>

                    {/* ADRESSE */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="location-outline" size={18} color="#00c6ff" />

                            <Text style={styles.sectionTitle}>
                                Adresse
                            </Text>
                        </View>

                        <View style={styles.locationRow}>
                            <Text style={styles.sectionText}>
                                {eventLocation}
                            </Text>

                            <TouchableOpacity
                                style={styles.mapButton}
                                activeOpacity={0.85}
                                onPress={openMap}
                            >
                                <Ionicons name="map-outline" size={15} color="#00c6ff" />

                                <Text style={styles.mapButtonText}>
                                    Karte
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* VERANSTALTER */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="person-outline" size={18} color="#00c6ff" />

                            <Text style={styles.sectionTitle}>
                                Veranstalter
                            </Text>
                        </View>

                        <View style={styles.organizerRow}>
                            <View style={styles.organizerAvatar}>
                                <Text style={styles.organizerAvatarText}>
                                    {eventOrganizerName[0].toUpperCase()}
                                </Text>
                            </View>

                            <Text style={styles.sectionText}>
                                {eventOrganizerName}
                            </Text>
                        </View>
                    </View>

                    {/* TICKET LINK */}
                    {eventTicketLink ? (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="ticket-outline" size={18} color="#00c6ff" />

                                <Text style={styles.sectionTitle}>
                                    Tickets
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={styles.ticketRow}
                                onPress={openTicketLink}
                                activeOpacity={0.8}
                            >
                                <View style={styles.ticketLeft}>
                                    <Text style={styles.ticketText}>
                                        {eventTicketInfo}
                                    </Text>

                                    <Text style={styles.ticketSub}>
                                        Extern öffnen
                                    </Text>
                                </View>

                                <Ionicons name="chevron-forward" size={20} color="#00c6ff" />
                            </TouchableOpacity>
                        </View>
                    ) : null}

                </View>
            </ScrollView>

            {/* ── BOTTOM CTA ── */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={openTicketLink}
                    style={{ flex: 1 }}
                >
                    <LinearGradient
                        colors={['#00c6ff', '#0072ff']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.ctaButton}
                    >
                        <Ionicons name="ticket-outline" size={20} color="#fff" />

                        <Text style={styles.ctaText}>
                            Jetzt Ticket sichern
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#0a0d14',
    },

    // ── HERO ──
    heroWrapper: {
        height: 380,
        position: 'relative',
    },

    heroImage: {
        width: '100%',
        height: '100%',
    },

    topBar: {
        position: 'absolute',
        top: 56,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },

    topIcons: {
        flexDirection: 'row',
        gap: 10,
    },

    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 999,
        backgroundColor: 'rgba(0,0,0,0.45)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    heroContent: {
        position: 'absolute',
        bottom: 24,
        left: 20,
        right: 20,
    },

    typeBadge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(0,198,255,0.2)',
        borderWidth: 1,
        borderColor: 'rgba(0,198,255,0.4)',
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 5,
        marginBottom: 10,
    },

    typeBadgeText: {
        color: '#00e5ff',
        fontSize: 12,
        fontWeight: '700',
    },

    heroTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: '#fff',
        marginBottom: 8,
        lineHeight: 36,
    },

    heroMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },

    heroMetaText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
    },

    // ── CONTENT ──
    content: {
        paddingHorizontal: 20,
        paddingTop: 24,
    },

    // ── META ROW ──
    metaRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 24,
    },

    metaCard: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
        gap: 4,
    },

    metaCardLabel: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginTop: 4,
    },

    metaCardValue: {
        fontSize: 13,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
    },

    metaCardSub: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.4)',
        textAlign: 'center',
    },

    // ── SHORT DESC ──
    shortDesc: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.6)',
        lineHeight: 24,
        marginBottom: 24,
        fontStyle: 'italic',
    },

    // ── SECTIONS ──
    section: {
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.07)',
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 14,
    },

    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.06)',
    },

    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#fff',
    },

    sectionText: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.6)',
        lineHeight: 24,
        padding: 16,
    },

    // ── LOCATION ──
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 16,
    },

    mapButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(0,198,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(0,198,255,0.25)',
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },

    mapButtonText: {
        color: '#00c6ff',
        fontSize: 12,
        fontWeight: '600',
    },

    // ── ORGANIZER ──
    organizerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },

    organizerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 999,
        backgroundColor: 'rgba(0,198,255,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(0,198,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    organizerAvatarText: {
        color: '#00c6ff',
        fontWeight: '800',
        fontSize: 16,
    },

    // ── TICKET ──
    ticketRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },

    ticketLeft: {
        gap: 2,
    },

    ticketText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#fff',
    },

    ticketSub: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)',
    },

    // ── BOTTOM CTA ──
    bottomBar: {
        position: 'absolute',
        bottom: 24,
        left: 20,
        right: 20,
    },

    ctaButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        borderRadius: 18,
        paddingVertical: 18,
    },

    ctaText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 16,
        letterSpacing: 0.3,
    },
});