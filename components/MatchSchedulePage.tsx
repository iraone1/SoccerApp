import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Dimensions, ImageBackground } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Loading from './Loading';
import { ScrollView } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

export default function MatchSchedulePage({ route }) {
    const { leagueId } = route.params;
    const [matches, setMatches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [markedDates, setMarkedDates] = useState({});
    const apiKey = '5f718ec585c64de396d5252c8e10092c';

    useEffect(() => {
        fetch(`https://api.football-data.org/v4/competitions/${leagueId}/matches`, {
            headers: {
                'X-Auth-Token': apiKey,
            },
        })
        .then((response) => response.json())
        .then((json) => {
            if (!json.matches) {
                throw new Error("Data tidak valid atau tidak ada pertandingan.");
            }

            setMatches(json.matches);
            setIsLoading(false);

            const matchDates = {};
            json.matches.forEach((match) => {
                if (match.utcDate) {
                    const localDate = new Date(match.utcDate).toISOString().split('T')[0];
                    matchDates[localDate] = {
                        dots: [{ key: 'match', color: 'blue' }],
                        selected: false,
                    };
                }
            });

            setMarkedDates(matchDates);
        })
        .catch((error) => {
            console.error("Fetch error:", error);
            setIsLoading(false);
        });
    }, [leagueId]);

    const filteredMatches = matches.filter((match) => {
        return new Date(match.utcDate).toISOString().split('T')[0] === selectedDate;
    });

    const renderMatchItem = ({ item }) => {
        const matchDate = item.utcDate ? new Date(item.utcDate).toLocaleString() : "Tanggal tidak tersedia";
        return (
            <View style={styles.matchCard}>
                <View style={styles.matchRow}>
                    <Image source={{ uri: `https://crests.football-data.org/${item.homeTeam?.id}.png` }} style={styles.teamLogo} resizeMode="contain" />
                    <Text style={[styles.matchText, { flex: 2, textAlign: 'right' }]} numberOfLines={1}>{item.homeTeam?.name}</Text>
                    <Text style={[styles.matchText, { flex: 1, textAlign: 'center', fontWeight: 'bold' }]}>Vs</Text>
                    <Text style={[styles.matchText, { flex: 2, textAlign: 'left' }]} numberOfLines={1}>{item.awayTeam?.name}</Text>
                    <Image source={{ uri: `https://crests.football-data.org/${item.awayTeam?.id}.png` }} style={styles.teamLogo} resizeMode="contain" />
                </View>
                <Text style={styles.matchTime}>{matchDate}</Text>
            </View>
        );
    };
return (
    <ImageBackground source={require('../assets/istockphoto-185007737-612x612.jpg')} style={styles.background}>
        <View style={styles.container}>
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <Loading />
                </View>
            ) : (
                <ScrollView>
                    <View style={styles.calendarWrapper}>
                        <Calendar
                            markingType="multi-dot"
                            markedDates={{
                                ...markedDates,
                                [selectedDate]: { selected: true, selectedColor: 'blue' },
                            }}
                            onDayPress={(day) => setSelectedDate(day.dateString)}
                            theme={{
                                backgroundColor: 'transparent',
                                calendarBackground: '#f0f0f0',
                                textSectionTitleColor: '#b6c1cd',
                                selectedDayBackgroundColor: 'blue',
                                selectedDayTextColor: 'white',
                                todayTextColor: '#00adf5',
                                dayTextColor: '#2d4150',
                                arrowColor: 'blue',
                                monthTextColor: 'blue',
                                indicatorColor: 'blue',
                            }}
                        />
                    </View>
                    {filteredMatches.length > 0 ? (
                        <FlatList
                            nestedScrollEnabled={true}
                            style={{ marginTop: height * 0.03 }}
                            data={filteredMatches}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderMatchItem}
                        />
                    ) : (
                        <Text style={styles.noMatchText}>Tidak ada Jadwal pertandingan !</Text>
                    )}
                </ScrollView>
            )}
        </View>
    </ImageBackground>
);

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: width * 0.04,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
       
    },
    loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
},


    title: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        marginBottom: height * 0.02,
        color: '#ffffff',
        textAlign: 'center',
    },
    matchCard: {
        backgroundColor: 'white',
        padding: width * 0.04,
        marginBottom: height * 0.015,
        borderRadius: 8,
        elevation: 3,
    },
    matchText: {
        fontSize: width * 0.035,
        fontWeight: 'bold',
        color: '#111111',
    },
    matchTime: {
        fontSize: width * 0.04,
        color: '#1e1c1c',
        textAlign: 'center',
    },
    noMatchText: {
        fontSize: width * 0.04,
        textAlign: 'center',
        color: '#ffffff',
        marginTop: height * 0.02,
    },
     background: {
    flex: 1,
    resizeMode: 'cover',
  },
    matchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: height * 0.01,
        paddingHorizontal: width * 0.04,
    },
    teamLogo: {
        width: width * 0.08,
        height: width * 0.08,
        marginHorizontal: width * 0.02,
    },
    calendarWrapper: {
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: 'black',
        marginTop: height * 0.02,
    },
});
