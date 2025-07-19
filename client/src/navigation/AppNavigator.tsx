import React, { useState, useEffect } from "react";
import TransactionDetailsScreen from '../screens/TransactionDetailsScreen';
import LoginScreen from "../screens/LoginScreen";
import TabsNavigator from "./TabsNavigator";
import { getToken } from "../utils/storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddUserScreen from '../screens/AddUserScreen'; // Add this line

const Stack = createNativeStackNavigator<RootStackParamList>();
type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  TransactionDetails: undefined;
  AddUser: undefined;
};

const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken("token");
      setIsAuthenticated(!!token);
    };

    checkToken();
  }, []);

  if (isAuthenticated === null) {
    return null; 
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={TabsNavigator} />
        <Stack.Screen name="TransactionDetails" component={TransactionDetailsScreen} options={{ title: 'Transaction', headerShown: true }} />
        <Stack.Screen name="AddUser" component={AddUserScreen} /> 
        {/* Add this */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
