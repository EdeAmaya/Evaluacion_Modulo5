// src/screens/EditProfile.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, database } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

const EditProfile = ({ navigation, route }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    edad: '',
    especialidad: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      if (user) {
        const userDoc = await getDoc(doc(database, 'usuarios', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFormData({
            nombre: userData.nombre || '',
            edad: userData.edad?.toString() || '',
            especialidad: userData.especialidad || '',
          });
        } else {
          // Si no existe en Firestore, usar datos de Auth
          setFormData({
            nombre: user.displayName || '',
            edad: '',
            especialidad: '',
          });
        }
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      Alert.alert('Error', 'No se pudo cargar la información del usuario');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handlePasswordInputChange = (field, value) => {
    setPasswordData({
      ...passwordData,
      [field]: value,
    });
  };

  const validateProfileForm = () => {
    const { nombre, edad, especialidad } = formData;

    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return false;
    }

    if (edad && (isNaN(edad) || parseInt(edad) < 1 || parseInt(edad) > 120)) {
      Alert.alert('Error', 'Por favor ingresa una edad válida');
      return false;
    }

    return true;
  };

  const validatePasswordForm = () => {
    const { currentPassword, newPassword, confirmNewPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos de contraseña');
      return false;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'Las nuevas contraseñas no coinciden');
      return false;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres');
      return false;
    }

    return true;
  };

  const updateUserProfile = async () => {
    if (!validateProfileForm()) return;

    setLoading(true);
    try {
      const { nombre, edad, especialidad } = formData;

      // Actualizar el displayName en Firebase Auth
      await updateProfile(user, {
        displayName: nombre,
      });

      // Actualizar datos en Firestore
      const userDocRef = doc(database, 'usuarios', user.uid);
      await updateDoc(userDocRef, {
        nombre: nombre,
        edad: edad ? parseInt(edad) : null,
        especialidad: especialidad,
        fechaActualizacion: new Date(),
      });

      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const updateUserPassword = async () => {
    if (!validatePasswordForm()) return;

    setLoading(true);
    try {
      const { currentPassword, newPassword } = passwordData;

      // Re-autenticar al usuario antes de cambiar la contraseña
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Actualizar contraseña
      await updatePassword(user, newPassword);

      Alert.alert('Éxito', 'Contraseña actualizada correctamente');
      
      // Limpiar campos de contraseña
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
      setShowPasswordSection(false);

    } catch (error) {
      console.error('Error al actualizar contraseña:', error);
      
      let errorMessage = 'No se pudo actualizar la contraseña';
      switch (error.code) {
        case 'auth/wrong-password':
          errorMessage = 'La contraseña actual es incorrecta';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos. Intenta más tarde';
          break;
        default:
          errorMessage = 'Error al actualizar contraseña';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Editar Perfil</Text>
          <Text style={styles.subtitle}>Actualiza tu información personal</Text>
        </View>

        {/* Sección de información personal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre Completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu nombre completo"
              value={formData.nombre}
              onChangeText={(text) => handleInputChange('nombre', text)}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Edad</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu edad"
              value={formData.edad}
              onChangeText={(text) => handleInputChange('edad', text)}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Especialidad</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Desarrollo Web, Marketing, Diseño..."
              value={formData.especialidad}
              onChangeText={(text) => handleInputChange('especialidad', text)}
              autoCapitalize="words"
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={updateUserProfile}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Actualizar Perfil</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Sección de cambio de contraseña */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.passwordToggle}
            onPress={() => setShowPasswordSection(!showPasswordSection)}
          >
            <Text style={styles.sectionTitle}>
              Cambiar Contraseña {showPasswordSection ? '▼' : '▶'}
            </Text>
          </TouchableOpacity>

          {showPasswordSection && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Contraseña Actual</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa tu contraseña actual"
                  value={passwordData.currentPassword}
                  onChangeText={(text) => handlePasswordInputChange('currentPassword', text)}
                  secureTextEntry={true}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nueva Contraseña</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Mínimo 6 caracteres"
                  value={passwordData.newPassword}
                  onChangeText={(text) => handlePasswordInputChange('newPassword', text)}
                  secureTextEntry={true}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirmar Nueva Contraseña</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Repite la nueva contraseña"
                  value={passwordData.confirmNewPassword}
                  onChangeText={(text) => handlePasswordInputChange('confirmNewPassword', text)}
                  secureTextEntry={true}
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity 
                style={[styles.button, styles.passwordButton, loading && styles.buttonDisabled]} 
                onPress={updateUserPassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Actualizar Contraseña</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Información del usuario (solo lectura) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de Cuenta</Text>
          <View style={styles.readOnlyContainer}>
            <Text style={styles.readOnlyLabel}>Correo Electrónico:</Text>
            <Text style={styles.readOnlyValue}>{user?.email}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Volver al Inicio</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  passwordToggle: {
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  readOnlyContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
  },
  readOnlyLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  readOnlyValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#0288d1',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  passwordButton: {
    backgroundColor: '#ff9800',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#666',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfile;