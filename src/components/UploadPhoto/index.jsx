import React, { useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner"; // Để tạo hiệu ứng loading

const PhotoUploadForm = () => {
  const [photo, setPhoto] = useState(null);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Kiểm soát trạng thái tải
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (photo) {
      setIsLoading(true); // Bắt đầu hiển thị loading
      const formData = new FormData();
      formData.append("photo", photo);
      console.log(formData.photo);

      try {
        const token = localStorage.getItem("authToken");
        const authResponse = await axios.get(`http://localhost:8081/api/auth`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userId = authResponse.data.userId;
        formData.append("userId", userId);

        const response = await axios.post(
          "http://localhost:8081/api/upload/photo",
          formData,
        );
        setUploadResponse(response.data);
        setError(null);
        const confirmRedirect = window.confirm(
          "Upload successful! Do you want to view your photo?",
        );
        if (confirmRedirect) {
          navigate(`/photos/${userId}#${response.photo_id}`);
        }
      } catch (err) {
        setError(err.response?.data?.error || "Failed to upload photo.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Please select a photo before uploading.");
    }
  };

  return (
    <div className="photo-upload-form">
      <h1 className="text-center m-5">Upload Your Photo</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formFile" className="m-5">
          <Form.Control type="file" onChange={handleFileChange} />
        </Form.Group>
        <div className="text-center">
          <Button type="submit" variant="primary">
            Upload
          </Button>
        </div>
      </Form>
      {isLoading && (
        <div className="loading-overlay">
          {" "}
          {/* Hiển thị màn hình loading */}
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
      {uploadResponse && (
        <Alert variant="success">
          <h4>Upload Successful!</h4>
          <p>Uploaded Photo Link: {uploadResponse.path}</p>
        </Alert>
      )}
      {error && (
        <Alert variant="danger">
          <p>{error}</p>
        </Alert>
      )}
    </div>
  );
};

export default PhotoUploadForm;
