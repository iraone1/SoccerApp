import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, ScrollView, ImageBackground } from 'react-native';
import Loading from './Loading';

const apiKey = '761e7fe919cb1a6d01dde37cadd27fd7'; // Ganti dengan API Key yang valid

export default function MatchTimeline({ route }) {
    const { matchId } = route.params;
    const [timeline, setTimeline] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                const response = await fetch(`https://v3.football.api-sports.io/fixtures/events?fixture=${matchId}`, {
                    method: 'GET',
                    headers: { 'x-apisports-key': apiKey },
                });
                const data = await response.json();
                if (data.response) {
                    setTimeline(data.response);
                }
            } catch (error) {
                console.error('Error fetching match timeline:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTimeline();
    }, [matchId]);

    return (
        <ImageBackground source={require('../assets/istockphoto-185007737-612x612.jpg')}style={styles.background}>
        <View style={styles.container}>
        <ScrollView>
            {isLoading ? (
                <Loading/>
            ) : timeline.length > 0 ? (
                <FlatList
                    data={timeline}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.time}>{item.time.elapsed}'</Text>
                            <Text style={styles.event}>
                                {item.type} - {item.player.name} ({item.team.name})
                            </Text>
                            {item.detail && <Text style={styles.detail}>{item.detail}</Text>}
                        </View>
                        
                    )}
                />
            ) : (
                <Text style={styles.noDataText}>Tidak ada event pertandingan</Text>
            )}
            </ScrollView>
        </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16,backgroundColor: 'rgba(0, 0, 0, 0.3)',  },
    card: { padding: 16, marginBottom: 10, borderRadius: 10, backgroundColor: '#f8f9fa' },
    time: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    event: { fontSize: 16, color: '#555' },
    detail: { fontSize: 14, color: '#777' },
    noDataText: { fontSize: 18, textAlign: 'center', marginTop: 20 },
     background: {
    flex: 1,
    resizeMode: 'cover',
  },
});
