import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Typography } from "@mui/material";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import "./styles.css";
function UserPhotos() {
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState([]);
  const [comment, setComment] = useState([]);

  const { id } = useParams();
  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/photo/${id}`,
        );
        const response2 = await axios.get(
          `http://localhost:8081/api/user/${id}`,
        );
        setPhotos(response.data);
        setUser(response2.data);
      } catch (error) {
        console.error("Error fetching photo:", error);
      }
    };
    const interval = setInterval(() => {
      fetchPhoto();
    }, 2000);

    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 1500);
    }
  }, []);

  const handleComment = async (e) => {
    e.preventDefault();
    const photoId = e.target.elements.photo_id.value;
    const userId = e.target.elements.user_id.value;

    try {
      const response = await axios.post(
        "http://localhost:8081/api/write/comment",
        {
          photoId,
          comment,
        },
      );
      // window.location.reload();
      setComment("");
    } catch (err) {}
  };

  return (
    <div className="user-photos-container">
      <Typography variant="body1">User Photos:</Typography>
      {photos && user && photos.length > 0 ? ( // Kiểm tra nếu có dữ liệu trong `photos`
        photos.map((photo, index) => {
          if (!photo || !photo._id) {
            console.error("Photo is undefined or missing _id at index:", index);
            return null; // Trả về null để tránh lỗi
          }

          return (
            <div className="photo-item" id={photo._id} key={photo._id}>
              <img
                src={`${photo.file_name}`} // Cẩn thận với `require`
                alt={`Photo ${photo._id}`}
              />
              <div className="photo-info">
                <Typography variant="body1">
                  Date/Time: {photo.date_time}
                </Typography>
                <Typography variant="body1">Comments:</Typography>
                {photo.comments && photo.comments.length > 0 ? ( // Kiểm tra nếu `comments` có giá trị
                  photo.comments.map((comment, commentIndex) => {
                    if (!comment || !comment._id) {
                      console.error(
                        "Comment is undefined or missing _id at index:",
                        commentIndex,
                      );
                      return null; // Trả về null nếu có lỗi
                    }

                    return (
                      <div className="comment-item" key={comment._id}>
                        <Typography variant="body1">
                          {comment.date_time}
                        </Typography>
                        <Typography variant="body1" id={comment._id}>
                          {user.last_name}: {comment.comment}
                        </Typography>
                      </div>
                    );
                  })
                ) : (
                  <Typography variant="body1">No comments yet.</Typography>
                )}
                <>
                  <h3>Write your comment</h3>
                  <Form
                    onSubmit={handleComment}
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    <div
                      className="form-group"
                      style={{ width: "90%", marginRight: "5px" }}
                    >
                      <input
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        type="text"
                        className="form-control"
                        placeholder="Your comment"
                      />
                    </div>
                    <input type="hidden" name="photo_id" value={photo._id} />
                    <input type="hidden" name="user_id" value={user._id} />

                    <Button type="submit" variant="primary">
                      Ok
                    </Button>
                  </Form>
                </>
              </div>
            </div>
          );
        })
      ) : (
        <Typography variant="body1">No photos found for this user.</Typography>
      )}
    </div>
  );
}

export default UserPhotos;
