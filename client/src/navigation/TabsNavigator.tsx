import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import AddPaymentScreen from '../screens/AddPaymentScreen';
import TransactionsListScreen from '../screens/TransactionsListScreen';
import LogoutScreen from '../screens/LogoutScreen';
import UsersListScreen from '../screens/UsersListScreen';
import { getUserRole } from '../utils/auth';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, ActivityIndicator } from 'react-native';

const Tab = createBottomTabNavigator();

const TabsNavigator = () => {
  const [role, setRole] = useState<'admin' | 'viewer' | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      const r = await getUserRole();
      setRole(r);
    };
    fetchRole();
  }, []);

  if (role === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

          switch (route.name) {
            case 'Dashboard':
              iconName = 'home-outline';
              break;
            case 'Add Payment':
              iconName = 'add-circle-outline';
              break;
            case 'Transactions':
              iconName = 'list-outline';
              break;
            case 'Users':
              iconName = 'people-outline';
              break;
            case 'Logout':
              iconName = 'log-out-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Add Payment" component={AddPaymentScreen} />
      <Tab.Screen name="Transactions" component={TransactionsListScreen} />
      {role === 'admin' && (
        <Tab.Screen name="Users" component={UsersListScreen} />
      )}
      <Tab.Screen name="Logout" component={LogoutScreen} />
    </Tab.Navigator>
  );
};

export default TabsNavigator;
