# HappyCustomers - User Management App

**HappyCustomers** is a React Native application designed to display, filter, and manage a list of users. The app emphasizes **code quality, maintainability, and offline-first functionality**. It integrates with a GraphQL API to fetch user data and persists it in a local database, ensuring a seamless user experience even without a network connection.

## ✨ Key Features
- **Offline-First**: User data is stored in a local **WatermelonDB** database, making the app fully functional offline. The UI is always powered by the local database.  
- **GraphQL Integration**: Fetches user data from an **AWS AppSync GraphQL API** using **Apollo Client**.  
- **Efficient Data Sync**: Only fetches new data when the local cache is empty or stale (older than 24 hours), reducing unnecessary network requests.  
- **Reactive UI**: Automatically updates when the underlying data changes.  
- **Advanced Filtering & UI**: Swipe between **All**, **Admin**, and **Manager** lists with `react-native-pager-view`, smooth animated tab indicator, and pull-to-refresh functionality.  
- **User Search**: Debounced, case-insensitive search bar (toggleable).  
- **User Creation**: Add new users via a modal form with schema-based validation powered by **Formik + Yup**.  
- **Robust State Management**: Uses **Redux + redux-observable** to manage state and side effects like sync status.  
- **Component-Based Architecture**: Built with reusable, optimized, and well-structured components.  

## 🛠️ Technology Stack
- **Framework**: React Native (with TypeScript)  
- **Local Database**: WatermelonDB  
- **API Communication**: Apollo Client (GraphQL)  
- **State Management**: Redux + Redux-Observable  
- **Navigation**: React Navigation  
- **Forms & Validation**: Formik + Yup  
- **UI & Animation**: React Native Animated API, react-native-pager-view  
- **Testing**: Jest  

## ⚙️ Setup and Installation

### Prerequisites
- Node.js **v20.x or higher**  
- Yarn **v1.22.x or higher**    

### Steps
1. Clone the repository:  
   git clone <your-repository-url>  
   cd HappyCustomers  

2. Install dependencies:
   yarn install

3. Run on Android:
   yarn android

4. For iOS, install pods:
   cd ios && pod install

   If you see an error like:
   "CDN: trunk URL couldn't be downloaded: https://cdn.cocoapods.org/all_pods_versions_0_9_9.txt Response: Timeout was reached"

   Fix:
   - Add this line at the top of your Podfile:
     source 'https://github.com/CocoaPods/Specs.git'

   - Then run:
     pod install --repo-update

5. Run on iOS:
   yarn ios
   
 

## 📄 License
This project is licensed under the **MIT License**.  
