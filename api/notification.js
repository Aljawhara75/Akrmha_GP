import axios from "axios";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../components/firebase";

export const sendNotification = async (FCMToken, title, message, userId) => {
    const body = {
      to: FCMToken,
      data: {
        experienceId: "aneestechtimize/akrmha",
        scopeKey: "aneestechtimize/akrmha",
        body: message,
        title: title
      },
      priority: "normal"
    };

    const headers = {
      'Authorization': `key=AAAAnXC-vnw:APA91bHSZHKHRr5CwFBYUl_z4WnLsKb_dosJwoVGl0hiMtxWbGlVm5MQBV325FDxhhMPYb5JiDmU4DXo2vLuJeDaYjmNHdFSWa1u0Iz8wkATKJL3q_jQp1wgWw9eAvnVDgj1lvF1VrZA`,
      'Content-Type': 'application/json'
    };

    await axios.post('https://fcm.googleapis.com/fcm/send', body, { headers })
      .then( async () => { 
        const res = await addDoc(collection(db, "userNotification"), {
          id: "tableId",
          body: message,
          title: title,
          userId,  
      });
      const docRef = doc(db, "userNotification", res._key.path.segments[1]);
      await updateDoc(docRef, { id: res._key.path.segments[1]});
    
    })
      .catch(error => {
        console.error('Error:', error);
      });
}