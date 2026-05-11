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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ref, push, set } from 'firebase/database';
import * as ImagePicker from 'expo-image-picker';
import { db } from '../firebaseConfig';

const IMAGE_UPLOAD_URL = 'http://10.44.32.115:5000/api/images/upload';

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
                placeholderTextColor="#9A9A9A"
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

    const uploadImageToNodeServer = async (uri: string) => {
        if (uri.startsWith('http://') || uri.startsWith('https://')) {
            return uri;
        }

        const fileName = uri.split('/').pop() || `event_${Date.now()}.jpg`;
        const extension = fileName.split('.').pop()?.toLowerCase();

        let mimeType = 'image/jpeg';

        if (extension === 'png') {
            mimeType = 'image/png';
        } else if (extension === 'webp') {
            mimeType = 'image/webp';
        } else if (extension === 'jpg' || extension === 'jpeg') {
            mimeType = 'image/jpeg';
        }

        const formData = new FormData();

        formData.append('image', {
            uri,
            name: fileName,
            type: mimeType,
        } as any);

        const response = await fetch(IMAGE_UPLOAD_URL, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const responseText = await response.text();

        if (!response.ok) {
            throw new Error(responseText || 'Bild konnte nicht hochgeladen werden.');
        }

        return responseText.trim();
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

            let uploadedImageUrl = '';

            if (imageUri) {
                uploadedImageUrl = await uploadImageToNodeServer(imageUri);
                setImageUri(uploadedImageUrl);
            }

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
                imageUrl: uploadedImageUrl,
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

            if (error instanceof Error) {
                Alert.alert('Fehler', error.message);
            } else {
                Alert.alert('Fehler', 'Das Event konnte nicht gespeichert werden.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                style={styles.scroll}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.infoBox}>
                    <Ionicons name="information-circle-outline" size={20} color="#0077B6" />
                    <Text style={styles.infoText}>
                        Erfasse hier dein Event. Pflichtfelder sind mit * markiert.
                    </Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="calendar-outline" size={20} color="#111" />
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
                        <Ionicons name="image-outline" size={20} color="#111" />
                        <Text style={styles.cardTitle}>Event Bild</Text>
                    </View>

                    <Text style={styles.label}>Bild</Text>

                    <TouchableOpacity
                        style={styles.uploadBox}
                        activeOpacity={0.8}
                        onPress={chooseImageOption}
                        disabled={loading}
                    >
                        {imageUri ? (
                            <Image
                                source={{ uri: imageUri }}
                                style={styles.previewImage}
                            />
                        ) : (
                            <>
                                <Ionicons name="cloud-upload-outline" size={28} color="#0077B6" />
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
                                disabled={loading}
                            >
                                <Ionicons name="image-outline" size={16} color="#0077B6" />
                                <Text style={styles.changeImageText}>Bild ändern</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.removeImageButton}
                                onPress={removeImage}
                                activeOpacity={0.8}
                                disabled={loading}
                            >
                                <Ionicons name="trash-outline" size={16} color="#D62828" />
                                <Text style={styles.removeImageText}>Bild entfernen</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}
                </View>

                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="business-outline" size={20} color="#111" />
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
                    style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                    activeOpacity={0.85}
                    onPress={saveEvent}
                    disabled={loading}
                >
                    <Text style={styles.submitButtonText}>
                        {loading ? 'Wird gespeichert...' : 'Event einreichen'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2',
    },

    scroll: {
        flex: 1,
    },

    scrollContent: {
        paddingHorizontal: 14,
        paddingTop: 16,
        paddingBottom: 90,
    },

    infoBox: {
        backgroundColor: '#EAF7FF',
        borderRadius: 14,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#BDEBFF',
    },

    infoText: {
        flex: 1,
        marginLeft: 8,
        fontSize: 12,
        color: '#24566B',
        lineHeight: 17,
    },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 14,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#E4E4E4',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },

    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },

    cardTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#111',
        marginLeft: 8,
    },

    inputGroup: {
        marginBottom: 12,
    },

    smallInputGroup: {
        flex: 1,
        marginBottom: 0,
    },

    label: {
        fontSize: 12,
        fontWeight: '700',
        color: '#333',
        marginBottom: 6,
    },

    input: {
        minHeight: 44,
        borderWidth: 1,
        borderColor: '#9BE1FF',
        borderRadius: 12,
        backgroundColor: '#FAFAFA',
        paddingHorizontal: 12,
        fontSize: 13,
        color: '#111',
    },

    smallInput: {
        minHeight: 42,
    },

    textArea: {
        height: 105,
        paddingTop: 12,
        lineHeight: 18,
    },

    row: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 12,
    },

    uploadBox: {
        height: 155,
        borderWidth: 1.5,
        borderColor: '#9BE1FF',
        borderStyle: 'dashed',
        borderRadius: 16,
        backgroundColor: '#FAFDFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
        overflow: 'hidden',
    },

    previewImage: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
    },

    uploadTitle: {
        marginTop: 8,
        fontSize: 13,
        fontWeight: '800',
        color: '#111',
    },

    uploadHint: {
        marginTop: 3,
        fontSize: 11,
        color: '#777',
    },

    imageActions: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 10,
    },

    changeImageButton: {
        flex: 1,
        minHeight: 40,
        borderRadius: 12,
        backgroundColor: '#EAF7FF',
        borderWidth: 1,
        borderColor: '#BDEBFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    changeImageText: {
        marginLeft: 6,
        fontSize: 12,
        fontWeight: '700',
        color: '#0077B6',
    },

    removeImageButton: {
        flex: 1,
        minHeight: 40,
        borderRadius: 12,
        backgroundColor: '#FFF1F1',
        borderWidth: 1,
        borderColor: '#FFD0D0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    removeImageText: {
        marginLeft: 6,
        fontSize: 12,
        fontWeight: '700',
        color: '#D62828',
    },

    submitButton: {
        backgroundColor: '#87CEEB',
        paddingVertical: 15,
        borderRadius: 24,
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
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