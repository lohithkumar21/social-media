import React, { useState, useRef, useContext, useReducer, useEffect } from "react";
import { Avatar, Button, Alert } from "@material-tailwind/react";
import avatar from "../../assets/images/avatar.jpg";
import { AuthContext } from "../AppContext/AppContext";
import {
  doc,
  setDoc,
  collection,
  serverTimestamp,
  query,
  orderBy,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import {
  PostsReducer,
  postActions,
  postsStates,
} from "../AppContext/PostReducer";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import PostCard from "./PostCard";

// SVG Icons
const AddImageIcon = () => (
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
      d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5"
    />
  </svg>
);

const ShareIcon = () => (
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
      d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
    />
  </svg>
);

const Main = () => {
  const { user, userData } = useContext(AuthContext);
  const text = useRef("");
  const scrollRef = useRef("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [file, setFile] = useState(null);
  const collectionRef = collection(db, "posts");
  const postRef = doc(collection(db, "posts"));
  const document = postRef.id;
  const [state, dispatch] = useReducer(PostsReducer, postsStates);
  const { SUBMIT_POST, HANDLE_ERROR } = postActions;
  const [progressBar, setProgressBar] = useState(0);
  const [formData, setFormData] = useState({
    backgroundImage: "",
    profileImage: "",
    about: "",
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

  const handleUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (text.current.value !== "") {
      try {
        await setDoc(postRef, {
          documentId: document,
          uid: user?.uid || userData?.uid,
          logo: user?.photoURL || formData.profileImage,
          name: user?.displayName || userData?.name,
          email: user?.email || userData?.email,
          text: text.current.value,
          image: image,
          video: video,
          timestamp: serverTimestamp(),
        });
        text.current.value = "";
        setImage(null);
        setVideo(null);
      } catch (err) {
        dispatch({ type: HANDLE_ERROR });
        alert(err.message);
        console.log(err.message);
      }
    } else {
      dispatch({ type: HANDLE_ERROR });
    }
  };

  const storage = getStorage();

  const metadata = {
    imageContentType: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/svg+xml",
    ],
    videoContentType: [
      "video/mp4",
      "video/ogg",
      "video/webm",
    ],
  };

  const submitMedia = async () => {
    if (!file) return;

    const fileType = metadata.imageContentType.includes(file["type"]) 
                      ? 'image'
                      : metadata.videoContentType.includes(file["type"]) 
                      ? 'video'
                      : null;

    if (fileType) {
      try {
        const storageRef = ref(storage, `media/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file, { contentType: file["type"] });

        await uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgressBar(progress);
          },
          (error) => {
            alert(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            if (fileType === 'image') {
              setImage(downloadURL);
            } else if (fileType === 'video') {
              setVideo(downloadURL);
            }
          }
        );
      } catch (err) {
        dispatch({ type: HANDLE_ERROR });
        alert(err.message);
        console.log(err.message);
      }
    }
  };

  useEffect(() => {
    const postData = async () => {
      const q = query(collectionRef, orderBy("timestamp", "asc"));
      await onSnapshot(q, (doc) => {
        dispatch({
          type: SUBMIT_POST,
          posts: doc?.docs?.map((item) => item?.data()),
        });
        scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
        setImage(null);
        setVideo(null);
        setFile(null);
        setProgressBar(0);
      });
    };
    return () => postData();
  }, [SUBMIT_POST]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col py-4 w-full bg-white rounded-3xl shadow-lg">
        <div className="flex items-center border-b-2 border-gray-300 pb-4 pl-4 w-full">
          <Avatar
            size="sm"
            variant="circular"
            src={formData.profileImage || user?.photoURL || avatar}
            alt="avatar"
          />
          <form className="w-full" onSubmit={handleSubmitPost}>
            <div className="flex justify-between items-center">
              <div className="w-full ml-4">
                <input
                  type="text"
                  name="text"
                  placeholder={`Inspire others with your thoughts!, ${
                    user?.displayName?.split(" ")[0] ||
                    userData?.name?.charAt(0).toUpperCase() +
                      userData?.name?.slice(1)
                  }`}
                  className="outline-none w-full bg-white rounded-md"
                  ref={text}
                />
              </div>
              <div className="mx-4">
                {image && <img className="h-24 rounded-xl" src={image} alt="previewImage" />}
                {video && (
                  <video className="h-24 w-full" controls>
                    <source src={video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              <div className="mr-4 flex items-center">
                <Button
                  variant="text"
                  type="submit"
                  className="flex items-center"
                >
                  <ShareIcon />
                  <span className="ml-2"></span>
                </Button>
              </div>
            </div>
          </form>
        </div>
        <span
          style={{ width: `${progressBar}%` }}
          className="bg-blue-700 py-1 rounded-md"
        ></span>
        <div className="flex justify-around items-center pt-4">
          <div className="flex items-center">
            <label
              htmlFor="addMedia"
              className="cursor-pointer flex items-center"
            >
              <AddImageIcon className="h-10 mr-4" />
              <input
                id="addMedia"
                type="file"
                style={{ display: "none" }}
                onChange={handleUpload}
              />
            </label>
            {file && (
              <Button variant="text" onClick={submitMedia}>
                Upload
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col py-4 w-full">
        {state?.error ? (
          <div className="flex justify-center items-center">
            <Alert color="red">
              Something went wrong. Refresh and try again...
            </Alert>
          </div>
        ) : (
          <div>
            {state?.posts?.length > 0 &&
              state?.posts?.map((post, index) => (
                <PostCard
                  key={index}
                  logo={post?.logo}
                  id={post?.documentId}
                  uid={post?.uid}
                  name={post?.name}
                  email={post?.email}
                  image={post?.image}
                  video={post?.video}
                  text={post?.text}
                  timestamp={new Date(post?.timestamp?.toDate())?.toUTCString()}
                />
              ))}
          </div>
        )}
      </div>
      <div ref={scrollRef} />
    </div>
  );
};

export default Main;
