// components/ArticlePage.js
import React from 'react';
import {  View } from 'react-native';
import { WebView } from 'react-native-webview'; // Make sure to install react-native-webview

const ArticlePage = ({ route }) => {
  const { articleUrl } = route.params; // Get the URL passed from FootballNewsPage

  return (
<View style={{ flex: 1 }}>
      <WebView source={{ uri: articleUrl }} style={{ flex: 1 }} />
    </View>
  );
};

export default ArticlePage;
