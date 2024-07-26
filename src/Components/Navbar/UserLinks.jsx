import React, { useContext, useEffect, useState } from "react";
import { Tooltip } from "@material-tailwind/react";
import { Avatar } from "@material-tailwind/react";
import avatar from "../../assets/images/avatar.jpg";
import { AuthContext } from "../AppContext/AppContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const UserLinks = () => {
  const { signOutUser, user, userData } = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState(userData?.profileImage || user?.photoURL);

  useEffect(() => {
    const fetchUserProfileImage = async () => {
      if (user) {
        const userDoc = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setProfileImage(userData.profileImage);
        }
      }
    };
    fetchUserProfileImage();
  }, [user]);

  return (
    <div className="flex justify-center items-center cursor-pointer">
      <div className="mx-4 flex items-center" onClick={signOutUser}>
        <Tooltip content="Sign Out" placement="bottom">
          <div className="flex items-center rounded-full p-2 bg-gray-200 hover:bg-gray-300 duration-300 ease-in-out">
            <Avatar
              src={profileImage || avatar}
              size="sm"
              alt="avatar"
              className="rounded-full"
            />
            <p className="ml-4 font-roboto text-sm text-black font-medium no-underline">
              {user?.displayName === null && userData?.name !== undefined
                ? userData?.name?.charAt(0)?.toUpperCase() +
                  userData?.name?.slice(1)
                : user?.displayName?.split(" ")[0]}
            </p>
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default UserLinks;