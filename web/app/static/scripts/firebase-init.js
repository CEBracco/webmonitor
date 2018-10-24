// Initialize Firebase
var config = {
  apiKey: apiKey,
  authDomain: `${projectId}.firebaseapp.com`,
  databaseURL: `https://${projectId}.firebaseio.com`,
  projectId: projectId,
  storageBucket: `${projectId}.appspot.com`,
  messagingSenderId: messagingSenderId
};
firebase.initializeApp(config);

const messaging = firebase.messaging();
messaging.usePublicVapidKey(publicVapidKey);
