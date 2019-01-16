var logger = require('../../../../logger.js');
var config = require('../../../../config/config.js');
var db = null;

function initialize() {  
  const admin = require('firebase-admin');
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: config.get('FIREBASE_PROJECTID'),
      clientEmail: config.get('FIREBASE_CLIENTEMAIL'),
      privateKey: config.get('FIREBASE_PRIVATEKEY').replace(/\\n/g, '\n')
    }),
    databaseURL: config.get('FIREBASE_DATABASEURL')
  });
  db = admin.firestore();
  db.settings({timestampsInSnapshots:true});
}

function listAll(onComplete){
  logger.debug('Getting instances using firebase...');
  db.collection(config.get('FIREBASE_COLLECTION')).get()
    .then((snapshot) => {
      var municipalities = [];
      snapshot.forEach((doc) => {
        municipalities.push(doc.data());
      });
      onComplete(municipalities);
    })
    .catch((err) => {
      logger.error('Error getting documents', err);
    });
}

initialize();

module.exports = {
  listAll:listAll
}
