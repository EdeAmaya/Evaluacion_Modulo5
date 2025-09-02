# ProfileHub - Aplicación de Gestión de Perfiles

Una aplicación móvil desarrollada en React Native con Expo para la gestión de perfiles de usuario, incluyendo autenticación y actualización de información personal.

## 👥 Estudiantes

- **Edenilson Alexander Amaya Benitez** - Carnet: 20200004
- **Jose Luis Iraheta Marroquin** - Carnet: 20200149

## 🎥 Video Demostrativo

[Enlace del video demostrativo]:
https://www.awesomescreenshot.com/video/43754692?key=aa30f806a5acbd033d5890f5bac79aad

## 🚀 Características Principales

- ✅ Autenticación de usuarios (Login/Registro)
- ✅ Gestión de perfiles personales
- ✅ Edición de información del usuario
- ✅ Cambio de contraseña
- ✅ Interfaz moderna y responsive
- ✅ Validaciones robustas
- ✅ Manejo de errores intuitivo

## 📱 Pantallas de la Aplicación

1. **SplashScreen** - Pantalla de carga inicial
2. **Login** - Inicio de sesión
3. **Register** - Registro de nuevos usuarios
4. **Home** - Panel principal del usuario
5. **EditProfile** - Edición del perfil

## 🛠 Dependencias Utilizadas

### Dependencias Principales

```json
{
  "expo": "~51.0.28",
  "react": "18.2.0",
  "react-native": "0.74.5",
  "@react-navigation/native": "^6.0.0",
  "@react-navigation/native-stack": "^6.0.0",
  "firebase": "^10.0.0",
  "expo-image-picker": "~15.0.7",
  "expo-status-bar": "~1.12.1"
}
```

### Dependencias de Navegación

- **@react-navigation/native** - Sistema de navegación principal
- **@react-navigation/native-stack** - Navegación tipo stack
- **react-native-screens** - Optimización de pantallas
- **react-native-safe-area-context** - Manejo de áreas seguras

### Firebase

- **firebase** - SDK de Firebase para JavaScript
  - **firebase/auth** - Autenticación de usuarios
  - **firebase/firestore** - Base de datos NoSQL
  - **firebase/app** - Configuración principal

### Expo

- **expo** - Framework y herramientas de desarrollo
- **expo-status-bar** - Configuración de la barra de estado
- **expo-image-picker** - Selección de imágenes (implementado pero no utilizado actualmente)

## 🔧 Instalación y Configuración

### Prerrequisitos

- Node.js (v16 o superior)
- npm o yarn
- Expo CLI
- Cuenta de Firebase

### Pasos de Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd profilehub-app
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Ejecutar la aplicación:**
   ```bash
   npx expo start
   ```

## 🏗 Estructura del Proyecto

```
src/
├── components/
│   └── CardProductos.js       # Componente de tarjeta (no utilizado)
├── config/
│   └── firebase.js           # Configuración de Firebase
├── context/
│   └── AuthContext.js        # Contexto de autenticación
├── navigation/
│   └── Navigation.js         # Configuración de navegación
└── screens/
    ├── Add.js               # Pantalla de agregar (no utilizada)
    ├── EditProfile.js       # Edición de perfil
    ├── Home.js              # Pantalla principal
    ├── Login.js             # Inicio de sesión
    ├── Register.js          # Registro de usuarios
    └── SplashScreen.js      # Pantalla de carga
```

## 🔐 Configuración de Firebase

### Firestore Database

La aplicación utiliza Firestore con la siguiente estructura de colecciones:

#### Colección: `usuarios`
```javascript
{
  uid: string,           // ID único del usuario
  nombre: string,        // Nombre completo
  email: string,         // Correo electrónico
  edad: number,          // Edad del usuario
  especialidad: string,  // Especialidad o profesión
  fechaRegistro: Date,   // Fecha de registro
  fechaActualizacion: Date // Última actualización
}
```

### Reglas de Seguridad Recomendadas

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```



## 📋 Funcionalidades Implementadas

### Autenticación
- [x] Registro de usuarios con validaciones
- [x] Inicio de sesión con manejo de errores
- [x] Logout con confirmación
- [x] Contexto de autenticación global

### Gestión de Perfil
- [x] Visualización de información del usuario
- [x] Edición de datos personales
- [x] Cambio de contraseña con reautenticación
- [x] Actualización en tiempo real
- [x] Validaciones de formularios

### Interfaz de Usuario
- [x] Splash screen animado
- [x] Navegación entre pantallas
- [x] Diseño responsive
- [x] Estados de carga
- [x] Manejo de errores usuario-amigable

## 🔄 Estados de la Aplicación

1. **Loading** - Verificando autenticación
2. **Authenticated** - Usuario logueado → Home
3. **Unauthenticated** - Usuario no logueado → Login/Register

## 🐛 Manejo de Errores

- Validaciones de formularios en tiempo real
- Mensajes de error específicos y claros
- Manejo de errores de red y Firebase
- Estados de carga durante operaciones asíncronas





---



