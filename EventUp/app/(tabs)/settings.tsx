import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

type SettingsRowProps = {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    arrow?: boolean;
    onPress?: () => void;
};

export default function Settings() {
    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Einstellungen</Text>

            <ScrollView
                style={styles.scroll}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Einreichen</Text>

                    <SettingsRow
                        icon="add-circle-outline"
                        title="Event eintragen"
                        arrow
                        onPress={() => router.push('/EventEinrichten')}
                    />

                    <SettingsRow
                        icon="add-circle-outline"
                        title="Abstimmung erstellen"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Einstellungen</Text>

                    <SettingsRow
                        icon="person"
                        title="Anmelden"
                        arrow
                    />

                    <SettingsRow
                        icon="create-outline"
                        title="Registrieren"
                        arrow
                    />

                    <SettingsRow
                        icon="language-outline"
                        title="Sprache"
                    />

                    <SettingsRow
                        icon="moon-outline"
                        title="Darkmode"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>App</Text>

                    <SettingsRow
                        icon="help-circle-outline"
                        title="Hilfe"
                        arrow
                    />

                    <SettingsRow
                        icon="document-text-outline"
                        title="AGB"
                        arrow
                    />

                    <SettingsRow
                        icon="shield-checkmark-outline"
                        title="Datenschutzerklärung"
                        arrow
                    />

                    <SettingsRow
                        icon="chatbubble-ellipses-outline"
                        title="Feedback geben"
                        arrow
                    />
                </View>
            </ScrollView>
        </View>
    );
}

function SettingsRow({ icon, title, arrow = false, onPress }: SettingsRowProps) {
    return (
        <TouchableOpacity
            style={styles.row}
            activeOpacity={0.7}
            onPress={onPress}
        >
            <View style={styles.rowLeft}>
                <Ionicons name={icon} size={18} color="#222" />
                <Text style={styles.rowText}>{title}</Text>
            </View>

            {arrow && (
                <Ionicons
                    name="chevron-forward"
                    size={18}
                    color="#4DB8FF"
                />
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2',
        paddingTop: 55,
    },

    headerTitle: {
        fontSize: 26,
        fontWeight: '800',
        textAlign: 'center',
        color: '#111',
        marginBottom: 18,
    },

    scroll: {
        flex: 1,
    },

    scrollContent: {
        paddingHorizontal: 12,
        paddingBottom: 30,
    },

    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        marginBottom: 14,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },

    sectionTitle: {
        backgroundColor: '#E9E9E9',
        color: '#222',
        fontSize: 13,
        fontWeight: '700',
        paddingVertical: 7,
        paddingHorizontal: 10,
    },

    row: {
        minHeight: 38,
        paddingHorizontal: 10,
        paddingVertical: 9,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },

    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    rowText: {
        fontSize: 14,
        color: '#222',
        marginLeft: 8,
    },
});