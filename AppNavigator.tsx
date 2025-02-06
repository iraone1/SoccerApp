import React from 'react';
import { View } from 'react-native'; // Added Text import
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ListPage from './components/ListPage';
import DetailPage from './components/DetailPage';

import Icon from 'react-native-vector-icons/Ionicons';
import MatchSchedulePage from './components/MatchSchedulePage';
import MatchDetailPage from './components/MatchDetailPage';
import LiveScore from './components/LiveScore';
import FootballNewsPage from './components/FootballNewsPage';
import ArticlePage from './components/ArticlePage';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack Navigator for the List and Detail screens
function ListStackNavigatorNew() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackground: () => (
          <View
            style={{
              flex: 1,
              backgroundColor: '#151416',
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              overflow: 'hidden',
              borderColor: 'red',
              borderWidth: 2,
            }}
          />
        ),
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 24 },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen name="berita" component={FootballNewsPage} options={{ title: 'Berita' }} />
       <Stack.Screen name="Article" component={ArticlePage} />
    </Stack.Navigator>
  );
}

function ListStackNavigatorLive() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackground: () => (
          <View
            style={{
              flex: 1,
              backgroundColor: '#151416',
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              overflow: 'hidden',
              borderColor: 'red',
              borderWidth: 2,
            }}
          />
        ),
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 24 },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen name="live" component={LiveScore} options={{ title: 'Live Score' }} />
      <Stack.Screen name="MatchDetail" component={MatchDetailPage} options={{ title: 'Detail Pertandingan' }} />

    </Stack.Navigator>
  );
}

function ListStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackground: () => (
          <View
            style={{
              flex: 1,
              backgroundColor: '#151416',
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              overflow: 'hidden',
              borderColor: 'red',
              borderWidth: 2,
            }}
          />
        ),
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 24 },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen name="List" component={ListPage} options={{ title: 'Home' }} />
      <Stack.Screen name="Detail" component={DetailPage} options={{ title: 'Klasmen' }} />
      <Stack.Screen name="Match" component={MatchSchedulePage} options={{ title: 'Jadwal Pertandingan' }} />
      <Stack.Screen name="Highlight" component={MatchSchedulePage} options={{ title: 'Highlight Match' }} />
      <Stack.Screen name="live" component={LiveScore} options={{ title: 'Live Score' }} />
      <Stack.Screen name="InfoTeam" component={MatchDetailPage} options={{ title: 'Match' }} />
    </Stack.Navigator>
  );
}

// Main App with Bottom Tabs
export default function AppNavigator() {
  return (
    <View style={{ flex: 1, backgroundColor: 'gray' }}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName = '';
              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Live Score') {
                iconName = focused ? 'football' : 'football-outline';
              } else if (route.name === 'Berita') {
                iconName = focused ? 'newspaper' : 'newspaper-outline';
              }
              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'white',
            tabBarStyle: {
              backgroundColor: 'black',
              opacity: 0.9,
              borderColor: 'red',
              borderWidth: 3,
              borderTopWidth: 5,
              borderRadius: 20,
              height: '7%',
              marginBottom: 5,
              marginHorizontal: 5,
              marginTop: 10,
            },
          })}
        >
          <Tab.Screen name="Home" component={ListStackNavigator} options={{ headerShown: false }} />
          <Tab.Screen name="Berita" component={ListStackNavigatorNew} options={{ headerShown: false }} />
          <Tab.Screen name="Live Score" component={ListStackNavigatorLive} options={{ headerShown: false }} />
          
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
}
