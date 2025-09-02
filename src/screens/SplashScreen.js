// src/screens/SplashScreen.js
import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Simular carga de 3 segundos
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Mi Aplicación</Text>
        <Text style={styles.subtitle}>Gestión de Productos y Usuarios</Text>
        
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>LOGO</Text>
          </View>
        </View>
        
        <ActivityIndicator size="large" color="#0288d1" style={styles.loader} />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
      
      <Text style={styles.footer}>© 2024 - Desarrollado con React Native</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0288d1',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  logoContainer: {
    marginBottom: 60,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0288d1',
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0288d1',
  },
  loader: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default SplashScreen;