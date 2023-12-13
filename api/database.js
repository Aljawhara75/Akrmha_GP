import { collection, getDocs, query, where, or } from "firebase/firestore";
import { db } from "../components/firebase";

const userRef = collection(db, "users");
const foodRef = collection(db, "AddFood");
const orderRef = collection(db, "OrderFood");
const chatRoomRef = collection(db, "chatRoom");
const chatRef = collection(db, "chats");
const ratingRef = collection(db, "UserRating");
const notificationRef = collection(db, "userNotification");

export const getFood = async () => {
  const q = query(foodRef);
  const querySnapshot = await getDocs(q);

  // check if user exist
  if (querySnapshot.empty) {
    console.log("No matching documents.");
    return {
      success: true,
      found: false,
      data: null,
    };
  } else {
    const data = querySnapshot.docs.map((doc) => doc.data());
    return {
      success: true,
      found: true,
      data: data,
    };
  }
};

export const getFoodBySearch = async (type) => {
  console.log({ type });
  const q = query(foodRef, where("title", "==", type));
  const querySnapshot = await getDocs(q);

  // check if user exist
  if (querySnapshot.empty) {
    console.log("No matching documents.");
    return {
      success: true,
      found: false,
      data: null,
    };
  } else {
    const data = querySnapshot.docs.map((doc) => doc.data());
    return {
      success: true,
      found: true,
      data: data,
    };
  }
};

export const getFoodByType = async (type) => {
  const q = query(foodRef, where("type", "==", type));
  const querySnapshot = await getDocs(q);

  // check if user exist
  if (querySnapshot.empty) {
    console.log("No matching documents.");
    return {
      success: true,
      found: false,
      data: null,
    };
  } else {
    const data = querySnapshot.docs.map((doc) => doc.data());
    return {
      success: true,
      found: true,
      data: data,
    };
  }
};

export const getFoodByUserId = async (userId) => {
  const q = query(foodRef, where("userId", "==", userId,));
  const querySnapshot = await getDocs(q);

  // check if user exist
  if (querySnapshot.empty) {
    console.log("No matching documents.");
    return {
      success: true,
      found: false,
      data: null,
    };
  } else {
    const data = querySnapshot.docs.map((doc) => doc.data());
    return {
      success: true,
      found: true,
      data: data,
    };
  }
};

export const getFoodByOwnerId = async (userId) => {
  const q = query(foodRef, where("userId", "==", userId,));
  const querySnapshot = await getDocs(q);

  // check if user exist
  if (querySnapshot.empty) {
    console.log("No matching documents.");
    return {
      success: true,
      found: false,
      data: null,
    };
  } else {
    const data = querySnapshot.docs.map((doc) => doc.data());
    return {
      success: true,
      found: true,
      data: data,
    };
  }
};

export const getAllOrder = async (userId) => {
  const q = query(
    orderRef,
    where("customerUserId", "==", userId),
  );
  const querySnapshot = await getDocs(q);

  // check if user exist
  if (querySnapshot.empty) {
    console.log("No matching documents.");
    return {
      success: true,
      found: false,
      data: null,
    };
  } else {
    const data = querySnapshot.docs.map((doc) => doc.data());
    return {
      success: true,
      found: true,
      data: data,
    };
  }
};

export const getAllOrderOfFood = async (foodId) => {
  const q = query(orderRef, where("foodId", "==", foodId));
  const querySnapshot = await getDocs(q);

  // check if user exist
  if (querySnapshot.empty) {
    console.log("No matching documents.");
    return {
      success: true,
      found: false,
      data: null,
    };
  } else {
    const data = querySnapshot.docs.map((doc) => doc.data());
    return {
      success: true,
      found: true,
      data: data,
    };
  }
};

export const getAllOrderOfFoodPending = async (foodId) => {
  if (!foodId) {
    console.log("Invalid foodId provided.");
    return {
      success: false,
      error: "Invalid foodId provided",
    };
  }

  const q = query(
    orderRef,
    where("foodId", "==", foodId),
    where("orderState", "==", "pending")
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    console.log("No matching documents.");
    return {
      success: true,
      found: false,
      data: null,
    };
  } else {
    const data = querySnapshot.docs.map((doc) => doc.data());
    return {
      success: true,
      found: true,
      data: data,
    };
  }
};

export const getFoodDetails = async (id) => {
  const q = query(foodRef, where("id", "==", id));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    console.log("No matching documents.");
    return {
      success: true,
      found: false,
      data: null,
    };
  }
  // if exist multiple documents
  else if (querySnapshot.size > 1) {
    console.log("Multiple matching documents.");
    throw "Multiple matching documents.";
  }

  // if exist one document
  else {
    const data = querySnapshot.docs.map((doc) => doc.data());
    return {
      success: true,
      found: true,
      data: data[0],
    };
  }
};

export const getUserById = async (id) => {
  const q = query(userRef, where("id", "==", id));
  const querySnapshot = await getDocs(q);
  // check if user exist
  if (querySnapshot.empty) {

    console.log("No matching documents. userid");
    return {
      success: true,
      found: false,
      data: null,
    };
  }
  // if exist multiple documents
  else if (querySnapshot.size > 1) {
    console.log("Multiple matching documents.");
    throw "Multiple matching documents.";
  }

  // if exist one document
  else {
    const data = querySnapshot.docs.map((doc) => doc.data());
    return {
      success: true,
      found: true,
      data: data[0],
    };
  }
};

export const getUserByName = async (name) => {
  console.log("calling: ", name)
  const q = query(userRef, where("username", "==", name));
  const querySnapshot = await getDocs(q);
  // check if user exist
  if (querySnapshot.empty) {

    console.log("No matching documents. userid");
    return {
      success: true,
      found: false,
      data: null,
    };
  }
  else {
    const data = querySnapshot.docs.map((doc) => doc.data());
    return {
      success: true,
      found: true,
      data: data,
    };
  }
};

// get user
export const getUser = async (phoneNumber) => {
  // get user by phoneNumber
  const q = query(userRef, where("mobileNum", "==", phoneNumber));
  const querySnapshot = await getDocs(q);

  // check if user exist
  if (querySnapshot.empty) {
    console.log("No matching documents.");
    return {
      success: true,
      found: false,
      data: null,
    };
  }
  // if exist multiple documents
  else if (querySnapshot.size > 1) {
    console.log("Multiple matching documents.");
    throw "Multiple matching documents.";
  }

  // if exist one document
  else {
    const data = querySnapshot.docs.map((doc) => doc.data());
    return {
      success: true,
      found: true,
      data: data[0],
    };
  }
};

export const getAllUser = async () => {

  const q = query(userRef);
  const querySnapshot = await getDocs(q);

  // check if user exist
  if (querySnapshot.empty) {
    console.log("No matching documents.");
    return {
      success: true,
      found: false,
      data: null,
    };
  }
  // if exist one document
  else {
    const data = querySnapshot.docs.map((doc) => doc.data());
    return {
      success: true,
      found: true,
      data: data,
    };
  }
};

export const getUserWithPhoneAndUser = async (phoneNumber, username) => {
  console.log(`getUserWithPhoneAndUser`, phoneNumber, "-", username);

  // get user by phoneNumber
  const qMobile = query(userRef, where("mobileNum", "==", phoneNumber));
  const qUsername = query(
    userRef,
    where("username", "==", username.toLowerCase())
  );

  const queryMobileSnapshot = await getDocs(qMobile);
  const queryUsernameSnapshot = await getDocs(qUsername);

  // check if user exist
  if (queryMobileSnapshot.empty && queryUsernameSnapshot.empty) {
    console.log("No matching documents.");
    return {
      success: true,
      found: false,
      data: null,
    };
  }

  // if exist one document
  else {
    const mobileData = queryMobileSnapshot.docs.map((doc) => doc.data());
    console.log(`mobileData`, mobileData);
    const usernameData = queryUsernameSnapshot.docs.map((doc) => doc.data());
    console.log(`usernameData`, usernameData);

    let errors = {
      phone: "",
      username: "",
    };

    const isMobile = mobileData && mobileData[0]?.mobileNum == phoneNumber;
    console.log(`isMobile`, isMobile);
    const isUsername =
      usernameData &&
      usernameData[0]?.username?.toLowerCase() == username.toLowerCase();
    console.log(`isUsername`, isUsername);

    // console.log(`datas`, data)
    // console.log(`isMobile`, isMobile)
    // console.log(`isUsername`, isUsername)

    // check if phone number is same
    if (isMobile) {
      errors.phone = "هذا الرقم مسجل بالفعل لحساب آخر";
    }

    // check if user is same
    if (isUsername) {
      errors.username = "هذا الاسم مسجل بالفعل لحساب آخر";
    }

    return {
      success: true,
      found: true,
      errors,
    };
  }
};

export const getChatRoom = async (user) => {
  // get user by phoneNumber
  const q = query(chatRoomRef, where("user", "==", user));
  const querySnapshot = await getDocs(q);

  // check if user exist
  if (querySnapshot.empty) {
    console.log("No matching documents.");
    return {
      success: true,
      found: false,
      data: null,
    };
  } else {
    const data = querySnapshot.docs.map((doc) => doc.data());
    return {
      success: true,
      found: true,
      data: data[0],
    };
  }
};

export const getUserChat = async (chatRoomId) => {
  const q = query(chatRef, where("chatRoomId", "==", chatRoomId));
  const querySnapshot = await getDocs(q);

  // check if user exist
  if (querySnapshot.empty) {
    console.log("No matching documents.");
    return {
      success: true,
      found: false,
      data: null,
    };
  } else {
    const data = querySnapshot.docs.map((doc) => doc.data());
    return {
      success: true,
      found: true,
      data: data,
    };
  }
};

export const getRatingByOrderId = async (orderId, ratingGiverId) => {
  if (orderId && ratingGiverId) {
    const q = query(
      ratingRef,
      where("orderId", "==", orderId),
      where("ratingGiverId", "==", ratingGiverId)
    );
    const querySnapshot = await getDocs(q);
    // check if user exist
    if (querySnapshot.empty) {
      console.log("No matching documents.");
      return {
        success: true,
        found: false,
        data: null,
      };
    } else {
      const data = querySnapshot.docs.map((doc) => doc.data());
      return {
        success: true,
        found: true,
        data: data[0],
      };
    }
  }
};

export const getUserOrderRating = async (ownerId) => {
  const q = query(ratingRef, where("ratingAccepterId", "==", ownerId));
  const querySnapshot = await getDocs(q);

  // check if user exist
  if (querySnapshot.empty) {
    console.log("No matching documents.");
    return {
      success: true,
      found: false,
      data: null,
    };
  } else {
    const data = querySnapshot.docs.map((doc) => doc.data());
    return {
      success: true,
      found: true,
      data: data,
    };
  }
}

export const getUserNotifications = async (userId) => {
  const q = query(notificationRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  // check if user exist
  if (querySnapshot.empty) {
    console.log("No matching documents.");
    return {
      success: true,
      found: false,
      data: null,
    };
  } else {
    const data = querySnapshot.docs.map((doc) => doc.data());
    return {
      success: true,
      found: true,
      data: data,
    };
  }
}
