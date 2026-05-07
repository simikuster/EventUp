import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type InputFieldProps = {
    label: string;
    placeholder?: string;
    multiline?: boolean;
    small?: boolean;
};

function InputField({ label, placeholder, multiline = false, small = false }: InputFieldProps) {
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
                placeholderTextColor="#A0A0A0"
                multiline={multiline}
                textAlignVertical={multiline ? 'top' : 'center'}
            />
        </View>
    );
}

export default function EventEinrichten() {
    return (
        <View style={styles.container}>
            

            <ScrollView
                style={styles.scroll}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Event Informationen erfassen</Text>

                    <InputField
                        label="Veranstaltungsort*"
                        placeholder="PLZ, Ort und/oder Name des Veranstaltungsortes"
                    />

                    <InputField
                        label="Eventtitel*"
                        placeholder="Eventtitel"
                    />

                    <InputField
                        label="Eventbeschreibung"
                        placeholder="Hier erfassen Sie eine Kurzbeschreibung in den wichtigsten Infos für die externe Kommunikation."
                        multiline
                    />

                    <InputField
                        label="Kurzbeschreibung*"
                        placeholder="Die Angaben sind wichtig für die Weiterverwendung in Medien und Kanälen."
                    />

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Eventtyp*</Text>
                        <TouchableOpacity style={styles.selectBox} activeOpacity={0.8}>
                            <Text style={styles.selectText}>-- Bitte wähle eine Rubrik aus --</Text>
                            <Ionicons name="chevron-down" size={16} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.row}>
                        <InputField label="Start *" placeholder="TT.MM.JJJJ" small />
                        <InputField label="Zeit *" placeholder="00:00" small />
                    </View>

                    <View style={styles.row}>
                        <InputField label="Ende" placeholder="TT.MM.JJJJ" small />
                        <InputField label="Zeit" placeholder="00:00" small />
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Event Bild</Text>
                    <Text style={styles.label}>Bild</Text>

                    <View style={styles.uploadBox}>
                        <Ionicons name="image-outline" size={22} color="#444" />
                        <TouchableOpacity style={styles.uploadButton} activeOpacity={0.8}>
                            <Text style={styles.uploadButtonText}>Bild hinzufügen</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Veranstalter</Text>

                    <InputField
                        label="Name der Veranstalter"
                        placeholder="PLZ, Ort und/oder Name des Veranstalters"
                    />

                    <InputField
                        label="Informationen zum Ticket verkauf"
                        placeholder=""
                    />

                    <InputField
                        label="Link zum Ticket verkauf"
                        placeholder=""
                    />
                </View>

                <TouchableOpacity style={styles.submitButton} activeOpacity={0.85}>
                    <Text style={styles.submitButtonText}>Event einreichen</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F3F3',
        paddingTop: 52,
    },

    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        textAlign: 'center',
        color: '#111',
        marginBottom: 12,
    },

    scroll: {
        flex: 1,
    },

    scrollContent: {
        paddingHorizontal: 12,
        paddingBottom: 80,
    },

    card: {
        backgroundColor: '#F7F7F7',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#D8D8D8',
    },

    cardTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#222',
        marginBottom: 10,
    },

    inputGroup: {
        marginBottom: 10,
    },

    smallInputGroup: {
        flex: 1,
        marginBottom: 0,
    },

    label: {
        fontSize: 10,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
    },

    input: {
        minHeight: 34,
        borderWidth: 1,
        borderColor: '#70C9F7',
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 8,
        fontSize: 10,
        color: '#111',
    },

    smallInput: {
        minHeight: 32,
    },

    textArea: {
        height: 90,
        paddingTop: 8,
    },

    selectBox: {
        minHeight: 34,
        borderWidth: 1,
        borderColor: '#70C9F7',
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    selectText: {
        fontSize: 10,
        color: '#6A6A6A',
    },

    row: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
    },

    uploadBox: {
        width: 130,
        height: 72,
        borderWidth: 1,
        borderColor: '#E2E2E2',
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
    },

    uploadButton: {
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#AFAFAF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 2,
        backgroundColor: '#F9F9F9',
    },

    uploadButtonText: {
        fontSize: 10,
        color: '#222',
    },

    submitButton: {
        alignSelf: 'center',
        backgroundColor: '#9BE1FF',
        paddingHorizontal: 22,
        paddingVertical: 10,
        borderRadius: 18,
        marginTop: 4,
        marginBottom: 30,
    },

    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
});