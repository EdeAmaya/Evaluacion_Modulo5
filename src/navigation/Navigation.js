// src/navigation/Navigation.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Importar todas las pantallas
import SplashScreen from '../screens/SplashScreen';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Home from '../screens/Home';
import Add from '../screens/Add';
import EditProfile from '../screens/EditProfile';

const Stack = createNativeStackNavigator();

// Stack de autenticación (usuario no logueado)
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Register" component={Register} />
  </Stack.Navigator>
);

// Stack principal (usuario logueado)
const AppStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Home" 
      component={Home} 
      options={{ 
        title: 'Inicio',
        headerShown: false // Quitamos el header porque ya tenemos uno personalizado
      }} 
    />
    <Stack.Screen 
      name="Add" 
      component={Add} 
      options={{
        presentation: 'modal', 
        title: 'Agregar Producto'
      }}
    />
    <Stack.Screen 
      name="EditProfile" 
      component={EditProfile} 
      options={{
        title: 'Editar Perfil',
        headerBackTitle: 'Volver'
      }}
    />
  </Stack.Navigator>
);

// Componente de navegación principal
const AppNavigator = () => {
  const { user, loading } = useAuth();

  // Mostrar splash screen mientras se verifica la autenticación
  if (loading) {
    return <SplashScreen />;
  }

  // Mostrar el stack correspondiente según el estado de autenticación
  return user ? <AppStack /> : <AuthStack />;
};

// Componente principal que envuelve todo con el AuthProvider
const Navigation = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default Navigation;