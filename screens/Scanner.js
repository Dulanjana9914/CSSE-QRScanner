import React,{useState,useEffect} from 'react';
import { View, Text, StyleSheet,ToastAndroid } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import axios from "axios";
import Constants from "./Constants/Constants";

export default function Scanner(){
    /**
      * @description : Set initial state of the variables
   */
    const [hasPermission,setHasPermission]=useState(null);
    const [scanned,setScanned]=useState(false);
    const [timePassed,setTimePassed]=useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [sound, setSound] = React.useState();
    let coordinates=[];
    let arr=[];
    let token=null;
    let busID=null;

    useEffect(()=>{
        (async ()=>{
                /**
                  * @description : Request camera permissions
                */
            const {status} =await BarCodeScanner.requestPermissionsAsync();
               setHasPermission(status === 'granted');
                 /**
                  * @description : Request location permissions
                */
            const {locationpermission}=await Location.requestForegroundPermissionsAsync();
            if (locationpermission !== 'granted') {
               setErrorMsg('Location permission not granted'); 
               return;
            }
        })();
    },[]);

    const getLocation = async () => {
        /**
             * @description : Get location coordinates
             * @returns : location coordinates
        */
        const userLocation = await Location.getCurrentPositionAsync();
        const { longitude } = userLocation.coords;
        const { latitude } = userLocation.coords;
        var busLocation1=JSON.stringify(longitude);
        var busLocation2=JSON.stringify(latitude);
        var number1 = parseFloat(busLocation1);
        var number2 = parseFloat(busLocation2);
        coordinates.push(number1);
        coordinates.push(number2);
        //GPS Coordinates
        console.log(coordinates);
        
        
    };
    //play sound
    async function playSound() {
        /**
        * @description : play sound when the user scan the QR code
        * @returns : mp3 file
        */
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
             /**
             * @description : Display toast message after the user scan the QR code
             * @returns : Toast message
            */
            "QR Code Scanned Successfully",
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          );
          //Send data to backend
        axios.post(`${Constants.backend_url}/trip/start`,{
            /**
             * @description : pass location data, bus id and token id to the backend
             * @param : busID, token, coordinates
            */
            token:token,
            busID:busID,
            coordinates:coordinates
        }).then((response)=>{
            console.log(response.data);
        }).catch((error)=>{
            console.log(error);
        });
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
