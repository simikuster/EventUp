// 🔥 LOGIN SCREEN — EventUp Style

import { View, Text, TextInput, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import { ref, get } from 'firebase/database';
import { db } from '@/firebaseConfig';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const snapshot = await get(ref(db, 'users/' + user.uid));
            if (snapshot.exists()) {
                console.log("👤 USER:", snapshot.val());
            }
            router.replace('/(tabs)');
        } catch (error: any) {
            alert("Login fehlgeschlagen");
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* 🎨 HEADER GRADIENT */}
            <LinearGradient
                colors={['#00c6ff', '#0a7abf', '#0a0d14']}
                start={{ x: 0.2, y: 0 }}
                end={{ x: 0.8, y: 1 }}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <Text style={styles.logo}>
                        EVENT<Text style={styles.logoAccent}>UP</Text>
                    </Text>
                    <Text style={styles.tagline}>DA WO WAS LÄUFT</Text>
                </View>
            </LinearGradient>

            {/* 📋 FORM CARD */}
            <View style={styles.card}>

                <Text style={styles.welcomeTitle}>Willkommen zurück 👋</Text>
                <Text style={styles.welcomeSubtitle}>Melde dich an, um Events zu entdecken</Text>

                {/* 📧 EMAIL */}
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

                {/* 🔒 PASSWORT */}
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

                {/* 🔘 LOGIN BUTTON */}
                <TouchableOpacity onPress={handleLogin} activeOpacity={0.85}>
                    <LinearGradient
                        colors={['#00c6ff', '#0072ff']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Anmelden</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* ─── DIVIDER ─── */}
                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>oder</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* 🔗 REGISTRIEREN */}
                <Text style={styles.bottomText}>
                    Noch kein Konto?{' '}
                    <Text
                        style={styles.link}
                        onPress={() => router.push('/(auth)/register')}
                    >
                        Registrieren
                    </Text>
                </Text>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0d14',
    },

    // ── HEADER ──
    header: {
        height: 240,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 32,
    },
    headerContent: {
        alignItems: 'center',
    },
    logo: {
        fontSize: 44,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: -1,
        fontStyle: 'italic',
        textTransform: 'uppercase',
    },
    logoAccent: {
        color: '#00e5ff',
    },
    tagline: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.55)',
        letterSpacing: 4,
        marginTop: 4,
    },

    // ── CARD ──
    card: {
        flex: 1,
        backgroundColor: '#0a0d14',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        marginTop: -24,
        paddingHorizontal: 28,
        paddingTop: 36,
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
        marginBottom: 32,
    },

    // ── FORM ──
    formGroup: {
        marginBottom: 20,
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

    // ── BUTTON ──
    button: {
        borderRadius: 16,
        paddingVertical: 17,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 28,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
        letterSpacing: 0.5,
    },

    // ── DIVIDER ──
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
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

    // ── BOTTOM ──
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