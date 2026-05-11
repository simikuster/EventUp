// 🔥 REGISTER SCREEN

import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import { ref, set } from 'firebase/database';
import { db } from '@/firebaseConfig';

export default function Register() {
    const router = useRouter();

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

            alert("Account erstellt!");

            router.replace('/(auth)/login');

        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <View style={styles.container}>

            {/* 🔥 BACKGROUND BLOBS */}
            <View style={styles.blob1} />
            <View style={styles.blob2} />

            {/* 🔥 CARD */}
            <View style={styles.card}>

                <Text style={styles.title}>EventUp</Text>

                <Text style={styles.subtitle}>
                    Erstelle deinen kostenlosen Account 🚀
                </Text>

                {/* 📧 EMAIL */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>E-Mail</Text>

                    <TextInput
                        placeholder="dein@email.com"
                        placeholderTextColor="rgba(255,255,255,0.45)"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                    />
                </View>

                {/* 🔒 PASSWORD */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Passwort</Text>

                    <TextInput
                        placeholder="••••••••"
                        placeholderTextColor="rgba(255,255,255,0.45)"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.input}
                    />
                </View>

                {/* 🔘 BUTTON */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleRegister}
                >
                    <Text style={styles.buttonText}>
                        Account erstellen
                    </Text>
                </TouchableOpacity>

                {/* 🔗 LOGIN */}
                <Text style={styles.bottomText}>
                    Bereits registriert?{" "}
                    <Text
                        style={styles.link}
                        onPress={() => router.back()}
                    >
                        Zum Login
                    </Text>
                </Text>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#070b14',
        padding: 24,
        overflow: 'hidden',
    },

    blob1: {
        position: 'absolute',
        width: 350,
        height: 350,
        borderRadius: 999,
        backgroundColor: '#2563eb',
        opacity: 0.25,
        top: -120,
        left: -120,
    },

    blob2: {
        position: 'absolute',
        width: 350,
        height: 350,
        borderRadius: 999,
        backgroundColor: '#7c3aed',
        opacity: 0.25,
        bottom: -120,
        right: -120,
    },

    card: {
        width: '100%',
        maxWidth: 420,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        borderRadius: 28,
        padding: 30,
    },

    title: {
        fontSize: 36,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 8,
    },

    subtitle: {
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        marginBottom: 30,
        fontSize: 15,
    },

    formGroup: {
        marginBottom: 18,
    },

    label: {
        color: 'rgba(255,255,255,0.75)',
        marginBottom: 8,
        fontSize: 13,
    },

    input: {
        width: '100%',
        padding: 15,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(255,255,255,0.04)',
        color: '#fff',
        fontSize: 15,
    },

    button: {
        width: '100%',
        padding: 16,
        borderRadius: 14,
        backgroundColor: '#3b82f6',
        alignItems: 'center',
        marginTop: 10,
    },

    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },

    bottomText: {
        textAlign: 'center',
        marginTop: 24,
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
    },

    link: {
        color: '#60a5fa',
        fontWeight: '600',
    },
});