import React from 'react';
import { View, Text, StyleSheet, TextInput,Image  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '@rneui/themed';
import Logo from '../assets/logo.png';

export default function BusID(){
    let busID=null;
    const navigation = useNavigation();

    const handlesubmit=()=>{
        if(busID!=null){
        navigation.navigate('Scanner',{busID});
        AsyncStorage.setItem("bus", busID);
        }else{
            alert('Please enter bus ID');
        }
    }

    return(
        <View            
         style={{
            flex: 1,
            backgroundColor: "#f5f5f5",
            marginTop: 10,
            alignItems: "center",   
          }}>
            <Text  style={{ fontSize: 26, fontWeight: "bold", color: "black",textAlign:'center'}}>QR Scanner{'\n'}
            {'\n'}
            </Text>
            <Image source={Logo} style={{width: 200, height: 200}}
            />
            <Text>{'\n'}{'\n'}</Text>
            <Text  style={{ fontSize: 18, fontWeight: "bold", color: "black"}}>Please Enter Bus ID</Text>
            <TextInput
                placeholder="Bus ID"
                style={{
                  ...styles.textInput,
                  borderColor: "#154360",
                  borderWidth: 1,
                  backgroundColor: "white",
                  width: 300,
                }}
                placeholderTextColor="#154360"
                onChangeText={(text) => (busID = text)}
            />
           <Button
              title='Continue'
              titleStyle={{ fontWeight: 'bold', fontSize: 18 }}
              buttonStyle={{
                borderWidth: 0,
                borderColor: 'transparent',
                borderRadius: 20,
              }}
              containerStyle={{
                width: 200,
                marginHorizontal: 50,
                marginVertical: 10,
              }}
              icon={{
                name: 'arrow-right',
                type: 'font-awesome',
                size: 15,
                color: 'white',
              }}
              iconRight
              iconContainerStyle={{ marginLeft: 10, marginRight: -10 }}
              onPress={() =>handlesubmit()} />
             
        </View>
    );
}

//Add styles to the input field and the button
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f5f5f5",
    },
    textInput: {
      height: 50,
      borderRadius: 25,
      borderWidth: 0.5,
      marginHorizontal: 20,
      paddingLeft: 10,
      marginVertical: 5,
      borderColor: "rgba(0,0,0,0.2)",
    }
  });