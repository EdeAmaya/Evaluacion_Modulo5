// src/screens/Home.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert
} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

const Home = ({ navigation }) => {
  const { user, userInfo, refreshUserInfo } = useAuth();
  const [loading, setLoading] = useState(true);

  // Cargar información del usuario cuando el componente se monta
  useEffect(() => {
    const loadData = async () => {
      if (userInfo) {
        setLoading(false);
      } else if (user) {
        await refreshUserInfo();
        setLoading(false);
      }
    };
    
    loadData();
  }, [user, userInfo, refreshUserInfo]);

  // Escuchar cuando regresa de EditProfile para refrescar datos
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (user) {
        refreshUserInfo();
      }
    });

    return unsubscribe;
  }, [navigation, user, refreshUserInfo]);

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          onPress: async () => {
            try {
              await signOut(auth);
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar la sesión');
            }
          },
        },
      ]
    );
  };

  const goToEditProfile = () => {
    navigation.navigate('EditProfile', { userInfo });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header con información del usuario */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>¡Bienvenido!</Text>
          <Text style={styles.userName}>{userInfo?.nombre || 'Usuario'}</Text>
          {userInfo?.especialidad && (
            <Text style={styles.userSpecialty}>{userInfo.especialidad}</Text>
          )}
          {userInfo?.edad && (
            <Text style={styles.userAge}>Edad: {userInfo.edad} años</Text>
          )}
        </View>
      </View>

      {/* Contenido principal */}
      <View style={styles.mainContent}>
        <View style={styles.welcomeCard}>
          <Text style={styles.cardTitle}>Panel de Usuario</Text>
          <Text style={styles.cardDescription}>
            Gestiona tu perfil y configuración desde aquí
          </Text>
        </View>

        {/* Botones principales */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={goToEditProfile}
          >
            <Text style={styles.primaryButtonText}>✏️ Editar Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>🚪 Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

        {/* Información adicional del usuario */}
        {userInfo && (
          <View style={styles.userDetailsCard}>
            <Text style={styles.cardTitle}>Mi Información</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{userInfo.email}</Text>
            </View>
            {userInfo.especialidad && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Especialidad:</Text>
                <Text style={styles.infoValue}>{userInfo.especialidad}</Text>
              </View>
            )}
            {userInfo.edad && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Edad:</Text>
                <Text style={styles.infoValue}>{userInfo.edad} años</Text>
              </View>
            )}
            {userInfo.fechaRegistro && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Miembro desde:</Text>
                <Text style={styles.infoValue}>
                  {new Date(userInfo.fechaRegistro.toDate()).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#6c757d',
  },
  header: {
    backgroundColor: '#0288d1',
    paddingTop: 50,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#0288d1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  userInfo: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  userName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  userSpecialty: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  userAge: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    textAlign: 'center',
  },
  mainContent: {
    flex: 1,
    padding: 24,
    marginTop: -16,
  },
  welcomeCard: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#0288d1',
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#0288d1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#dc3545',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userDetailsCard: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  infoLabel: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
});

export default Home;