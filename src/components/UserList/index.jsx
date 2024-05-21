import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Typography, List, ListItem, ListItemText } from "@mui/material";
import axios from "axios";
import "./styles.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function UserList() {
  const [users, setUsers] = useState([]);
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState(null);
  const pollingInterval = 10000; // Thực hiện polling mỗi 10 giây

  useEffect(() => {
    const fetchUsersWithPhotoCount = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/user");
        const userList = response.data;

        // Lấy số lượng ảnh cho mỗi người dùng
        const promises = userList.map(async (user) => {
          const res = await axios.get(
            `http://localhost:8081/api/photo/getCountPT/${user._id}`
          );
          const countPT = res.data.count;
          const totalComments = res.data.totalComments;
          return { ...user, countPT: countPT, totalComments: totalComments };
        });

        const usersWithCounts = await Promise.all(promises);
        setUsers(usersWithCounts);
      } catch (error) {
        console.error("Error fetching users or photo counts:", error);
      }
    };

    fetchUsersWithPhotoCount();
    const interval = setInterval(() => {
      fetchUsersWithPhotoCount();
    }, pollingInterval);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setSelectedItem(location.pathname);
  }, [location]);

  const [modalShow1, setModalShow1] = React.useState(false);
  const [modalShow2, setModalShow2] = React.useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const openModal1 = (user) => {
    setSelectedUser(user);
    setModalShow1(true);
    document.body.style.overflow = "hidden";
  };

  const openModal2 = (user) => {
    setSelectedUser(user);
    setModalShow2(true);
    document.body.style.overflow = "hidden";
  };

  return (
    <div className="user-list-container">
      <Typography variant="h6" className="list-title">
        User List:
      </Typography>
      <List className="list">
        {users.map((user) => (
          <ListItem
            key={user._id}
            component={Link}
            to={`/users/${user._id}`}
            className={
              selectedItem === `/users/${user._id}`
                ? "list-item selected"
                : "list-item"
            }
          >
            <ListItemText primary={`${user.last_name}`} />
            {/* Biểu tượng đếm số lượng ảnh */}
            <Button
              variant="primary"
              className="count-button"
              onClick={() => openModal1(user)}
            >
              {user.countPT}
            </Button>
            {/* Biểu tượng đếm số lượng bình luận */}
            <Button
              variant="primary"
              className="count-button"
              onClick={() => openModal2(user)}
            >
              {user.totalComments}
            </Button>
          </ListItem>
        ))}
      </List>
      <>
        <MyVerticallyCenteredModal
          show={modalShow1}
          onHide={() => setModalShow1(false)}
          user={selectedUser}
        />
      </>

      <>
        <MyVerticallyCenteredModal2
          show={modalShow2}
          onHide={() => setModalShow2(false)}
          user={selectedUser}
        />
      </>
    </div>
  );
}

function MyVerticallyCenteredModal(props) {
  const { user } = props;
  const [photos, setPhotos] = useState([]);
  if (props.onHide) {
    document.body.style.overflow = "auto";
  }
  useEffect(() => {
    if (user) {
      const fetchPhoto = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8081/api/photo/${user._id}`
          );
          setPhotos(response.data);
        } catch (error) {
          console.error("Error fetching photo:", error);
        }
      };
      fetchPhoto();
    }
  }, [user]);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" className="modal-title">
          View Photo
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <List className="list">
          {photos && photos.length > 0 ? (
            photos.map((photo, index) => {
              if (!photo || !photo._id) {
                console.error("Photo is undefined or missing _id at index:", index);
                return null;
              }

              return (
                <Link
                  to={`/photos/${user._id}#${photo._id}`}
                  className="photo-link"
                  onClick={props.onHide}
                  key={photo._id}
                >
                  <div className="photo-item">
                    <img src={`${photo.file_name}`} alt={`Photo ${photo._id}`} />
                  </div>
                </Link>
              );
            })
          ) : (
            <Typography variant="body1">No photos found for this user.</Typography>
          )}
        </List>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function MyVerticallyCenteredModal2(props) {
  const { user } = props;
  const [photos, setPhotos] = useState([]);
  if (props.onHide) {
    document.body.style.overflow = "auto";
  }
  useEffect(() => {
    if (user) {
      const fetchPhoto = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8081/api/photo/${user._id}`
          );
          setPhotos(response.data);
        } catch (error) {
          console.error("Error fetching photo:", error);
        }
      };
      fetchPhoto();
    }
  }, [user]);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" className="modal-title">
          View Comments
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {photos && photos.length > 0 ? (
          photos.map((photo, index) => {
            if (!photo || !photo._id) {
              console.error("Photo is undefined or missing _id at index:", index);
              return null;
            }

            return (
              <div className="photo-item" key={photo._id}>
                <div className="photo-info">
                  {photo.comments &&
                    photo.comments.length > 0 &&
                    photo.comments.map((comment, commentIndex) => {
                      if (!comment || !comment._id) {
                        console.error("Comment is undefined or missing _id at index:", commentIndex);
                        return null;
                      }

                      return (
                        <Link
                          to={`/photos/${user._id}#${comment._id}`}
                          className="comment-link"
                          onClick={props.onHide}
                          key={comment._id}
                        >
                          <div className="comment-item">
                            <Typography variant="body1">{comment.date_time}</Typography>
                            <Typography variant="body1">{user.last_name}: {comment.comment}</Typography>
                          </div>
                        </Link>
                      );
                    })}
                </div>
              </div>
            );
          })
        ) : (
          <Typography variant="body1">No comments found for this user.</Typography>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UserList;
