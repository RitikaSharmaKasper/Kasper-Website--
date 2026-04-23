// import React, { useEffect, useMemo, useRef, useState } from "react";
// import "./AddBlog.css";
// import { Container, Row, Col, Form, Button } from "react-bootstrap";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import axios from "axios";
// import JoditEditor from "jodit-react";
// import BASE_URL from "../Pages/Config/Config.js"
// import { Helmet } from "react-helmet-async";

// // import { Editor } from "@tinymce/tinymce-react";

// const AddBlog = () => {
//   const editor = useRef(null);
//   const descriptionRef = useRef("");
//   const navigate = useNavigate();
//   const { slugOrId } = useParams();
//   const id = localStorage.getItem("userId");
//   const isEditMode = Boolean(slugOrId);

//   const [formData, setFormData] = useState({
//     title: "",
//     category: "",
//     description: "",
//     imageURL: "",
//     imageFiles: [],
//   });

//   const [categories, setCategories] = useState([]);
//   const [imageSource, setImageSource] = useState("file");
//   const [isLoadingBlog, setIsLoadingBlog] = useState(false);
//   const [existingPreviewImage, setExistingPreviewImage] = useState("");
//   const [editorContent, setEditorContent] = useState("");

//   const editorConfig = useMemo(
//     () => ({
//       readonly: false,
//       height: 380,
//       toolbarAdaptive: false,
//       askBeforePasteHTML: false,
//       askBeforePasteFromWord: false,
//       defaultActionOnPaste: "insert_as_html",
//       processPasteHTML: true,
//       pasteHTMLActionList: [
//         { value: "insert_as_html", text: "Keep formatting" },
//         { value: "insert_clear_html", text: "Clean formatting" },
//         { value: "insert_only_text", text: "Paste as text" },
//       ],
//       buttons: [
//         "source",
//         "|",
//         "bold",
//         "italic",
//         "underline",
//         "strikethrough",
//         "|",
//         "ul",
//         "ol",
//         "|",
//         "outdent",
//         "indent",
//         "|",
//         "fontsize",
//         "brush",
//         "paragraph",
//         "|",
//         "link",
//         "image",
//         "table",
//         "|",
//         "align",
//         "undo",
//         "redo",
//       ],
//     }),
//     [],
//   );

//   useEffect(() => {
//     const fetchAllcategories = async () => {
//       try {
//         const { data } = await axios.get(
//           `${BASE_URL}/api/v1/category/all-categories`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//         if (data?.success) {
//           setCategories(data?.category);
//         }
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };
//     fetchAllcategories();
//   }, []);

//   useEffect(() => {
//     if (!isEditMode) return;

//     const fetchBlogDetails = async () => {
//       try {
//         setIsLoadingBlog(true);
//         const { data } = await axios.get(
//           `${BASE_URL}/api/v1/blog/get-blog/${slugOrId}`,
//         );

//         if (data?.blog) {
//           const blog = data.blog;
//           const previewImage =
//             blog.image ||
//             (Array.isArray(blog.thumbnail) && blog.thumbnail.length > 0
//               ? blog.thumbnail[0]
//               : "");

//           setFormData({
//             title: blog.title || "",
//             category: blog.category?._id || blog.category || "",
//             description: blog.description || "",
//             imageURL: blog.image || "",
//             imageFiles: [],
//           });
//           setEditorContent(blog.description || "");
//           descriptionRef.current = blog.description || "";
//           setExistingPreviewImage(previewImage);
//           setImageSource(blog.image ? "url" : "file");
//         } else {
//           toast.error("Blog not found.");
//         }
//       } catch (error) {
//         toast.error("Failed to load blog details.");
//         console.error(error.response?.data || error.message);
//       } finally {
//         setIsLoadingBlog(false);
//       }
//     };

//     fetchBlogDetails();
//   }, [isEditMode, slugOrId]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const contentFieldChanged = (data) => {
//     descriptionRef.current = data;
//     setEditorContent(data);
//   };

//   const handleImageUpload = (e) => {
//   const file = e.target.files[0]; // ✅ Get the first file

//   if (!file) return;

//   if (isEditMode) {
//     toast.error("Image file replacement is not available in edit mode.");
//     e.target.value = null;
//     return;
//   }

//   const validTypes = ["image/jpeg", "image/png", "image/jpg"];

//   if (!validTypes.includes(file.type)) {
//     toast.error("Only JPG and PNG image files are allowed.");
//     e.target.value = null;
//     return;
//   }

//   if (file.size > 2 * 1024 * 1024) {
//     toast.error("File size must be less than 2MB.");
//     e.target.value = null;
//     return;
//   }

//   // ✅ If valid, update state
//   setFormData({
//     ...formData,
//     imageFiles: [file], // or just file if you're handling single file
//   });
//   setExistingPreviewImage(URL.createObjectURL(file));
//   setImageSource("file");
// };


//   const handleImageURLChange = (e) => {
//     setFormData({
//       ...formData,
//       imageURL: e.target.value,
//     });
//     setImageSource("url");
//   };

//   const handleCategoryChange = (e) => {
//     setFormData({ ...formData, category: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const finalDescription = descriptionRef.current || editorContent || formData.description;

//     if (!formData.title || !formData.category || !finalDescription) {
//       toast.error("All fields are required!");
//       return;
//     }

//     if (!isEditMode && imageSource === "file" && !formData.imageFiles.length) {
//       toast.error("Please upload an image file!");
//       return;
//     }

//     if (!isEditMode && imageSource === "url" && !formData.imageURL) {
//       toast.error("Please provide an image URL!");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");

//       if (isEditMode) {
//         const payload = {
//           title: formData.title,
//           category: formData.category,
//           description: finalDescription,
//         };

//         if (imageSource === "url") {
//           payload.image = formData.imageURL.trim();
//         }

//         let data;

//         if (imageSource === "file" && formData.imageFiles.length) {
//           const editFormData = new FormData();
//           editFormData.append("title", formData.title);
//           editFormData.append("category", formData.category);
//           editFormData.append("description", finalDescription);
//           formData.imageFiles.forEach((file) => {
//             editFormData.append("thumbnail", file);
//           });

//           const response = await axios.put(
//             `${BASE_URL}/api/v1/blog/update-blog/${slugOrId}`,
//             editFormData,
//             {
//               headers: {
//                 "Content-Type": "multipart/form-data",
//                 Authorization: `Bearer ${token}`,
//               },
//             },
//           );
//           data = response.data;
//         } else {
//           const response = await axios.put(
//             `${BASE_URL}/api/v1/blog/update-blog/${slugOrId}`,
//             payload,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             },
//           );
//           data = response.data;
//         }

//         if (data?.success) {
//           toast.success("Blog updated successfully");
//           navigate("/adminsidebar/my-blogs");
//         }
//       } else {
//         const formdata = new FormData();
//         formdata.append("title", formData.title);
//         formdata.append("category", formData.category);
//         formdata.append("description", finalDescription);
//         formdata.append("user", id);

//         if (formData.imageFiles.length) {
//           formData.imageFiles.forEach((file) => {
//             formdata.append("thumbnail", file);
//           });
//         }

//         if (formData.imageURL) {
//           formdata.append("image", formData.imageURL);
//         }

//         const { data } = await axios.post(
//           `${BASE_URL}/api/v1/blog/create-blog`,
//           formdata,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (data?.success) {
//           toast.success("Blog added successfully");
//           navigate("/adminsidebar/my-blogs");
//         }
//       }
//     } catch (error) {
//       toast.error(isEditMode ? "Error updating blog" : "Error adding blog");
//       console.error(error.response?.data || error.message);
//     }
//   };

//   if (!id) {
//     return (
//       <Container className="text-center mt-5">
//         <h4>Please login to create a blog.</h4>
//       </Container>
//     );
//   }

//   if (isEditMode && isLoadingBlog) {
//     return (
//       <Container className="text-center mt-5">
//         <h4>Loading blog details...</h4>
//       </Container>
//     );
//   }

//   return (
//     <> 
//      <Helmet>
//         <title>Know More About Us| Kasper Infotech</title>
//         <meta
//           name="discription"
//           content="Learn about us our expert team and comprehensive services in digital marketing and web development."
//         />
//         <meta name="keywords" content="About us" />

//         <link rel="canonical" href="https://kasperinfotech.com/adminsidebar/addblog" />
//         <meta
//           property="og:title"
//           content="Know More About us | Kasper Infotech"
//         />
//         <meta property="og:site_name" content="Kasper Infotech" />
//         <meta property="og:url" content="https://kasperinfotech.com/adminsidebar/addblog" />
//         <meta
//           property="og:description"
//           Content="Learn about us our expert team and comprehensive services in digital marketing and web development."
//         />
//         <meta property="og:type" content="website" />
//         <meta
//           property="og:image"
//           content="https://kasperinfotech.com/static/media/CRMMigration.c30b479028a90c971cf38a10328ecf98.svg"
//         />
//       </Helmet>

//     <Container className="py-5">
//       <Row className="justify-content-center">
//         <Col lg={8}>
//           <div className="border p-4 rounded shadow-sm bg-light">
//             <h2 className="text-center mb-4">
//               {isEditMode ? "Edit Blog Post" : "Create New Blog Post"}
//             </h2>
//             <Form onSubmit={handleSubmit}>
//               <Form.Group className="mb-3">
//                 <Form.Label className="add-form">Blog Title</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="title"
//                   placeholder="Enter blog title"
//                   value={formData.title}
//                   onChange={handleChange}
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3 ">
//                 <Form.Label className="add-form"> Select Category</Form.Label>
//                 <Form.Select
//                   name="category"
//                   value={formData.category}
//                   onChange={handleCategoryChange}
//                 >
//                   <option value="">-- Select --</option>
//                   {categories &&
//                     categories.map((item) => (
//                       <option key={item._id} value={item._id}>
//                         {item.title}
//                       </option>
//                     ))}
//                 </Form.Select>
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label className="add-form">Description</Form.Label>
//                 <div className="border rounded bg-white">
//                  <JoditEditor
//   ref={editor}
//   value={editorContent} // This only sets the initial/loaded value
//   config={editorConfig}
//   // Remove onChange={contentFieldChanged} <--- This is the culprit
//   onBlur={(newContent) => {
//     // Sync the ref and the state ONLY when the user clicks away or stops
//     descriptionRef.current = newContent;
//     setEditorContent(newContent);
//     setFormData((prev) => ({
//       ...prev,
//       description: newContent,
//     }));
//   }}
// />
//                   {/* <Editor
//                     apiKey="your-tinymce-api-key" // optional, works without too
//                     init={{
//                       height: 500,
//                       menubar: true,
//                       plugins: [
//                         "advlist autolink lists link image charmap preview anchor",
//                         "searchreplace visualblocks code fullscreen",
//                         "insertdatetime media table code help wordcount",
//                       ],
//                       toolbar:
//                         "undo redo | formatselect | bold italic backcolor | \
//                         alignleft aligncenter alignright alignjustify | \
//                         bullist numlist outdent indent | removeformat | help | media",
//                     }}
//                     value={formData.description}
//                     onEditorChange={contentFieldChanged}
//                   /> */}
//                 </div>
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label className="add-form">Main Image</Form.Label>
//                 <div className="d-flex gap-3 mb-2 
//                 " >
//                   <Form.Check
//                     inline
//                     label={<span className="form-check-label-custom">Upload File</span>}
//                     type="radio"
//                     name="imageSource"
//                     className="image-url-input"
//                     id="fileOption"
//                     value="file"
//                     checked={imageSource === "file"}
//                     onChange={() => setImageSource("file")}
//                   />
//                   <Form.Check
//                     inline
//                      label={<span className="form-check-label-custom">Image URL</span>}
//                       className="image-url-input"
//                     type="radio"
//                     name="imageSource"
//                     id="urlOption"
//                     value="url"
//                     checked={imageSource === "url"}
//                     onChange={() => setImageSource("url")}
//                   />
//                 </div>

//                 {imageSource === "file" ? (
//                   <Form.Control
//                     className="image-url-input"
//                     type="file"
//                     accept="image/*"
//                     multiple
//                     onChange={handleImageUpload}
//                   />
//                 ) : (
//                   <Form.Control
//                    className="image-url-input"
//                     type="text"
//                     placeholder="Enter Image URL"
//                     value={formData.imageURL}
//                     onChange={handleImageURLChange}
//                   />
//                 )}

//                 {(existingPreviewImage || formData.imageURL) && (
//                   <div style={{ marginTop: "12px" }}>
//                     <img
//                       src={formData.imageURL || existingPreviewImage}
//                       alt="Blog preview"
//                       style={{
//                         width: "100%",
//                         maxHeight: "220px",
//                         objectFit: "cover",
//                         borderRadius: "8px",
//                         border: "1px solid #ddd",
//                       }}
//                     />
//                   </div>
//                 )}
//               </Form.Group>

//               <div className="text-center mt-4">
//                 <Button variant="primary" type="submit" size="lg">
//                   {isEditMode ? "Update Blog" : "Add Blog"}
//                 </Button>
//               </div>
//             </Form>
//           </div>
//         </Col>
//       </Row>
//     </Container>
//     </>
//   );
// };

// export default AddBlog;
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./AddBlog.css";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast,Toaster } from "react-hot-toast";
import axios from "axios";
import JoditEditor from "jodit-react";
import BASE_URL from "../Pages/Config/Config.js";
import { Helmet } from "react-helmet-async";

const AddBlog = () => {
  const editor = useRef(null);
  const navigate = useNavigate();
  const { slugOrId } = useParams();
  const id = localStorage.getItem("userId");
  const isEditMode = Boolean(slugOrId);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    imageURL: "",
    imageFiles: [],
  });

  const [categories, setCategories] = useState([]);
  const [imageSource, setImageSource] = useState("file");
  const [isLoadingBlog, setIsLoadingBlog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingPreviewImage, setExistingPreviewImage] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const editorConfig = useMemo(
    () => ({
      readonly: false,
      height: 400,
      placeholder: "Description of your blog.....",
      toolbarAdaptive: false,
      uploader: {
        url: `${BASE_URL}/api/v1/blog/upload-image`,
        format: 'json',
        filesFieldName: 'image',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        isHTML7: true,
        withCredentials: true,
        process: function (resp) {
          return {
            files: [resp.link],
            error: resp.success ? false : resp.message,
            msg: resp.message
          };
        },
        defaultHandlerSuccess: function (data) {
          const url = data.files[0];
          if (url.match(/\.(mp4|webm|ogg|mov)$/i)) {
            this.selection.insertHTML(`<video controls src="${url}" style="width: 100%; height: auto; max-height: 400px; display: block; margin: 10px auto;"></video>`);
          } else {
            this.selection.insertHTML(`<img src="${url}" style="width: 100%; height: auto; display: block; margin: 10px auto;" />`);
          }
        },
        error: function (e) {
          toast.error("Upload failed: " + e.message);
        }
      },
      buttons: [
        "source", "|", "bold", "italic", "underline", "strikethrough", "|",
        "ul", "ol", "|", "outdent", "indent", "|",
        "fontsize", "brush", "paragraph", "font", "|",
        "link", "image", "video", "table", "|", "align", "undo", "redo",
      ],
    }),
    []
  );

  useEffect(() => {
    const fetchAllcategories = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/v1/category/all-categories`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (data?.success) setCategories(data?.category);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchAllcategories();
  }, []);

  useEffect(() => {
    if (!isEditMode) return;
    const fetchBlogDetails = async () => {
      try {
        setIsLoadingBlog(true);
        const { data } = await axios.get(`${BASE_URL}/api/v1/blog/get-blog/${slugOrId}`);
        if (data?.blog) {
          const blog = data.blog;
          setFormData({
            title: blog.title || "",
            category: blog.category?._id || blog.category || "",
            imageURL: blog.image || "",
            imageFiles: [],
          });
          setEditorContent(blog.description || "");
          setExistingPreviewImage(blog.image || (blog.thumbnail?.[0]) || "");
          setImageSource(blog.image ? "url" : "file");
        }
      } catch (error) {
        toast.error("Failed to load blog details.");
      } finally {
        setIsLoadingBlog(false);
      }
    };
    fetchBlogDetails();
  }, [isEditMode, slugOrId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  setFormData((prev) => ({ 
    ...prev, 
    imageFiles: [file],
    imageURL: "" // Clear the URL if a file is uploaded
  }));
  const objectUrl = URL.createObjectURL(file);
  setExistingPreviewImage(objectUrl);
  setImageSource("file");
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !editorContent) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("category", formData.category);
      submitData.append("description", editorContent); // HTML Content preserved here
      submitData.append("user", id);

      // if (imageSource === "file" && formData.imageFiles.length > 0) {
      //   submitData.append("thumbnail", formData.imageFiles[0]);
      // } else if (formData.imageURL) {
      //   submitData.append("image", formData.imageURL);
      // }
      if (imageSource === "file" && formData.imageFiles.length > 0) {
        // New file selected
        submitData.append("thumbnail", formData.imageFiles[0]);
      } else if (imageSource === "url" && formData.imageURL) {
        // Image URL provided
        submitData.append("image", formData.imageURL);
      } else if (isEditMode && existingPreviewImage && !existingPreviewImage.startsWith("blob:")) {
        // Keep existing image if it's NOT a blob URL (meaning it's the original URL)
        submitData.append("image", existingPreviewImage);
      }

      let response;
      if (isEditMode) {
        response = await axios.put(`${BASE_URL}/api/v1/blog/update-blog/${slugOrId}`, submitData, {
          headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}` 
          },
        });
      } else {
        response = await axios.post(`${BASE_URL}/api/v1/blog/create-blog`, submitData, {
          headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}` 
          },
        });
      }

      if (response.data?.success) {
        toast.success(isEditMode ? "Blog updated!" : "Blog created successfully!");
        setTimeout(() => navigate("/adminsidebar/my-blogs"), 500);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingBlog) return <Container className="py-5 text-center"><Spinner animation="border" /></Container>;

  return (
    <Container className="py-5">
      <Helmet><title>{isEditMode ? "Edit" : "Add"} Blog | Kasper Infotech</title></Helmet>
      <Row className="justify-content-center">
        <Col lg={9}>
          <div className="p-4 shadow-sm bg-white rounded border">
            <Toaster position="top-center"  />
            <h2 className="mb-4 text-center">{isEditMode ? "Update Blog" : "Create Blog"}</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Blog Title</Form.Label>
                <Form.Control 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange} 
                  required
                >
                  <option value="">Choose...</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.title}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <JoditEditor
                  ref={editor}
                  value={editorContent}
                  config={editorConfig}
                  onBlur={(newContent) => setEditorContent(newContent)} 
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Featured Image</Form.Label>
                <div className="mb-2">
                  <Form.Check inline label="Upload File" type="radio" checked={imageSource === "file"} onChange={() => setImageSource("file")} />
                  <Form.Check inline label="Image URL" type="radio" checked={imageSource === "url"} onChange={() => setImageSource("url")} />
                </div>
                {imageSource === "file" ? (
                  <Form.Control type="file" accept="image/*" onChange={handleImageUpload} />
                ) : (
                  <Form.Control type="text" name="imageURL" placeholder="http://..." value={formData.imageURL} onChange={handleChange} />
                )}
                {existingPreviewImage && (
                  <img src={existingPreviewImage} alt="Preview" className="mt-3 rounded w-100" style={{ maxHeight: "250px", objectFit: "cover" }} />
                )}
              </Form.Group>

             {/* Change the margin-top (mt-4) or add custom padding (py-3) as needed */}
<div className="text-center mt-3 pt-2"> 
  <Button 
    variant="primary" 
    type="submit" 
    size="lg" 
    disabled={isSubmitting}
    className="px-2 py-2 shadow-sm" // Added horizontal padding and a small shadow
    style={{ minWidth: "200px" }}   // Keeps the button size consistent
  >
    {isSubmitting ? (
      <>
        <Spinner size="sm" className="me-2" /> 
        Saving...
      </>
    ) : (
      isEditMode ? "Update Blog" : "Create Blog"
    )}
  </Button>
</div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AddBlog;