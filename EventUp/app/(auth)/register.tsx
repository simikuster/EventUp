import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    useWindowDimensions,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';

import { auth, db } from '@/firebaseConfig';

export default function Register() {
    const router = useRouter();
    const { width, height } = useWindowDimensions();

    const isLandscape = width > height;
    const isTablet = Math.min(width, height) >= 600;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await set(ref(db, 'users/' + user.uid), {
                email: email,
                createdAt: new Date().toISOString(),
            });

            alert('Account erstellt!');
            router.replace('/(auth)/login');
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar barStyle="light-content" />

            <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.scrollContent,
                    isLandscape && styles.scrollContentLandscape,
                ]}
            >
                <View
                    style={[
                        styles.layout,
                        isLandscape && styles.layoutLandscape,
                        isTablet && styles.layoutTablet,
                    ]}
                >
                    <LinearGradient
                        colors={['#00c6ff', '#0a7abf', '#0a0d14']}
                        start={{ x: 0.2, y: 0 }}
                        end={{ x: 0.8, y: 1 }}
                        style={[
                            styles.header,
                            isLandscape && styles.headerLandscape,
                        ]}
                    >
                        <View style={styles.headerContent}>
                            <Text
                                style={[
                                    styles.logo,
                                    isLandscape && styles.logoLandscape,
                                    isTablet && styles.logoTablet,
                                ]}
                            >
                                EVENT<Text style={styles.logoAccent}>UP</Text>
                            </Text>

                            <Text style={styles.tagline}>
                                DA WO WAS LÄUFT
                            </Text>
                        </View>
                    </LinearGradient>

                    <View
                        style={[
                            styles.card,
                            isLandscape && styles.cardLandscape,
                        ]}
                    >
                        <View style={styles.formMaxWidth}>
                            <Text style={styles.welcomeTitle}>
                                Account erstellen 🚀
                            </Text>

                            <Text style={styles.welcomeSubtitle}>
                                Kostenlos registrieren & Events entdecken
                            </Text>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>E-MAIL</Text>

                                <View style={styles.inputWrapper}>
                                    <Text style={styles.inputIcon}>✉</Text>

                                    <TextInput
                                        placeholder="dein@email.com"
                                        placeholderTextColor="rgba(255,255,255,0.3)"
                                        value={email}
                                        onChangeText={setEmail}
                                        style={styles.input}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>PASSWORT</Text>

                                <View style={styles.inputWrapper}>
                                    <Text style={styles.inputIcon}>🔒</Text>

                                    <TextInput
                                        placeholder="••••••••"
                                        placeholderTextColor="rgba(255,255,255,0.3)"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry
                                        style={styles.input}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity onPress={handleRegister} activeOpacity={0.85}>
                                <LinearGradient
                                    colors={['#00c6ff', '#0072ff']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.button}
                                >
                                    <Text style={styles.buttonText}>
                                        Account erstellen
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <View style={styles.divider}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>oder</Text>
                                <View style={styles.dividerLine} />
                            </View>

                            <Text style={styles.bottomText}>
                                Bereits registriert?{' '}
                                <Text
                                    style={styles.link}
                                    onPress={() => router.back()}
                                >
                                    Zum Login
                                </Text>
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0d14',
    },

    scrollContent: {
        flexGrow: 1,
        backgroundColor: '#0a0d14',
    },

    scrollContentLandscape: {
        minHeight: '100%',
    },

    layout: {
        flex: 1,
        backgroundColor: '#0a0d14',
    },

    layoutLandscape: {
        flexDirection: 'row',
        minHeight: 420,
    },

    layoutTablet: {
        alignSelf: 'center',
        width: '100%',
    },

    header: {
        height: 240,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 32,
    },

    headerLandscape: {
        height: '100%',
        width: '42%',
        minHeight: 420,
        justifyContent: 'center',
        paddingBottom: 0,
    },

    headerContent: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },

    logo: {
        fontSize: 44,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: -1,
        fontStyle: 'italic',
        textTransform: 'uppercase',
    },

    logoLandscape: {
        fontSize: 34,
    },

    logoTablet: {
        fontSize: 52,
    },

    logoAccent: {
        color: '#00e5ff',
    },

    tagline: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.55)',
        letterSpacing: 4,
        marginTop: 4,
        textAlign: 'center',
    },

    card: {
        flex: 1,
        backgroundColor: '#0a0d14',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        marginTop: -24,
        paddingHorizontal: 28,
        paddingTop: 36,
        paddingBottom: 36,
    },

    cardLandscape: {
        marginTop: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 34,
        justifyContent: 'center',
        paddingHorizontal: 34,
        paddingTop: 28,
        paddingBottom: 28,
    },

    formMaxWidth: {
        width: '100%',
        maxWidth: 520,
        alignSelf: 'center',
    },

    welcomeTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 6,
    },

    welcomeSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.45)',
        marginBottom: 28,
    },

    formGroup: {
        marginBottom: 18,
    },

    label: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.45)',
        letterSpacing: 1.5,
        marginBottom: 10,
        fontWeight: '600',
    },

    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 12,
    },

    inputIcon: {
        fontSize: 16,
        opacity: 0.4,
    },

    input: {
        flex: 1,
        color: '#fff',
        fontSize: 15,
        padding: 0,
    },

    button: {
        borderRadius: 16,
        paddingVertical: 17,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 26,
    },

    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
        letterSpacing: 0.5,
    },

    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 22,
        gap: 12,
    },

    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },

    dividerText: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 13,
    },

    bottomText: {
        textAlign: 'center',
        color: 'rgba(255,255,255,0.4)',
        fontSize: 14,
    },

    link: {
        color: '#00c6ff',
        fontWeight: '700',
    },
});