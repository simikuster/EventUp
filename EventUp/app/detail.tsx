import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Linking,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useLocalSearchParams, router } from 'expo-router';

export default function Detail() {

    const {
        title,
        image,
        imageUrl,
        location,

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
    } = useLocalSearchParams();

    return (

        <View style={styles.container}>

            {/* 🔝 TOP BAR */}
            <View style={styles.topBar}>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >

                    <Ionicons
                        name="chevron-back"
                        size={34}
                        color="#000"
                    />

                    <Text style={styles.backText}>
                        Zurück
                    </Text>

                </TouchableOpacity>

                <View style={styles.topIcons}>

                    <TouchableOpacity>

                        <Ionicons
                            name="bookmark-outline"
                            size={28}
                            color="#000"
                        />

                    </TouchableOpacity>

                    <TouchableOpacity style={{ marginLeft: 18 }}>

                        <Ionicons
                            name="share-outline"
                            size={28}
                            color="#000"
                        />

                    </TouchableOpacity>

                </View>

            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 120,
                }}
            >

                {/* 📷 IMAGE */}
                <Image
                    source={{
                        uri:
                            (image as string) ||
                            (imageUrl as string) ||
                            'https://images.unsplash.com/photo-1506157786151-b8491531f063',
                    }}
                    style={styles.image}
                />

                {/* 📅 DATE */}
                <Text style={styles.date}>
                    {startDate} • {startTime} Uhr
                </Text>

                {/* 🎫 TITLE */}
                <Text style={styles.title}>
                    {title}
                </Text>

                {/* 🏷 EVENT TYPE */}
                <Text style={styles.organizer}>
                    Kategorie: {eventType || 'Event'}
                </Text>

                {/* ⏰ TIME */}
                <Text style={styles.time}>
                    {startTime} - {endTime} Uhr
                </Text>

                {/* 📝 SHORT DESCRIPTION */}
                <Text style={styles.description}>
                    {shortDescription || 'Keine Kurzbeschreibung vorhanden'}
                </Text>

                {/* 📍 ADRESSE */}
                <View style={styles.sectionCard}>

                    <Text style={styles.sectionTitle}>
                        Adresse
                    </Text>

                    <Text style={styles.sectionText}>
                        {location || 'Keine Adresse vorhanden'}
                    </Text>

                </View>

                {/* 📝 BESCHREIBUNG */}
                <View style={styles.sectionCard}>

                    <Text style={styles.sectionTitle}>
                        Beschreibung
                    </Text>

                    <Text style={styles.sectionText}>
                        {description || 'Keine Beschreibung vorhanden'}
                    </Text>

                </View>

                {/* 🌐 WEBSITE */}
                <View style={styles.sectionCard}>

                    <Text style={styles.sectionTitle}>
                        Links zum Event
                    </Text>

                    <TouchableOpacity
                        style={styles.websiteRow}
                        onPress={() => {

                            if (ticketLink) {
                                Linking.openURL(ticketLink as string);
                            }

                        }}
                    >

                        <View style={styles.websiteLeft}>

                            <Ionicons
                                name="ticket-outline"
                                size={20}
                                color="#000"
                            />

                            <Text style={styles.websiteText}>
                                {ticketInfo || 'Zum Ticket'}
                            </Text>

                        </View>

                        <Ionicons
                            name="chevron-forward"
                            size={24}
                            color="#60A5FA"
                        />

                    </TouchableOpacity>

                </View>

                {/* 👤 VERANSTALTER */}
                <View style={styles.sectionCard}>

                    <Text style={styles.sectionTitle}>
                        Veranstalter
                    </Text>

                    <Text style={styles.sectionText}>
                        {organizerName || 'Nicht angegeben'}
                    </Text>

                </View>

            </ScrollView>

        </View>

    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        paddingTop: 65,
    },

    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 18,
        marginBottom: 18,
    },

    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    backText: {
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 4,
    },

    topIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    image: {
        width: '88%',
        height: 220,
        borderRadius: 18,
        alignSelf: 'center',
        backgroundColor: '#ddd',
    },

    date: {
        textAlign: 'center',
        marginTop: 18,
        color: '#444',
        fontSize: 18,
    },

    title: {
        textAlign: 'center',
        fontSize: 42,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#000',
        paddingHorizontal: 20,
    },

    organizer: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 18,
        color: '#222',
    },

    time: {
        textAlign: 'center',
        marginTop: 4,
        fontSize: 18,
        color: '#222',
    },

    description: {
        marginTop: 26,
        marginHorizontal: 30,
        textAlign: 'center',
        lineHeight: 24,
        color: '#333',
        fontSize: 16,
    },

    sectionCard: {
        backgroundColor: '#fff',
        marginHorizontal: 18,
        marginTop: 18,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 3,
    },

    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 22,
        padding: 16,
        backgroundColor: '#f1f1f1',
    },

    sectionText: {
        padding: 16,
        fontSize: 17,
        color: '#333',
        lineHeight: 25,
    },

    websiteRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },

    websiteLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    websiteText: {
        marginLeft: 10,
        fontSize: 17,
        flex: 1,
    },

});