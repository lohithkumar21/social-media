import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../AppContext/AppContext";
import { Link } from "react-router-dom";
import { Avatar } from "@material-tailwind/react";
import avatar from "../../assets/images/avatar.jpg";
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  arrayRemove,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const RightSide = () => {
  const [input, setInput] = useState("");
  const [userProfiles, setUserProfiles] = useState({});
  const { user, userData } = useContext(AuthContext);
  const friendList = userData?.friends || []; // Ensure friendList is an array

  useEffect(() => {
    const fetchUserProfiles = async () => {
      const profiles = {};
      for (const friend of friendList) {
        try {
          const userDoc = doc(db, "users", friend.id);
          const docSnap = await getDoc(userDoc);
          if (docSnap.exists()) {
            profiles[friend.id] = docSnap.data();
          }
        } catch (error) {
          console.error(`Error fetching profile for ${friend.id}:`, error);
        }
      }
      setUserProfiles(profiles);
    };

    if (friendList.length > 0) {
      fetchUserProfiles();
    }
  }, [friendList]);

  const searchFriends = (data) => {
    return data.filter((item) =>
      item["name"].toLowerCase().includes(input.toLowerCase())
    );
  };

  const removeFriend = async (id, name, image) => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const getDoc = await getDocs(q);
      const userDocumentId = getDoc.docs[0].id;

      // Update the current user's document to remove the friend
      await updateDoc(doc(db, "users", userDocumentId), {
        friends: arrayRemove({ id, name, image }),
      });
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white shadow-lg border-2 rounded-l-xl">
      <div className="mx-2 mt-10">
        <p className="font-roboto font-medium text-sm text-gray-700 no-underline tracking-normal leading-none">
          Friends:
        </p>
        <input
          className="border-0 outline-none mt-4"
          name="input"
          value={input}
          type="text"
          placeholder="Search friends"
          onChange={(e) => setInput(e.target.value)}
        />
        {friendList.length > 0 && (
          searchFriends(friendList).map((friend) => (
            <div
              className="flex items-center justify-between hover:bg-gray-100 duration-300 ease-in-out"
              key={friend.id}
            >
              <Link to={`/profile/${friend.id}`}>
                <div className="flex items-center my-2 cursor-pointer">
                  <Avatar
                    size="sm"
                    variant="circular"
                    src={userProfiles[friend.id]?.profileImage || avatar}
                    alt="avatar"
                  />
                  <p className="ml-4 font-roboto font-medium text-sm text-gray-700 no-underline tracking-normal leading-none">
                    {userProfiles[friend.id]?.name || friend.name}
                  </p>
                </div>
              </Link>
              <div className="mr-4 cursor-pointer" onClick={() => removeFriend(friend.id, friend.name, friend.image)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                  />
                </svg>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RightSide;
