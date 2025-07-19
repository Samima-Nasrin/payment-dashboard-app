import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { deleteToken } from '../utils/storage';

const LogoutScreen = () => {
  const navigation = useNavigation<any>();

  useEffect(() => {
    const logout = async () => {
    await deleteToken('token');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    };

    logout();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator />
      <Text>Logging out...</Text>
    </View>
  );
};

export default LogoutScreen;
