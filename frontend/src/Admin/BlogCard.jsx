import React from "react";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { useNavigate } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import ThumbnailPlaceholder from "../assets/images2/thumb.jpg"

import "./Blogs.jsx"

const BlogCard = ({
  title,
  description,
  image,
  thumbnail,
  username,
  time,
  id,
  isUser,
  handleDelete,
  slug,
  previewOnly = false, // This prop is used for controlling the preview
}) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/blog-details/${slug || id}`);
  };

  const handleView = () => {
    navigate(`/blogpost/${slug}`);
  };

  // Clean and sanitize the description
  const cleanHTML = DOMPurify.sanitize(description, {
    FORBID_ATTR: ["style", "width", "height", "float"],
  });

  // Handle the main image (either from thumbnail or image prop)
  const getMainImage = () => {
    if (thumbnail && Array.isArray(thumbnail) && thumbnail.length > 0) {
      const cleanThumbnail = thumbnail[0].startsWith("/")
        ? thumbnail[0].slice(1)
        : thumbnail[0];
      return `${cleanThumbnail}`;
    }
    // If there's no thumbnail, fall back to the `image` prop
    return image && image.trim() ? image : ThumbnailPlaceholder;
  };
console.log(getMainImage());

  // Truncate the description for preview, limiting to 2 lines
  const shortDescription =
    cleanHTML.length > 150 ? cleanHTML.slice(0, 150) + "..." : cleanHTML;

  return (
    <div className="simple-blog-card">
      <div className="blog-header">

        {/* username and time */}

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              backgroundColor: "#f44336",
              color: "white",
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            {username ? username.charAt(0).toUpperCase() : ""}
          </div>
          <div>
            <div style={{ fontWeight: "bold" }}>{username}</div>
            <div style={{ fontSize: "12px", color: "gray" }}>
              {time ? new Date(time).toLocaleDateString() : ""}
            </div>
          </div>
        </div>



        {isUser && (
          <div className="actions">
            <MdEdit onClick={handleEdit} title="Edit Blog" className="icon edit" />
            <MdDelete onClick={() => handleDelete(slug)} title="Delete Blog" className="icon delete" />
          </div>
        )}
      </div>

      {/* Display a single thumbnail image */}
      <img src={getMainImage()} alt={title} className="blog-thumbnail" />

      <div className="blogpreview-title">{title}</div>

      {/* If it's a preview, show only 2 lines of description */}
      <div className="blog-description">
        {previewOnly ? parse(shortDescription) : parse(cleanHTML)}
      </div>

      {/* If it's a preview, show the "read more" button */}
      {previewOnly && (
        <div className="read-more-wrapper">
          <div className="read-more-btn" onClick={handleView} title="Read Full Blog">
            Read More
          </div>
        </div>
      )}

    </div>
  );
};

export default BlogCard;
