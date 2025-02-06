import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Loading from './Loading';

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

            // Tandai tanggal pertandingan di kalender dengan label "Match"
            const matchDates = {};
            json.matches.forEach((match) => {
                if (match.utcDate) {
                    const matchDate = new Date(match.utcDate);
                    matchDate.setHours(matchDate.getHours() + 7); // Add 7 hours for WIB

                    const localDate = matchDate.toISOString().split('T')[0]; // Get the local date part

                    matchDates[localDate] = {
                        dots: [
                            { key: 'match', color: 'blue', legendText: 'Match' }, // Menampilkan teks di bawah tanggal
                        ],
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
    }, [leagueId, apiKey]);

    // Filter pertandingan berdasarkan tanggal yang dipilih
    const filteredMatches = matches.filter((match) => match.utcDate?.startsWith(selectedDate));

    const renderMatchItem = ({ item }) => {
        const matchDate = item.utcDate ? new Date(item.utcDate).toLocaleString() : "Tanggal tidak tersedia";
        return (
            <View style={styles.matchCard}>
                <Text style={styles.matchText}>
                    {item.homeTeam?.name} vs {item.awayTeam?.name}
                </Text>
                <Text style={styles.matchTime}>{matchDate}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Jadwal Pertandingan</Text>

            {/* Kalender untuk memilih tanggal */}
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
            calendarBackground: '#f0f0f0', // Background of the calendar
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

            {isLoading ? (
<Loading/>
) : filteredMatches.length > 0 ? (
                <FlatList
                    style={{ marginTop: 30 }}
                    data={filteredMatches}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderMatchItem}
                />
            ) : (
                <Text style={styles.noMatchText}>Tidak ada Jadwal pertandingan !</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    calendarWrapper: {
        borderRadius: 10, // Set your desired borderRadius here
        overflow: 'hidden', // Ensures the borderRadius applies to the content inside
        backgroundColor: 'black', // Optional: you can set a background color for the wrapper
        marginTop: 20, // Optional: add margin if needed
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'gray',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    matchCard: {
        backgroundColor: 'white',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    matchText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    matchTime: {
        fontSize: 14,
        color: '#888',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noMatchText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#888',
        marginTop: 20,
    },
});
