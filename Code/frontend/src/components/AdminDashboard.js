import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import AdminContestPhotos from "./AdminContestPhotos";
import { AdminAuthContext } from "../context/AdminAuthContext";

const AdminDashboard = () => {
  const [contests, setContests] = useState([]);
  const [newContest, setNewContest] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
  });
  const [editContest, setEditContest] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contestToDelete, setContestToDelete] = useState(null);
  const [viewContest, setViewContest] = useState(null); // State for viewing contest photos

  const { admin } = useContext(AdminAuthContext); // Use admin context for authentication
  const navigate = useNavigate();

  useEffect(() => {
    if (!admin) {
      navigate("/admin-login"); // Redirect to login if not admin
    }
    fetchContests();
  }, [admin, navigate]);

  const fetchContests = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/contests/fetch`,
        {
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY,
          },
          withCredentials: true,
        }
      );
      setContests(response.data);
    } catch (error) {
      console.error("Error fetching contests:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContest({ ...newContest, [name]: value });
  };

  const handleCreateContest = async (e) => {
    e.preventDefault();

    // Check if the contest with the same title already exists
    const existingContest = contests.find(
      (contest) => contest.title === newContest.title
    );
    if (existingContest) {
      alert(`Contest with title "${newContest.title}" already exists.`);
      return;
    }

    try {
      // If the contest title doesn't exist, proceed to create it
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/contests/insert`,
        newContest,
        {
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY,
          },
          withCredentials: true,
        }
      );
      setNewContest({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
      });
      fetchContests(); // Fetch contests again to update the list
      setShowCreateModal(false);
      alert("Contest Added");
    } catch (error) {
      console.error("Error creating contest:", error);
      alert("Error creating contest. Please try again.");
    }
  };

  const handleDeleteContest = async (contest) => {
    try {
      // Delete contest
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/contests/delete`,
          {
            data: { title: contest.title },
            headers: {
              "x-api-key": process.env.REACT_APP_API_KEY,
            },
            withCredentials: true,
          }
        );
      } catch (error) {
        console.error("Error deleting contest:", error);
      }

      // Delete associated votes
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/votes/delete`,
          {
            data: { contest_title: contest.title },
            headers: {
              "x-api-key": process.env.REACT_APP_API_KEY,
            },
            withCredentials: true,
          }
        );
      } catch (error) {
        console.error("Error deleting votes:", error);
      }

      // Delete all photos related to the contest
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/photos/deleteall`,
          {
            data: { contest_title: contest.title },
            headers: {
              "x-api-key": process.env.REACT_APP_API_KEY,
            },
            withCredentials: true,
          }
        );
      } catch (error) {
        console.error("Error deleting photos:", error);
      }

      // Refresh contest list
      fetchContests();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("General error during deletion:", error);
    }
  };

  const handleEditContest = (contest) => {
    setEditContest(contest);
    setShowEditModal(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditContest({ ...editContest, [name]: value });
  };

  const handleUpdateContest = async (e) => {
    e.preventDefault();
    try {
      console.log(
        editContest.title,
        editContest.description,
        editContest.start_date,
        editContest.end_date
      );
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/contests/update`,
        {
          title: editContest.title,
          description: editContest.description,
          start_date: editContest.start_date,
          end_date: editContest.end_date,
        },
        {
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY,
          },
          withCredentials: true,
        }
      );
      setEditContest(null);
      fetchContests();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating contest:", error);
    }
  };

  const handleViewContest = (contest) => {
    setViewContest(contest);
  };

  const openDeleteModal = (contest) => {
    setContestToDelete(contest);
    setShowDeleteModal(true);
  };

  return (
    <div className="container">
      <style>{`
             
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');


                body {
                    font-family: "Playfair Display", serif;
                }

                .container {
                    padding-top: 10px;
                }
                   

                .modal-dialog {
  display: flex;
  align-items: center;
  min-height: 100vh;
}




                .card {
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .card-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                }

                .card-text {
                    font-size: 0.9rem;
                }

                .form-group {
                    margin-bottom: 1rem;
                }

                .btn,
.btn-primary{
  background-color: purple !important;
  border: none !important;
  color: white !important;
  font-size: 18px;
  border-radius: 5px;
  padding: 10px 16px;
  cursor: pointer;
  margin: 10px 5px;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #5e007e !important; /* darker purple on hover */
}
  .btn-small {
  font-size: 14px;
  padding: 5px 10px;
  margin: 5px 5px;
  background-color: purple !important;
  color: white !important;
  border: none !important;
  border-radius: 4px;
}
.btn-small {
  font-size: 14px;
  padding: 5px 10px;
  margin: 5px 5px;
  background-color: purple !important;
  color: white !important;
  border: none !important;
  border-radius: 4px;
}



            `}</style>
      <h2 className="text-center mt-4">Admin Dashboard</h2>

      <h3 className="text-center mt-4">Create Contest</h3>
      <div className="d-flex justify-content-center align-items-center">
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          Create Contest
        </Button>
      </div>

      <h3 className="text-center mt-4">Manage Contests</h3>
      <div className="d-flex flex-wrap justify-content-center">
        {contests.map((contest) => (
          <div className="col-md-4 d-flex" key={contest._id}>
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">{contest.title}</h5>
                <p className="card-text">{contest.description}</p>
                <p className="card-text">
                  <small className="text-muted">
                    Start:{" "}
                    {new Date(contest.start_date).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })}
                  </small>
                </p>
                <p className="card-text">
                  <small className="text-muted">
                    End:{" "}
                    {new Date(contest.end_date).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })}
                  </small>
                </p>
                <Button
                  className="btn-small"
                  onClick={() => handleEditContest(contest)}
                >
                  Edit
                </Button>
                <Button
                  className="btn-small"
                  onClick={() => openDeleteModal(contest)}
                >
                  Delete
                </Button>
                <Button
                  className="btn-small"
                  onClick={() => handleViewContest(contest)}
                >
                  View Photos
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Contest Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Contest</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleCreateContest}>
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={newContest.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                className="form-control"
                name="description"
                value={newContest.description}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label>Start Date (IST):</label>
              <input
                type="datetime-local"
                className="form-control"
                name="start_date"
                value={newContest.start_date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>End Date (IST):</label>
              <input
                type="datetime-local"
                className="form-control"
                name="end_date"
                value={newContest.end_date}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button variant="primary" type="submit">
              Create Contest
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Edit Contest Modal */}
      {editContest && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Contest</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleUpdateContest}>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={editContest.title}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={editContest.description}
                  onChange={handleEditInputChange}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label>Start Date (IST):</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="start_date"
                  value={editContest.start_date}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date (IST):</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="end_date"
                  value={editContest.end_date}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <Button variant="primary" type="submit">
                Update Contest
              </Button>
            </form>
          </Modal.Body>
        </Modal>
      )}

      {/* Delete Contest Modal */}
      {contestToDelete && (
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Contest</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Are you sure you want to delete the contest "
              {contestToDelete.title}"?
            </p>
            <Button
              className="btn-small"
              onClick={() => handleDeleteContest(contestToDelete)}
            >
              Delete
            </Button>
          </Modal.Body>
        </Modal>
      )}

      {/* View Contest Photos */}
      {viewContest && (
        <AdminContestPhotos
          contest={viewContest}
          show={!!viewContest}
          onHide={() => setViewContest(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
