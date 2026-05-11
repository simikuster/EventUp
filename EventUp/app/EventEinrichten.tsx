import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Image,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ref, push, set } from 'firebase/database';
import * as ImagePicker from 'expo-image-picker';
import { db } from '../firebaseConfig';

type InputFieldProps = {
    label: string;
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    multiline?: boolean;
    small?: boolean;
};

function InputField({
    label,
    placeholder,
    value,
    onChangeText,
    multiline = false,
    small = false,
}: InputFieldProps) {
    return (
        <View style={[styles.inputGroup, small && styles.smallInputGroup]}>
            <Text style={styles.label}>{label}</Text>

            <TextInput
                style={[
                    styles.input,
                    multiline && styles.textArea,
                    small && styles.smallInput,
                ]}
                placeholder={placeholder}
                placeholderTextColor="rgba(255,255,255,0.28)"
                value={value}
                onChangeText={onChangeText}
                multiline={multiline}
                textAlignVertical={multiline ? 'top' : 'center'}
            />
        </View>
    );
}

export default function EventEinrichten() {
    const [location, setLocation] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [eventType, setEventType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');
    const [organizerName, setOrganizerName] = useState('');
    const [ticketInfo, setTicketInfo] = useState('');
    const [ticketLink, setTicketLink] = useState('');
    const [imageUri, setImageUri] = useState('');
    const [loading, setLoading] = useState(false);

    const chooseImageOption = () => {
        Alert.alert(
            'Event Bild hinzufügen',
            'Möchtest du ein Foto aufnehmen oder ein Bild auswählen?',
            [
                {
                    text: 'Kamera öffnen',
                    onPress: takePhoto,
                },
                {
                    text: 'Bild auswählen',
                    onPress: pickImage,
                },
                {
                    text: 'Abbrechen',
                    style: 'cancel',
                },
            ]
        );
    };

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert(
                'Keine Berechtigung',
                'Bitte erlaube den Zugriff auf deine Bilder.'
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert(
                'Keine Berechtigung',
                'Bitte erlaube den Zugriff auf deine Kamera.'
            );
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const removeImage = () => {
        setImageUri('');
    };

    const saveEvent = async () => {
        if (!location || !title || !shortDescription || !eventType || !startDate || !startTime) {
            Alert.alert(
                'Fehlende Angaben',
                'Bitte fülle alle Pflichtfelder aus.'
            );
            return;
        }

        try {
            setLoading(true);

            const eventsRef = ref(db, 'events');
            const newEventRef = push(eventsRef);

            await set(newEventRef, {
                location,
                title,
                description,
                shortDescription,
                eventType,
                startDate,
                startTime,
                endDate,
                endTime,
                imageUrl: imageUri,
                organizerName,
                ticketInfo,
                ticketLink,
                status: 'pending',
                createdAt: new Date().toISOString(),
            });

            Alert.alert('Erfolgreich', 'Das Event wurde erfolgreich eingereicht.');

            setLocation('');
            setTitle('');
            setDescription('');
            setShortDescription('');
            setEventType('');
            setStartDate('');
            setStartTime('');
            setEndDate('');
            setEndTime('');
            setOrganizerName('');
            setTicketInfo('');
            setTicketLink('');
            setImageUri('');
        } catch (error) {
            console.log('Fehler beim Speichern:', error);
            Alert.alert('Fehler', 'Das Event konnte nicht gespeichert werden.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar barStyle="light-content" />

            <ScrollView
                style={styles.scroll}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.header}>
                    <Text style={styles.headerKicker}>EVENTUP</Text>
                    <Text style={styles.headerTitle}>Event einreichen</Text>
                    <Text style={styles.headerSubtitle}>
                        Erfasse dein Event. Pflichtfelder sind mit * markiert.
                    </Text>
                </View>

                <View style={styles.infoBox}>
                    <View style={styles.infoIcon}>
                        <Ionicons name="information-circle-outline" size={20} color="#00e5ff" />
                    </View>

                    <Text style={styles.infoText}>
                        Dein Event wird zuerst geprüft und danach in der App angezeigt.
                    </Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.cardIcon}>
                            <Ionicons name="calendar-outline" size={18} color="#00e5ff" />
                        </View>

                        <Text style={styles.cardTitle}>Event Informationen</Text>
                    </View>

                    <InputField
                        label="Veranstaltungsort*"
                        placeholder="PLZ, Ort und Name des Veranstaltungsortes"
                        value={location}
                        onChangeText={setLocation}
                    />

                    <InputField
                        label="Eventtitel*"
                        placeholder="Titel des Events"
                        value={title}
                        onChangeText={setTitle}
                    />

                    <InputField
                        label="Eventbeschreibung"
                        placeholder="Beschreibe dein Event etwas genauer."
                        value={description}
                        onChangeText={setDescription}
                        multiline
                    />

                    <InputField
                        label="Kurzbeschreibung*"
                        placeholder="Kurzer Text für die Event-Übersicht"
                        value={shortDescription}
                        onChangeText={setShortDescription}
                    />

                    <InputField
                        label="Eventtyp*"
                        placeholder="z.B. Musik, Sport, Kultur, Party"
                        value={eventType}
                        onChangeText={setEventType}
                    />

                    <View style={styles.row}>
                        <InputField
                            label="Startdatum*"
                            placeholder="TT.MM.JJJJ"
                            value={startDate}
                            onChangeText={setStartDate}
                            small
                        />

                        <InputField
                            label="Startzeit*"
                            placeholder="00:00"
                            value={startTime}
                            onChangeText={setStartTime}
                            small
                        />
                    </View>

                    <View style={styles.row}>
                        <InputField
                            label="Enddatum"
                            placeholder="TT.MM.JJJJ"
                            value={endDate}
                            onChangeText={setEndDate}
                            small
                        />

                        <InputField
                            label="Endzeit"
                            placeholder="00:00"
                            value={endTime}
                            onChangeText={setEndTime}
                            small
                        />
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.cardIcon}>
                            <Ionicons name="image-outline" size={18} color="#00e5ff" />
                        </View>

                        <Text style={styles.cardTitle}>Event Bild</Text>
                    </View>

                    <Text style={styles.label}>Bild</Text>

                    <TouchableOpacity
                        style={styles.uploadBox}
                        activeOpacity={0.8}
                        onPress={chooseImageOption}
                    >
                        {imageUri ? (
                            <Image
                                source={{ uri: imageUri }}
                                style={styles.previewImage}
                            />
                        ) : (
                            <>
                                <View style={styles.uploadIcon}>
                                    <Ionicons name="cloud-upload-outline" size={28} color="#00e5ff" />
                                </View>

                                <Text style={styles.uploadTitle}>Bild hinzufügen</Text>

                                <Text style={styles.uploadHint}>
                                    Kamera öffnen oder Bild auswählen
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {imageUri ? (
                        <View style={styles.imageActions}>
                            <TouchableOpacity
                                style={styles.changeImageButton}
                                onPress={chooseImageOption}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="image-outline" size={16} color="#00c6ff" />
                                <Text style={styles.changeImageText}>Bild ändern</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.removeImageButton}
                                onPress={removeImage}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="trash-outline" size={16} color="#FF6B6B" />
                                <Text style={styles.removeImageText}>Bild entfernen</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}
                </View>

                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.cardIcon}>
                            <Ionicons name="business-outline" size={18} color="#00e5ff" />
                        </View>

                        <Text style={styles.cardTitle}>Veranstalter</Text>
                    </View>

                    <InputField
                        label="Name der Veranstalter"
                        placeholder="Name des Veranstalters"
                        value={organizerName}
                        onChangeText={setOrganizerName}
                    />

                    <InputField
                        label="Informationen zum Ticketverkauf"
                        placeholder="z.B. Eintritt frei, Vorverkauf, Abendkasse"
                        value={ticketInfo}
                        onChangeText={setTicketInfo}
                    />

                    <InputField
                        label="Link zum Ticketverkauf"
                        placeholder="https://..."
                        value={ticketLink}
                        onChangeText={setTicketLink}
                    />
                </View>

                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={saveEvent}
                    disabled={loading}
                >
                    <LinearGradient
                        colors={['#00c6ff', '#0072ff']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                    >
                        <Text style={styles.submitButtonText}>
                            {loading ? 'Wird gespeichert...' : 'Event einreichen'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0d14',
    },

    scroll: {
        flex: 1,
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 62,
        paddingBottom: 120,
    },

    header: {
        marginBottom: 20,
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
        fontSize: 34,
        fontWeight: '900',
        letterSpacing: -1,
    },

    headerSubtitle: {
        color: 'rgba(255,255,255,0.45)',
        fontSize: 14,
        marginTop: 5,
        lineHeight: 20,
        maxWidth: 320,
    },

    infoBox: {
        backgroundColor: 'rgba(0,198,255,0.1)',
        borderRadius: 20,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(0,198,255,0.24)',
    },

    infoIcon: {
        width: 36,
        height: 36,
        borderRadius: 999,
        backgroundColor: 'rgba(0,198,255,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(0,198,255,0.24)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },

    infoText: {
        flex: 1,
        fontSize: 13,
        color: 'rgba(255,255,255,0.58)',
        lineHeight: 18,
    },

    card: {
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 22,
        padding: 15,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },

    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },

    cardIcon: {
        width: 36,
        height: 36,
        borderRadius: 999,
        backgroundColor: 'rgba(0,198,255,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(0,198,255,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },

    cardTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#fff',
    },

    inputGroup: {
        marginBottom: 13,
    },

    smallInputGroup: {
        flex: 1,
        marginBottom: 0,
    },

    label: {
        fontSize: 12,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 7,
    },

    input: {
        minHeight: 46,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.06)',
        paddingHorizontal: 13,
        fontSize: 13,
        color: '#fff',
    },

    smallInput: {
        minHeight: 44,
    },

    textArea: {
        height: 108,
        paddingTop: 12,
        lineHeight: 18,
    },

    row: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 13,
    },

    uploadBox: {
        height: 165,
        borderWidth: 1.5,
        borderColor: 'rgba(0,198,255,0.32)',
        borderStyle: 'dashed',
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.04)',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
        overflow: 'hidden',
    },

    previewImage: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },

    uploadIcon: {
        width: 54,
        height: 54,
        borderRadius: 999,
        backgroundColor: 'rgba(0,198,255,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(0,198,255,0.24)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    uploadTitle: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: '800',
        color: '#fff',
    },

    uploadHint: {
        marginTop: 4,
        fontSize: 12,
        color: 'rgba(255,255,255,0.35)',
    },

    imageActions: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 11,
    },

    changeImageButton: {
        flex: 1,
        minHeight: 42,
        borderRadius: 15,
        backgroundColor: 'rgba(0,198,255,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(0,198,255,0.25)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    changeImageText: {
        marginLeft: 6,
        fontSize: 12,
        fontWeight: '700',
        color: '#00c6ff',
    },

    removeImageButton: {
        flex: 1,
        minHeight: 42,
        borderRadius: 15,
        backgroundColor: 'rgba(255,107,107,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,107,107,0.25)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    removeImageText: {
        marginLeft: 6,
        fontSize: 12,
        fontWeight: '700',
        color: '#FF6B6B',
    },

    submitButton: {
        paddingVertical: 16,
        borderRadius: 999,
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 30,
    },

    submitButtonDisabled: {
        opacity: 0.6,
    },

    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '800',
    },
});