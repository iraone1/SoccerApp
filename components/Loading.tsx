import React, { Component } from 'react'
import { Text, View,ActivityIndicator } from 'react-native'

export class Loading extends Component {
  render() {
    return (
     <View style={{alignItems:'center',flex:1,justifyContent:'center',backgroundColor:'#050505'}}>
        <ActivityIndicator size="large" color="#dcc91f"  />
        <Text style={{textAlign:'center',fontSize:30,fontWeight:'bold',color:'white'}}> Tunggu Rek!!! Masih loading</Text>
    </View>
    )
  }
}

export default Loading
