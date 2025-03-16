# **Ignite - Habit Tracking App**

Welcome to **Ignite**, a habit-tracking app designed to help users stay consistent with their goals through streak tracking, leaderboards, and real-time progress visualization.

## **Getting Started: Running Ignite Locally**
Follow these steps to set up and run Ignite on your local machine.

### **Prerequisites**
Before getting started, ensure you have the following installed:
- **Node.js** (Recommended: v16 or later) - [Download here](https://nodejs.org/)
- **Expo CLI** (For React Native development)
  ```sh
  npm install -g expo-cli
  ```
- **Git** (To clone the repository) - [Download here](https://git-scm.com/)
- **Firebase Project Setup** (Create a Firebase project and configure `firebaseConfig.js`)

### **Installation Steps**
1. **Clone the Repository**
   ```sh
   git clone https://github.com/your-team/ignite-habit-tracker.git
   cd ignite-habit-tracker
   ```

2. **Install Dependencies**
   ```sh
   npm install
   ```

3. **Set Up Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a project and enable **Authentication** and **Firestore Database**
   - Add a new **Web App** and copy the Firebase config
   - Replace the contents of `firebaseConfig.js` with your Firebase credentials

4. **Run the App**
   - Start the Expo development server:
     ```sh
     npm start
     ```
   - Scan the QR code in your Expo Go app (iOS/Android) or run it on an emulator:
     - iOS: `npm run ios`
     - Android: `npm run android`

5. **Sign Up and Start Tracking Habits!**
   - Create an account using **email/password** or **Google sign-in**
   - Set up your **first habits**
   - View your **streaks and leaderboards**

## **Project Documentation**
For a detailed breakdown of the app's architecture, features, and development process, check out our **[Project Documentation](https://drive.google.com/drive/folders/1My5z49qPy2h6xCVJAIuNypgWTBHHSvuq?usp=sharing)**.
