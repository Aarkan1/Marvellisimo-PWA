const {
  Stitch,
  RemoteMongoClient
} = stitch

export const client = Stitch.initializeDefaultAppClient('marvellisimo-xebqg');
export const db = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('marvellisimo');
export const collUsers = db.collection('users');
export const collSend = db.collection('send');
export const collSubs = db.collection('subs');
