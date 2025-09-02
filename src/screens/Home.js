// src/screens/Home.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList, 
  Alert,
  ScrollView 
} from 'react-native';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { auth, database } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import CardProductos from '../components/CardProductos';

const Home = ({ navigation }) => {
  const { user } = useAuth();
  const [productos, setProductos] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar información del usuario desde Firestore
  useEffect(() => {
    const loadUserInfo = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(database, 'usuarios', user.uid));
          if (userDoc.exists()) {
            setUserInfo(userDoc.data());
          } else {
            // Si no existe el documento en Firestore, usar datos de Auth
            setUserInfo({
              nombre: user.displayName || user.email,
              email: user.email,
            });
          }
        } catch (error) {
          console.error('Error al cargar información del usuario:', error);
          setUserInfo({
            nombre: user.displayName || user.email,
            email: user.email,
          });
        }
      }
      setLoading(false);
    };

    loadUserInfo();
  }, [user]);

  // Cargar productos (manteniendo la funcionalidad original)
  useEffect(() => {
    const q = query(collection(database, 'productos'), orderBy('creado', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setProductos(docs);
    });

    return () => unsubscribe();
  }, []);

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
              console.log('Usuario deslogueado');
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
              Alert.alert('Error', 'No se pudo cerrar la sesión');
            }
          },
        },
      ]
    );
  };

  const goToAdd = () => { 
    navigation.navigate('Add');
  };

  const goToEditProfile = () => {
    navigation.navigate('EditProfile', { userInfo });
  };

  const renderItem = ({ item }) => (
    <CardProductos
      id={item.id}
      nombre={item.nombre}
      precio={item.precio}
      vendido={item.vendido}
      imagen={item.imagen}
    />
  );

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
          <Text style={styles.welcomeText}>¡Hola!</Text>
          <Text style={styles.userName}>{userInfo?.nombre || 'Usuario'}</Text>
          {userInfo?.especialidad && (
            <Text style={styles.userSpeciality}>{userInfo.especialidad}</Text>
          )}
        </View>
        
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={goToEditProfile}
          >
            <Text style={styles.editProfileText}>Editar Perfil</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sección de productos */}
      <View style={styles.productsSection}>
        <Text style={styles.title}>Productos Disponibles</Text>

        {productos.length !== 0 ? (
          <FlatList
            data={productos}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay productos disponibles</Text>
            <Text style={styles.emptySubtext}>Agrega tu primer producto</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={goToAdd}
        >
          <Text style={styles.addButtonText}>+ Agregar Producto</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  header: {
    backgroundColor: '#0288d1',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 2,
  },
  userSpeciality: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    marginTop: 2,
  },
  headerButtons: {
    alignItems: 'flex-end',
  },
  editProfileButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 8,
  },
  editProfileText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  productsSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff9800',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#0288d1',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Home;