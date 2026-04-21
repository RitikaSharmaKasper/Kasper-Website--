import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; //
import "./Profile.css";
import axios from "axios";
import { Container } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import BASE_URL from "../Pages/Config/Config.js"

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    profile: "",
  });

  const [file, setFile] = useState(null);

  const token = localStorage.getItem("token");

  const email = localStorage.getItem("email") || "";

  const { userId: paramUserId } = useParams();
  const userId = paramUserId || localStorage.getItem("userId");
  const id = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/user/get-profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          },
        );
        setFormData({
          name: response.data.user.username || "",
          email: response.data.user.email || "",
          bio: response.data.user.bio || "",
          profile: response.data.user.profile || "",
        });
        console.log(formData);
      } catch (error) {
        //console.error("Error getting profile:", error.response?.data || error.message || error);
      }
    };
    fetchUserData();
  }, [userId, token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile") {
      const file = files[0];
      if (file) {
        const validTypes = ["image/jpeg", "image/png"];
        const maxSize = 2 * 1024 * 1024;

        if (!validTypes.includes(file.type)) {
          toast.error("Only JPG and PNG files are allowed.");
          return;
        }
        if (file.size > maxSize) {
          toast.error("File size must be under 2MB.");
          return;
        }
        setFile(file);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("username", formData.name);
    form.append("email", formData.email);
    form.append("bio", formData.bio);
    if (file) {
      form.append("profile", file);
    }

    try {
      const response = await axios.put(
        `${BASE_URL}/api/v1/user/update-profile/${userId}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      toast.success("Profile updated successfully!");
      console.log("Update response:", response.data);

      const updatedUser = response.data.user;
      setFormData({
        ...formData,
        name: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio,
        profile: updatedUser.profile,
      });

      setFile(null);

      localStorage.setItem("name", response.data.user.username);
      localStorage.setItem("email", response.data.user.email);
      localStorage.setItem("profile", response.data.user.profile);
    } catch (error) {
      //console.error("Error updating profile:", error.response?.data || error.message);
      toast.error("Failed to update profile.");
    }
  };

  if (!id) {
    return (
      <Container className="text-center mt-5">
        <h4>Please login to see Profile.</h4>
      </Container>
    );
  }
  return (
    <div
      className="profile-page"
      style={{
        flexGrow: 1,

        padding: "12px",
        fontSize: "15px",
      }}
    >
      <Toaster position="top-center" reverseOrder={false} />
      <div
        className="profilepageview"
        style={{
          display: "flex",
          gap: "30px",
          backgroundColor: "#fff",
          padding: "10px",
          borderRadius: "12px",
        }}
      >
        {/* User Info */}
        <div
          className="profile-page"
          style={{
            width: "40%",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            padding: "29px",
            fontSize: "15px",
          }}
        >
          <h2 className="userinf">User Information</h2>
          <p>
            <strong>Name:</strong> {formData.name}
          </p>
          <p>
            <strong>Email:</strong> {formData.email}
          </p>
          <p>
            <strong>Bio:</strong> {formData.bio || "No bio provided"}
          </p>
          <div className="pimage-container">
              <img
                src={
                  file
                    ? URL.createObjectURL(file)
                    : formData.profile
                      ? `${BASE_URL}/upload/${formData.profile}`
                      : "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-male-user-profile-vector-illustration-isolated-background-man-profile-sign-business-concept_157943-38764.jpg"
                }
                alt="Profile"
                style={{
                  width: "60%",
                  borderRadius: "10px",
                  marginTop: "10px",
                }}
              />
              {(file || formData.profile) && (
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setFormData((prev) => ({ ...prev, profile: "" }));
                    toast.success("Profile image removed. Click 'Update Profile' to save.");
                  }}
                  style={{
                    display: "block",
                    marginTop: "8px",
                    padding: "6px 14px",
                    backgroundColor: "#e74c3c",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  Remove Image
                </button>
              )}
          </div>
        </div>

        {/* Update Form */}
        <div
          className="profile-page"
          style={{
            width: "60%",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            padding: "12px",
            fontSize: "15px",
          }}
        >
          <h2>Update Your Information</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              readOnly
              style={inputStyle}
            />

            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              readOnly
              style={inputStyle}
            />

            <label htmlFor="bio">Bio:</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio || ""}
              onChange={handleChange}
              maxLength={200}
              rows={4}
              style={{ ...inputStyle, resize: "none" }}
            />

            <label htmlFor="profile">Profile Picture:</label>
            <p style={{ margin: "4px 0", fontSize: "0.9em", color: "#555" }}>
              Allowed: JPG or PNG, Max size: 2MB
            </p>
            <input
              id="profile"
              type="file"
              name="profile"
              accept="image/png, image/jpeg"
              onChange={handleChange}
              style={{
                margin: "8px 0",
                paddingLeft: "4px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
              }}
            />

            <button type="submit" style={buttonStyle}>
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Simple inline styles
const inputStyle = {
  padding: "10px",
  margin: "8px 0 16px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  display: "block",
  width: "100%",
};

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  marginTop: "30px",
};

export default Profile;
