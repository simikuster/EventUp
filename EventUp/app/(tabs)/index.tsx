import { View, Text, StyleSheet, Image, TextInput, ImageBackground, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRef } from 'react';

export default function Home() {
    const scrollY = useRef(new Animated.Value(0)).current;

    const logoTranslateY = scrollY.interpolate({
        inputRange: [0, 180],
        outputRange: [0, -60],
        extrapolate: 'clamp',
    });

    const logoOpacity = scrollY.interpolate({
        inputRange: [0, 160],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const searchScale = scrollY.interpolate({
        inputRange: [0, 140],
        outputRange: [1, 0.9],
        extrapolate: 'clamp',
    });

    const searchOpacity = scrollY.interpolate({
        inputRange: [0, 140],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const searchTranslateY = scrollY.interpolate({
        inputRange: [0, 140],
        outputRange: [0, -25],
        extrapolate: 'clamp',
    });

    return (
        <View style={styles.container}>
            <Animated.ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
            >
                <Animated.View
                    style={[
                        styles.headerWrapper,
                        {
                            opacity: logoOpacity,
                            transform: [{ translateY: logoTranslateY }],
                        },
                    ]}
                >
                    <ImageBackground
                        source={require('../../assets/images/logo.png')}
                        style={styles.header}
                        resizeMode="cover"
                    />
                </Animated.View>

                <Animated.View
                    style={[
                        styles.searchWrapper,
                        {
                            opacity: searchOpacity,
                            transform: [
                                { scale: searchScale },
                                { translateY: searchTranslateY },
                            ],
                        },
                    ]}
                >
                    <View style={styles.searchBox}>
                        <Ionicons
                            name="search"
                            size={20}
                            color="#888"
                            style={styles.icon}
                        />

                        <TextInput
                            placeholder="Nach Events suchen"
                            placeholderTextColor="#888"
                            style={styles.input}
                        />
                    </View>
                </Animated.View>

                <Text style={styles.sectionTitle}>Für Dich</Text>

                <View style={styles.card}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1506157786151-b8491531f063' }}
                        style={styles.image}
                    />

                    <View style={styles.cardContent}>
                        <Text style={styles.title}>Sommernachtfestival</Text>
                        <Text style={styles.subtitle}>Kirchplatz Andwil</Text>
                        <Text style={styles.subtitle}>Sa, 27.06 / 20:00 Uhr</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Trends</Text>

                <View style={styles.row}>
                    <View style={styles.smallCard}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745' }}
                            style={styles.smallImage}
                        />

                        <Text style={styles.smallTitle}>Beat & Bass Night</Text>
                    </View>

                    <View style={styles.smallCard}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4' }}
                            style={styles.smallImage}
                        />

                        <Text style={styles.smallTitle}>Open Mic Night</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Events Entdecken</Text>

                {[1, 2, 3].map((item) => (
                    <View key={item} style={styles.card}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1521336575822-6da63fb45455' }}
                            style={styles.image}
                        />

                        <View style={styles.cardContent}>
                            <Text style={styles.title}>Event {item}</Text>
                            <Text style={styles.subtitle}>Ort</Text>
                            <Text style={styles.subtitle}>Datum</Text>
                        </View>
                    </View>
                ))}
            </Animated.ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },

    content: {
        flex: 1,
    },

    contentContainer: {
        paddingBottom: 24,
    },

    headerWrapper: {
        width: '100%',
    },

    header: {
        height: 240,
        width: '100%',
    },

    searchWrapper: {
        width: '100%',
        alignItems: 'center',
        marginTop: -24,
        marginBottom: 90,
        zIndex: 10,
    },

    searchBox: {
        width: '85%',
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },

    icon: {
        marginRight: 8,
    },

    input: {
        flex: 1,
        fontSize: 14,
        color: '#000',
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 15,
        marginTop: 10,
    },

    card: {
        backgroundColor: '#fff',
        margin: 15,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 3,
    },

    image: {
        width: '100%',
        height: 180,
    },

    cardContent: {
        padding: 10,
    },

    title: {
        fontWeight: 'bold',
        fontSize: 16,
    },

    subtitle: {
        color: '#666',
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 15,
    },

    smallCard: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 2,
    },

    smallImage: {
        width: '100%',
        height: 100,
    },

    smallTitle: {
        padding: 8,
        fontSize: 13,
        fontWeight: '500',
    },
});