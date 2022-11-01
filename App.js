import React from "react";
import Scanner from "./screens/Scanner";
import BusID from "./screens/BusID";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack= createStackNavigator();

function App() {
    return(
      <Stack.Navigator>
        <Stack.Screen name="Home" component={BusID}/>
        <Stack.Screen name="Scanner" component={Scanner}/>
      </Stack.Navigator>

    );
}

export default()=>{
  return(
  <NavigationContainer>
      <App/>
  </NavigationContainer>
  )
}