import React, { useContext, useRef, useReducer, useEffect, useState } from "react";
import { Avatar } from "@material-tailwind/react";
import avatar from "../../assets/images/avatar.jpg";
import { AuthContext } from "../AppContext/AppContext";
import {
  setDoc,
  collection,
  doc,
  serverTimestamp,
  orderBy,
  query,
  onSnapshot,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import {
  PostsReducer,
  postActions,
  postsStates,
} from "../AppContext/PostReducer";
import Comment from "./Comment";

const CommentSection = ({ postId }) => {
  const comment = useRef("");
  const { user, userData } = useContext(AuthContext);
  const [state, dispatch] = useReducer(PostsReducer, postsStates);
  const [postOwnerId, setPostOwnerId] = useState(null);
  const [profileImage, setProfileImage] = useState(userData?.profileImage || user?.photoURL);

  const { ADD_COMMENT, HANDLE_ERROR } = postActions;

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

  const addComment = async (e) => {
    e.preventDefault();
    if (comment.current.value !== "") {
      try {
        const newCommentRef = doc(collection(db, "posts", postId, "comments"));
        await setDoc(newCommentRef, {
          id: newCommentRef.id,
          comment: comment.current.value,
          image: profileImage || avatar,
          name:
            userData?.name?.charAt(0)?.toUpperCase() +
              userData?.name?.slice(1) || user?.displayName?.split(" ")[0],
          timestamp: serverTimestamp(),
          userId: user?.uid,
        });
        comment.current.value = "";
      } catch (err) {
        dispatch({ type: HANDLE_ERROR });
        alert(err.message);
        console.log(err.message);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const commentRef = doc(db, "posts", postId, "comments", commentId);
      const commentDoc = await getDoc(commentRef);

      if (commentDoc.exists()) {
        const commentData = commentDoc.data();
        if (commentData.userId === user?.uid || user?.uid === postOwnerId) {
          await deleteDoc(commentRef);
        } else {
          alert("You can only delete your own comments or if you're the post owner!");
        }
      }
    } catch (err) {
      dispatch({ type: HANDLE_ERROR });
      alert(err.message);
      console.log(err.message);
    }
  };

  useEffect(() => {
    const getCommentsAndPostOwner = async () => {
      try {
        const postRef = doc(db, "posts", postId);
        const postDoc = await getDoc(postRef);
        if (postDoc.exists()) {
          setPostOwnerId(postDoc.data().uid);
        }

        const collectionOfComments = collection(db, `posts/${postId}/comments`);
        const q = query(collectionOfComments, orderBy("timestamp", "desc"));
        await onSnapshot(q, (snapshot) => {
          dispatch({
            type: ADD_COMMENT,
            comments: snapshot.docs.map((doc) => doc.data()),
          });
        });
      } catch (err) {
        dispatch({ type: HANDLE_ERROR });
        alert(err.message);
        console.log(err.message);
      }
    };
    getCommentsAndPostOwner();
  }, [postId, ADD_COMMENT, HANDLE_ERROR]);

  return (
    <div className="flex flex-col bg-white w-full py-2 rounded-b-3xl">
      <div className="flex items-center">
        <div className="mx-2">
          <Avatar
            size="sm"
            variant="circular"
            src={profileImage || avatar}
          ></Avatar>
        </div>
        <div className="w-full pr-2">
          <form className="flex items-center w-full" onSubmit={addComment}>
            <input
              name="comment"
              type="text"
              placeholder="Write a comment..."
              className="w-full rounded-2xl outline-none border-0 p-2 bg-gray-100"
              ref={comment}
            ></input>
            <button className="hidden" type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
      {state?.comments?.map((comment) => (
        <Comment
          key={comment.id}
          image={comment?.image}
          name={comment?.name}
          comment={comment?.comment}
          onDeleteComment={handleDeleteComment}
          commentId={comment.id}
        />
      ))}
    </div>
  );
};

export default CommentSection;
