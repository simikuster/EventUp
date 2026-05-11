import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Share,
    StatusBar,
    Switch,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';

import { auth } from '@/firebaseConfig';
import { signOut } from 'firebase/auth';

type SettingsRowProps = {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    arrow?: boolean;
    rightText?: string;
    onPress?: () => void;
};

export default function Settings() {
    const [darkMode, setDarkMode] = useState(true);
    const [language, setLanguage] = useState<'Deutsch' | 'English'>('Deutsch');

    const user = auth.currentUser;

    const goToLogin = () => {
        router.push('/(auth)/login');
    };

    const goToRegister = () => {
        router.push('/(auth)/register');
    };

    const goToEventCreate = () => {
        router.push('/EventEinrichten');
    };

    const createVote = () => {
        Alert.alert(
            'Abstimmung erstellen',
            'Diese Funktion kann später mit einem Formular verbunden werden. Zum Beispiel: Titel, Standort, Beschreibung und Abstimmungsoptionen.'
        );
    };

    const changeLanguage = () => {
        Alert.alert(
            'Sprache auswählen',
            'Welche Sprache möchtest du verwenden?',
            [
                {
                    text: 'Deutsch',
                    onPress: () => setLanguage('Deutsch'),
                },
                {
                    text: 'English',
                    onPress: () => setLanguage('English'),
                },
                {
                    text: 'Abbrechen',
                    style: 'cancel',
                },
            ]
        );
    };

    const showHelp = () => {
        Alert.alert(
            'Hilfe',
            'In EventUp kannst du Events entdecken, speichern, teilen und bei Weekly-Abstimmungen mitmachen.'
        );
    };

    const showTerms = () => {
        Alert.alert(
            'AGB',
            'Hier stehen später die Allgemeinen Geschäftsbedingungen von EventUp.'
        );
    };

    const showPrivacy = () => {
        Alert.alert(
            'Datenschutzerklärung',
            'Hier steht später, wie EventUp mit Benutzerdaten, gespeicherten Events und Abstimmungen umgeht.'
        );
    };

    const sendFeedback = async () => {
        try {
            await Share.share({
                title: 'Feedback zu EventUp',
                message:
                    'Mein Feedback zu EventUp:\n\n' +
                    'Was mir gefällt:\n\n' +
                    'Was verbessert werden könnte:\n',
            });
        } catch (error) {
            Alert.alert('Fehler', 'Das Feedback konnte nicht geöffnet werden.');
        }
    };

    const logout = async () => {
        if (!user) {
            Alert.alert('Nicht angemeldet', 'Du bist momentan nicht angemeldet.');
            return;
        }

        Alert.alert(
            'Abmelden',
            'Möchtest du dich wirklich abmelden?',
            [
                {
                    text: 'Abbrechen',
                    style: 'cancel',
                },
                {
                    text: 'Abmelden',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await signOut(auth);
                            router.replace('/(auth)/login');
                        } catch (error) {
                            Alert.alert('Fehler', 'Du konntest nicht abgemeldet werden.');
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={styles.header}>
                <Text style={styles.headerKicker}>EVENTUP</Text>
                <Text style={styles.headerTitle}>Einstellungen</Text>
            </View>

            <ScrollView
                style={styles.scroll}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.profileCard}>
                    <LinearGradient
                        colors={['#00c6ff', '#0072ff']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.profileIcon}
                    >
                        <Ionicons name="person" size={26} color="#fff" />
                    </LinearGradient>

                    <View style={styles.profileContent}>
                        <Text style={styles.profileTitle}>
                            {user ? 'Angemeldet' : 'Gastmodus'}
                        </Text>

                        <Text style={styles.profileSubtitle} numberOfLines={1}>
                            {user?.email || 'Melde dich an, um alle Funktionen zu nutzen.'}
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Einreichen</Text>

                    <SettingsRow
                        icon="add-circle-outline"
                        title="Event eintragen"
                        subtitle="Neues Event erfassen"
                        arrow
                        onPress={goToEventCreate}
                    />

                    <SettingsRow
                        icon="podium-outline"
                        title="Abstimmung erstellen"
                        subtitle="Weekly-Vote vorbereiten"
                        arrow
                        onPress={createVote}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Konto</Text>

                    <SettingsRow
                        icon="log-out-outline"
                        title="Abmelden"
                        subtitle={user ? 'Aktuelles Konto abmelden' : 'Du bist nicht angemeldet'}
                        arrow
                        onPress={logout}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>App</Text>

                    <SettingsRow
                        icon="language-outline"
                        title="Sprache"
                        subtitle="App-Sprache auswählen"
                        rightText={language}
                        onPress={changeLanguage}
                    />

                    <View style={styles.row}>
                        <View style={styles.rowLeft}>
                            <View style={styles.rowIcon}>
                                <Ionicons name="moon-outline" size={18} color="#00c6ff" />
                            </View>

                            <View>
                                <Text style={styles.rowText}>Darkmode</Text>
                                <Text style={styles.rowSubtitle}>
                                    Dunkles Design verwenden
                                </Text>
                            </View>
                        </View>

                        <Switch
                            value={darkMode}
                            onValueChange={setDarkMode}
                            thumbColor={darkMode ? '#00e5ff' : '#f4f4f5'}
                            trackColor={{
                                false: 'rgba(255,255,255,0.16)',
                                true: 'rgba(0,198,255,0.35)',
                            }}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informationen</Text>

                    <SettingsRow
                        icon="help-circle-outline"
                        title="Hilfe"
                        subtitle="Kurze Erklärung zur App"
                        arrow
                        onPress={showHelp}
                    />

                    <SettingsRow
                        icon="document-text-outline"
                        title="AGB"
                        subtitle="Allgemeine Geschäftsbedingungen"
                        arrow
                        onPress={showTerms}
                    />

                    <SettingsRow
                        icon="shield-checkmark-outline"
                        title="Datenschutzerklärung"
                        subtitle="Informationen zum Datenschutz"
                        arrow
                        onPress={showPrivacy}
                    />

                    <SettingsRow
                        icon="chatbubble-ellipses-outline"
                        title="Feedback geben"
                        subtitle="Teile deine Meinung zu EventUp"
                        arrow
                        onPress={sendFeedback}
                    />
                </View>

                <Text style={styles.versionText}>EventUp Version 1.0.0</Text>
            </ScrollView>
        </View>
    );
}

function SettingsRow({
    icon,
    title,
    subtitle,
    arrow = false,
    rightText,
    onPress,
}: SettingsRowProps) {
    return (
        <TouchableOpacity
            style={styles.row}
            activeOpacity={0.75}
            onPress={onPress}
        >
            <View style={styles.rowLeft}>
                <View style={styles.rowIcon}>
                    <Ionicons name={icon} size={18} color="#00c6ff" />
                </View>

                <View style={styles.rowTextWrapper}>
                    <Text style={styles.rowText}>{title}</Text>

                    {subtitle && (
                        <Text style={styles.rowSubtitle}>
                            {subtitle}
                        </Text>
                    )}
                </View>
            </View>

            <View style={styles.rowRight}>
                {rightText && (
                    <Text style={styles.rightText}>
                        {rightText}
                    </Text>
                )}

                {arrow && (
                    <Ionicons
                        name="chevron-forward"
                        size={18}
                        color="rgba(255,255,255,0.35)"
                    />
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#0a0d14',
        paddingTop: 62,
    },

    // ── HEADER ──

    header: {
        paddingHorizontal: 20,
        marginBottom: 22,
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

    scroll: {
        flex: 1,
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 120,
    },

    // ── PROFILE ──

    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        borderRadius: 24,
        padding: 16,
        marginBottom: 22,
    },

    profileIcon: {
        width: 56,
        height: 56,
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },

    profileContent: {
        flex: 1,
    },

    profileTitle: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '800',
        marginBottom: 3,
    },

    profileSubtitle: {
        color: 'rgba(255,255,255,0.42)',
        fontSize: 13,
    },

    // ── SECTION ──

    section: {
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 22,
        marginBottom: 18,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },

    sectionTitle: {
        color: '#00e5ff',
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        paddingTop: 15,
        paddingHorizontal: 16,
        paddingBottom: 8,
    },

    // ── ROW ──

    row: {
        minHeight: 66,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.06)',
    },

    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    rowIcon: {
        width: 36,
        height: 36,
        borderRadius: 999,
        backgroundColor: 'rgba(0,198,255,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(0,198,255,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    rowTextWrapper: {
        flex: 1,
    },

    rowText: {
        fontSize: 15,
        color: '#fff',
        fontWeight: '700',
    },

    rowSubtitle: {
        color: 'rgba(255,255,255,0.36)',
        fontSize: 12,
        marginTop: 3,
    },

    rowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginLeft: 10,
    },

    rightText: {
        color: 'rgba(255,255,255,0.42)',
        fontSize: 13,
        fontWeight: '600',
    },

    versionText: {
        textAlign: 'center',
        color: 'rgba(255,255,255,0.25)',
        fontSize: 12,
        marginTop: 6,
    },
});