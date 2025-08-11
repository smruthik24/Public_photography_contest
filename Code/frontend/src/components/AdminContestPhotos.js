import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import axios from "axios";

const AdminContestPhotos = ({ contest, show, onHide }) => {
  const [photos, setPhotos] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  useEffect(() => {
    if (contest) {
      fetchPhotos();
    }
  }, [contest]);

  const fetchPhotos = async () => {
    try {
      setLoadingPhotos(true);

      const photosResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/photos/fetch`,
        {
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY,
          },
          withCredentials: true,
        }
      );
      const filteredPhotos = photosResponse.data.filter(
        (photo) => photo.contest_title === contest.title
      );
      setPhotos(filteredPhotos);
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoadingPhotos(false);
    }
  };

  const handleDeletePhoto = async (photo) => {
    try {
      setLoadingDelete(true);

      // Deleting the photo
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/photos/delete`, {
        data: {
          contest_title: contest.title,
          email: photo.email,
        },
        headers: {
          "x-api-key": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
      });
      console.log("DELETED PHOTO");

      // Deleting associated votes for the photo
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/votes/deleteimage`,
        {
          data: {
            photo_url: photo.photo_url,
          },
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY,
          },
          withCredentials: true,
        }
      );
      console.log("DELETED VOTES ON THAT PHOTO");

      // Refresh photos after deletion
      fetchPhotos();
      setSuccessMessage("Photo and associated votes deleted successfully!");
      setErrorMessage("");
    } catch (error) {
      console.error("Error deleting photo or associated votes:", error);
      setErrorMessage("Failed to delete photo or associated votes.");
      setSuccessMessage("");
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Photos for Contest: {contest.title}</Modal.Title>
      </Modal.Header>
      {successMessage && (
        <div
          className="alert alert-success d-flex align-items-center"
          role="alert"
        >
          <i className="bi bi-check-circle-fill me-2"></i>
          <div>{successMessage}</div>
        </div>
      )}

      {errorMessage && (
        <div
          className="alert alert-danger d-flex align-items-center"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <div>{errorMessage}</div>
        </div>
      )}

      <Modal.Body>
        {loadingPhotos ? (
          <div className="text-center">
            <Spinner animation="border" role="status" className="mb-2">
              <span className="sr-only"></span>
            </Spinner>
            <div>Loading photos...</div>
          </div>
        ) : (
          <>
            {photos.length > 0 ? (
              <div className="row">
                {photos.map((photo) => (
                  <div className="col-md-4 mb-4" key={photo._id}>
                    <div className="card">
                      <img
                        src={photo.photo_url}
                        className="card-img-top"
                        alt="Contest Photo"
                      />
                      <div className="card-body">
                        <p>Uploaded by: {photo.uploaded_by}</p>
                        {loadingDelete ? (
                          <div className="text-center">
                            <Spinner
                              animation="border"
                              size="sm"
                              role="status"
                              className="mb-2"
                            >
                              <span className="sr-only"></span>
                            </Spinner>
                            <div>Deleting...</div>
                          </div>
                        ) : (
                          <Button
                            variant="danger"
                            onClick={() => handleDeletePhoto(photo)}
                          >
                            Reject
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No photos available for this contest.</p>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AdminContestPhotos;
