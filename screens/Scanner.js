import React,{useState,useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Location from 'expo-location';

export default function Scanner(){
    const [hasPermission,setHasPermission]=useState(null);
    const [scanned,setScanned]=useState(false);
    const [timePassed,setTimePassed]=useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    let coordinates=null;
    let token=null;

    useEffect(()=>{
        (async ()=>{
            //Camera permission
            const {status} =await BarCodeScanner.requestPermissionsAsync();
               setHasPermission(status === 'granted');
            //Location permission
            const {locationpermission}=await Location.requestForegroundPermissionsAsync();
            if (locationpermission !== 'granted') {
               setErrorMsg('Location permission not granted');
               alert(errorMsg);
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
        console.log(coordinates);
        
    };
     
    //Barcode scanner
    const handleBarCodeScanned = async ({data}) =>{
        setScanned(true);
        setTimePassed(false);
        await getLocation();
        token=data;
        console.log(token);
        alert(`QR code data ${`${token}`} has been scanned`);
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
