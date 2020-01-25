var webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BKd9TV_7mRd8D_Ml2iCUYNMui6cxukbnKcoDctX20DGHDDiYmG7z-2CiF_RnZ275NzWlTc8fFkKiSEbnh42JISc",
   "privateKey": "eZubbn2ra_kxV2q2tCYozZ9nNywrCJfpaUVUJ-8AcCc"
};
 
 
webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/e4-S5Ut5JuM:APA91bFCr7cttBK2zdbxUOE-b3aK-zNi2VM2GOBbNk-Ya1U72oAW7fqwvpsP7zAgxK6d5PTHyWwD_1KWD1gnyoF-JmeFlkfTB21QQCo9EHRRayXR3evOolTkF_0EhnFEtCmLbl53Mmyn",
   "keys": {
       "p256dh": "BBy8FCOgmOlDZbi1Cxt+Mu1ceFbntnjjeoEDR+OJalWa5GCEI6j4UBCXzvlzK7tfLqF7I7hZqzhAZhvLnfBfFjw=",
       "auth": "WsAO3Xs2S95YvHyPPHjaHQ=="
   }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
 
var options = {
   gcmAPIKey: '683578040761',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);