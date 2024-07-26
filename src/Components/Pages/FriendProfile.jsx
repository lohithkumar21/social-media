import React, { useState, useEffect } from "react";
import LeftSide from "../LeftSidebar/LeftSide";
import Navbar from "../Navbar/Navbar";
import RightSide from "../RightSidebar/RightSide";
import Main from "../Main/Main";
import { Avatar } from "@material-tailwind/react";
import avatar from "../../assets/images/avatar.jpg";
import backgroundImage from "../../assets/images/profilePic.jpg";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useParams } from "react-router-dom";
import { collection, where, query, onSnapshot } from "firebase/firestore";

const FriendProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    const getUserProfile = async () => {
      const q = query(collection(db, "users"), where("uid", "==", id));
      await onSnapshot(q, (doc) => {
        setUserDetail(doc.docs[0].data());
      });
    };
    getUserProfile();
  }, [id]);
  console.log(userDetail);

  const fetchUserProfile = async (uid) => {
    try {
      const userDoc = doc(db, "users", uid);
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.error("No user profile found for the given ID.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  useEffect(() => {
    const getUserProfile = async () => {
      const data = await fetchUserProfile(id);
      if (data) {
        setProfile(data);
      } else {
        setProfile({
          backgroundImage,
          profileImage: avatar,
          email: "No email available",
          name: "No name available",
          about: "No information available",
        });
      }
    };

    getUserProfile();
  }, [id]);

  return (
    <div className="w-full">
      <div className="fixed top-0 z-10 w-full bg-white">
        <Navbar />
      </div>
      <div className="flex bg-gray-100">
        <div className="flex-auto w-[20%] fixed top-12">
          <LeftSide />
        </div>
        <div className="flex-auto w-[60%] absolute left-[20%] top-14 bg-gray-100 rounded-xl">
          <div className="w-[80%] mx-auto">
            <div>
              <div className="relative py-4">
                <img
                  className="h-96 w-full rounded-md"
                  src={profile?.backgroundImage || backgroundImage}
                  alt="backgroundImage"
                />
                <div className="absolute bottom-10 left-6">
                  <Avatar
                    size="xl"
                    variant="circular"
                    src={profile?.profileImage || avatar}
                    alt="avatar"
                  />
                  <p className="py-2 font-roboto font-medium text-sm text-white no-underline tracking-normal leading-none">
                    {userDetail?.email}
                  </p>
                  <p className="py-2 font-roboto font-medium text-sm text-white no-underline tracking-normal leading-none">
                    {userDetail?.name}
                  </p>
                  <span className="py-2 font-roboto font-medium text-sm text-white no-underline tracking-normal leading-none">
                    {profile?.about}
                  </span>
                </div>
              </div>
            </div>
            <Main />
          </div>
        </div>
        <div className="flex-auto w-[20%] fixed right-0 top-12">
          <RightSide />
        </div>
      </div>
    </div>
  );
};

export default FriendProfile;
