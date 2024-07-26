// src/utils/fetchPostData.js

import { collection, query, orderBy, limit, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../Components/firebase/firebase"; // Adjust the path as needed
import avatar from "../assets/images/avatar.jpg"; // Default image

const fetchPostData = async () => {
  try {
    // Create a query to fetch the latest 5 posts, ordered by timestamp
    const q = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc"),
      limit(5)
    );

    // Fetch the documents from the query
    const querySnapshot = await getDocs(q);

    // Map over the documents to process each one
    const postPromises = querySnapshot.docs.map(async (postDoc) => {
      const postData = postDoc.data();

      // Fetch the associated user document
      const userDoc = await getDoc(doc(db, "users", postData.uid));

      // Print post and user data for debugging
      console.log(`Post ID: ${postDoc.id}`);
      console.log('Post Data:', postData);

      if (userDoc.exists()) {
        console.log('User Data:', userDoc.data());
      } else {
        console.log('User Data: Document does not exist');
      }

      // Determine the user name and use the default image if none is provided
      const userName = userDoc.exists() ? userDoc.data().name : "Unknown";

      return {
        id: postDoc.id,
        name: userName,
        image: postData.image || avatar,
        // Add any other fields you want to log or include
        ...postData,  // Spread the post data to include other fields
      };
    });

    // Wait for all promises to resolve
    return Promise.all(postPromises);
  } catch (error) {
    console.error("Error fetching posts: ", error);
    return [];
  }
};

export default fetchPostData;
