import React,{useState,useEffect} from 'react';
import { View, Text, StyleSheet,ToastAndroid } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

export default function Scanner(){
    const [hasPermission,setHasPermission]=useState(null);
    const [scanned,setScanned]=useState(false);
    const [timePassed,setTimePassed]=useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [sound, setSound] = React.useState();
    let coordinates=null;
    let token=null;
    let busID=null;

    useEffect(()=>{
        (async ()=>{
            //Camera permission
            const {status} =await BarCodeScanner.requestPermissionsAsync();
               setHasPermission(status === 'granted');
            //Location permission
            const {locationpermission}=await Location.requestForegroundPermissionsAsync();
            if (locationpermission !== 'granted') {
               setErrorMsg('Location permission not granted'); 
               return;
            }
        })();
    },[]);

    //Get location coordinates
    const getLocation = async () => {
        const userLocation = await Location.getCurrentPositionAsync();
        const { longitude,latitude } = userLocation.coords;
        const busLocation=JSON.stringify([longitude,latitude]);
        coordinates=busLocation;
        //GPS Coordinates
        console.log(coordinates);
        
    };
    //play sound
    async function playSound() {
        const { sound } = await Audio.Sound.createAsync( require('../assets/sound.mp3')
        );
        setSound(sound);
        await sound.playAsync();
      }
    //Barcode scanner
    const handleBarCodeScanned = async ({data}) =>{
        setScanned(true);
        setTimePassed(false);
        playSound();
        await getLocation();
        token=data;
        //Token
        console.log(token);
        busID= await AsyncStorage.getItem('bus');
        //Bus ID
        console.log(busID);
        ToastAndroid.showWithGravity(
            "QR Code Scanned Successfully",
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          );
        setTimeout(() => setTimePassed(true), 5000);
    };
   
    
    if(hasPermission=== null){
        return <Text>Request camera permission</Text>
    }
    if(hasPermission=== false){
        return <Text>No camera access</Text>
    }
    return(  
        <View style={styles.container}>
           <BarCodeScanner
             onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
             style = {StyleSheet.absoluteFillObject}
          />       
             {scanned && timePassed && setScanned(false)} 
        </View>
      )
}
const styles= StyleSheet.create({
    container :{
        flex : 1,
        flexDirection:'column',
        justifyContent:'center'
    }}
)
