import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
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
            <View style={styles.card}>

                <Text style={styles.title}>Log in</Text>

                <Text style={styles.subtitle}>
                    Noch kein Konto?{" "}
                    <Text style={styles.link} onPress={() => router.push('/(auth)/register')}>
                        Registrieren
                    </Text>
                </Text>

                <Text style={styles.label}>Email</Text>
                <TextInput
                    placeholder="Email eingeben"
                    placeholderTextColor="#6B7280"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                />

                <TextInput
                    placeholder="Passwort eingeben"
                    placeholderTextColor="#6B7280"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                />

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Log in</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6f8',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 12,
        elevation: 3,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        marginBottom: 20,
        color: '#666',
    },
    label: {
        marginBottom: 5,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#0f766e',
        padding: 14,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    link: {
        color: '#0f766e',
        fontWeight: '600',
    },
});