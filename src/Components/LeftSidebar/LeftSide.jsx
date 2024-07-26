import React, { useContext, useState, useEffect } from "react";
import nature from "../../assets/images/nature.jpg";
import { Tooltip, Button, Textarea } from "@material-tailwind/react";
import { Avatar } from "@material-tailwind/react";
import avatar from "../../assets/images/avatar.jpg";
import { AuthContext } from "../AppContext/AppContext";
import { db, storage } from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const LeftSide = () => {
  const { user } = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    backgroundImage: "",
    profileImage: "",
    about: "",
  });
  const [selectedFiles, setSelectedFiles] = useState({
    backgroundImage: "",
    profileImage: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const userDoc = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          setFormData(docSnap.data());
        }
      }
    };
    fetchUserProfile();
  }, [user]);

  const handleChange = async (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setSelectedFiles((prev) => ({
        ...prev,
        [name]: file.name,
      }));
      const fileRef = ref(storage, `profile/${user.uid}/${name}`);
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);
      setFormData((prev) => ({
        ...prev,
        [name]: fileUrl,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      await setDoc(doc(db, "users", user.uid), formData);
      setShowForm(false);
      window.location.reload(); // Reload the webpage
    }
  };

  useEffect(() => {
    if (showForm) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [showForm]);

  return (
    <div className="flex flex-col h-screen bg-white pb-4 border-2 rounded-r-xl shadow-lg">
      <div className="flex flex-col items-center relative">
        <img
          className="h-28 w-full rounded-r-xl object-cover"
          src={formData.backgroundImage || nature}
          alt="nature"
        />
        <div className="absolute -bottom-4">
          <Tooltip content="Profile" placement="top">
            <Avatar
              size="md"
              src={formData.profileImage || avatar}
              alt="avatar"
              className="border-2 border-white shadow-md"
            />
          </Tooltip>
        </div>
      </div>
      <div className="flex flex-col items-center pt-6">
        <p className="font-roboto font-medium text-md text-gray-700 tracking-normal leading-none">
          {user?.email}
        </p>
        <Button
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? "Cancel" : "Update Profile"}
        </Button>
      </div>
      {showForm && (
        <div className="mt-4 p-6 space-y-6 overflow-auto max-h-[calc(100vh-200px)]">
          <form
            className="flex flex-col space-y-6 bg-gray-100 p-6 rounded-lg shadow-lg max-w-md mx-auto"
            onSubmit={handleSubmit}
          >
            <div className="relative bg-white border-2 border-gray-300 rounded-lg p-4 shadow-md">
              <label className="block mb-2 text-sm font-medium text-gray-700">Background Image</label>
              <input
                type="file"
                name="backgroundImage"
                onChange={handleChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="flex items-center space-x-2 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                <span className="text-gray-500">{selectedFiles.backgroundImage || "Background Image"}</span>
              </div>
            </div>
            <div className="relative bg-white border-2 border-gray-300 rounded-lg p-4 shadow-md">
              <label className="block mb-2 text-sm font-medium text-gray-700">Profile Image</label>
              <input
                type="file"
                name="profileImage"
                onChange={handleChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="flex items-center space-x-2 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                <span className="text-gray-500">{selectedFiles.profileImage || "Profile Image"}</span>
              </div>
            </div>
            <div className="relative bg-white border-2 border-gray-300 rounded-lg p-4 shadow-md">
              <label className="block mb-2 text-sm font-medium text-gray-700">About</label>
              <div className="w-full">
                <Textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  rows="4"
                  className="border border-gray-300 rounded-lg p-2 bg-white shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 py-2"
            >
              Save
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LeftSide;
