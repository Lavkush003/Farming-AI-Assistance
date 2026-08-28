// import React, { useState, useEffect } from "react";
// import { useAuth } from "../../context/AuthContext";
// import { useTheme } from "../../context/ThemeContext";

// const Forum = () => {
//   const { user } = useAuth();
//   const { theme } = useTheme();
//   const isDark = theme === "dark";

//   const [posts, setPosts] = useState([]);
//   const [title, setTitle] = useState("");
//   const [body, setBody] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [commentText, setCommentText] = useState({});
//   const [expandedPost, setExpandedPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   const fetchWithTimeout = async (url, options = {}) => {
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), 12000);

//     try {
//       return await fetch(url, { ...options, signal: controller.signal });
//     } finally {
//       clearTimeout(timeoutId);
//     }
//   };

//   const fetchPosts = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetchWithTimeout("http://localhost:5000/api/forum");
//       const data = await res.json().catch(() => null);
//       if (!res.ok || !Array.isArray(data)) {
//         throw new Error(data?.error || "Unable to load community posts.");
//       }
//       setPosts(data);
//     } catch (err) {
//       console.error("Error fetching posts:", err);
//       setError(err.message || "Unable to load community posts.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchPosts(); }, []);

//   const handleCreatePost = async (e) => {
//     e.preventDefault();
//     if (!user) return alert("Please login first");
//     if (!title.trim() || !body.trim()) return;

//     setSubmitting(true);
//     setError("");
//     try {
//       const res = await fetchWithTimeout("http://localhost:5000/api/forum", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           title,
//           body,
//           author: user.name || user.email,
//           authorId: user.id || user.uid || user.email,
//         }),
//       });
//       const data = await res.json().catch(() => null);
//       if (!res.ok) {
//         throw new Error(data?.error || "Unable to publish your post.");
//       }
//       if (res.ok) {
//         setTitle("");
//         setBody("");
//         setShowForm(false);
//         await fetchPosts();
//       }
//     } catch (err) {
//       console.error("Error creating post:", err);
//       setError(err.message || "Unable to publish your post.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleLike = async (id) => {
//     try {
//       await fetch(`http://localhost:5000/api/forum/${id}/like`, { method: "PATCH" });
//       fetchPosts();
//     } catch (err) {
//       console.error("Error liking post:", err);
//     }
//   };

//   const handleComment = async (id) => {
//     if (!user) return alert("Please login first");
//     const text = commentText[id]?.trim();
//     if (!text) return;

//     try {
//       await fetch(`http://localhost:5000/api/forum/${id}/comment`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ text, author: user.name || user.email }),
//       });
//       setCommentText({ ...commentText, [id]: "" });
//       fetchPosts();
//     } catch (err) {
//       console.error("Error adding comment:", err);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this post?")) return;
//     try {
//       await fetch(`http://localhost:5000/api/forum/${id}`, { method: "DELETE" });
//       fetchPosts();
//     } catch (err) {
//       console.error("Error deleting post:", err);
//     }
//   };

//   const timeAgo = (date) => {
//     const seconds = Math.floor((new Date() - new Date(date)) / 1000);
//     if (seconds < 60) return "just now";
//     const minutes = Math.floor(seconds / 60);
//     if (minutes < 60) return `${minutes}m ago`;
//     const hours = Math.floor(minutes / 60);
//     if (hours < 24) return `${hours}h ago`;
//     const days = Math.floor(hours / 24);
//     return `${days}d ago`;
//   };

//   return (
//     <div className="min-vh-100 py-5" style={{ backgroundColor: isDark ? "#121212" : "#f8f9fa", color: isDark ? "#fff" : "#212529", marginTop: "70px" }}>
//       <div className="container">
//         <div className="d-flex justify-content-between align-items-center mb-5">
//           <div>
//             <h1 className="display-5 fw-bold text-success mb-1">Farmer's Community</h1>
//             <p className="text-muted lead">Connect with fellow farmers. Share knowledge. Grow together.</p>
//           </div>
//           {user && (
//             <button className="btn btn-success btn-lg rounded-pill px-4 shadow" onClick={() => setShowForm(!showForm)}>
//               <i className={`bi ${showForm ? 'bi-x-lg' : 'bi-plus-lg'} me-2`}></i>
//               {showForm ? "Cancel" : "New Post"}
//             </button>
//           )}
//         </div>

//         {/* Create Post Form */}
//         {showForm && (
//           <div className={`card shadow-sm mb-5 border-0 rounded-4 ${isDark ? 'bg-dark' : 'bg-white'}`}>
//             <div className="card-body p-4">
//               <h4 className="fw-bold text-success mb-3"><i className="bi bi-pencil-square me-2"></i>Create a Post</h4>
//               <form onSubmit={handleCreatePost}>
//                 <input
//                   type="text"
//                   className={`form-control mb-3 ${isDark ? 'bg-black text-light border-secondary' : ''}`}
//                   placeholder="Post Title (e.g. How to deal with leaf curl in tomatoes?)"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   required
//                 />
//                 <textarea
//                   className={`form-control mb-3 ${isDark ? 'bg-black text-light border-secondary' : ''}`}
//                   rows="4"
//                   placeholder="Share your experience, ask a question, or give advice..."
//                   value={body}
//                   onChange={(e) => setBody(e.target.value)}
//                   required
//                 />
//                 <button type="submit" className="btn btn-success px-4 rounded-pill fw-bold" disabled={submitting}>
//                   <i className="bi bi-send me-2"></i>Publish Post
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}

//         {!user && (
//           <div className="alert alert-warning text-center rounded-4 shadow-sm mb-4">
//             <i className="bi bi-person-lock me-2"></i>
//             Please <a href="/login" className="fw-bold text-dark">login</a> to create posts and join the community discussion.
//           </div>
//         )}

//         {error && (
//           <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
//             <span>{error}</span>
//             <button type="button" className="btn btn-outline-danger btn-sm" onClick={fetchPosts} disabled={loading}>
//               Retry
//             </button>
//           </div>
//         )}

//         {/* Posts Feed */}
//         {loading ? (
//           <div className="text-center py-5 text-muted" role="status">Loading community posts...</div>
//         ) : posts.length === 0 ? (
//           <div className="text-center py-5 text-muted">
//             <i className="bi bi-chat-dots" style={{ fontSize: "4rem" }}></i>
//             <h4 className="mt-3">No posts yet. Be the first to start a conversation!</h4>
//           </div>
//         ) : (
//           posts.map((post) => (
//             <div key={post._id} className={`card shadow-sm mb-4 border-0 rounded-4 ${isDark ? 'bg-dark' : 'bg-white'}`}>
//               <div className="card-body p-4">
//                 {/* Post Header */}
//                 <div className="d-flex justify-content-between align-items-start mb-3">
//                   <div className="d-flex align-items-center gap-3">
//                     <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: "45px", height: "45px", fontSize: "1.2rem" }}>
//                       {post.author?.charAt(0)?.toUpperCase() || "F"}
//                     </div>
//                     <div>
//                       <h6 className="fw-bold mb-0">{post.author}</h6>
//                       <small className="text-muted">{timeAgo(post.createdAt)}</small>
//                     </div>
//                   </div>
//                   {user?.id === post.authorId && (
//                     <button className="btn btn-outline-danger btn-sm rounded-pill" onClick={() => handleDelete(post._id)}>
//                       <i className="bi bi-trash"></i>
//                     </button>
//                   )}
//                 </div>

//                 {/* Post Content */}
//                 <h5 className="fw-bold text-success">{post.title}</h5>
//                 <p className="mb-3" style={{ whiteSpace: "pre-wrap" }}>{post.body}</p>

//                 {/* Actions */}
//                 <div className="d-flex gap-3 border-top pt-3">
//                   <button className="btn btn-outline-success btn-sm rounded-pill" onClick={() => handleLike(post._id)}>
//                     <i className="bi bi-hand-thumbs-up me-1"></i> {post.likes || 0} Likes
//                   </button>
//                   <button className="btn btn-outline-secondary btn-sm rounded-pill" onClick={() => setExpandedPost(expandedPost === post._id ? null : post._id)}>
//                     <i className="bi bi-chat-dots me-1"></i> {post.comments?.length || 0} Comments
//                   </button>
//                 </div>

//                 {/* Comments Section */}
//                 {expandedPost === post._id && (
//                   <div className="mt-3 pt-3 border-top">
//                     {post.comments?.map((c, idx) => (
//                       <div key={idx} className={`p-2 px-3 rounded-3 mb-2 ${isDark ? 'bg-black' : 'bg-light'}`}>
//                         <strong className="text-success">{c.author}</strong>
//                         <small className="text-muted ms-2">{timeAgo(c.createdAt)}</small>
//                         <p className="mb-0 mt-1">{c.text}</p>
//                       </div>
//                     ))}
//                     {user && (
//                       <div className="d-flex gap-2 mt-2">
//                         <input
//                           type="text"
//                           className={`form-control form-control-sm ${isDark ? 'bg-black text-light border-secondary' : ''}`}
//                           placeholder="Write a comment..."
//                           value={commentText[post._id] || ""}
//                           onChange={(e) => setCommentText({ ...commentText, [post._id]: e.target.value })}
//                           onKeyDown={(e) => e.key === 'Enter' && handleComment(post._id)}
//                         />
//                         <button className="btn btn-success btn-sm rounded-pill px-3" onClick={() => handleComment(post._id)}>
//                           <i className="bi bi-send"></i>
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Forum;




import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

// ============================================================
// API CONFIGURATION
// ============================================================
// Local development:
//   http://localhost:5000
//
// Production:
//   Set VITE_API_URL in Vercel, for example:
//   https://your-backend.onrender.com
//
// Do NOT add /api/forum to VITE_API_URL.
const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, "") ||
  "http://localhost:5000";

// ============================================================
// HELPER: API REQUEST WITH TIMEOUT
// ============================================================
const fetchWithTimeout = async (url, options = {}, timeout = 15000) => {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};

// ============================================================
// HELPER: READ JSON SAFELY
// ============================================================
const getResponseData = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return await response.json();
  }

  const text = await response.text();

  return text ? { error: text } : null;
};

// ============================================================
// FORUM COMPONENT
// ============================================================
const Forum = () => {
  const { user } = useAuth();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  // ==========================================================
  // STATE
  // ==========================================================
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [commentText, setCommentText] = useState({});
  const [expandedPost, setExpandedPost] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ==========================================================
  // FETCH POSTS
  // ==========================================================
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetchWithTimeout(
        `${API_URL}/api/forum`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        },
        15000
      );

      const data = await getResponseData(res);

      if (!res.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            `Server error (${res.status})`
        );
      }

      if (!Array.isArray(data)) {
        throw new Error("Invalid response received from forum server.");
      }

      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);

      if (err.name === "AbortError") {
        setError(
          "The server took too long to respond. Your Render backend may be starting."
        );
      } else if (err instanceof TypeError) {
        setError(
          "Unable to connect to the backend server. Please check the backend URL and CORS settings."
        );
      } else {
        setError(err.message || "Unable to load community posts.");
      }

      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================================
  // LOAD POSTS WHEN PAGE OPENS
  // ==========================================================
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // ==========================================================
  // CREATE POST
  // ==========================================================
  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login first.");
      return;
    }

    const cleanTitle = title.trim();
    const cleanBody = body.trim();

    if (!cleanTitle || !cleanBody) {
      setError("Please enter both a title and post content.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetchWithTimeout(
        `${API_URL}/api/forum`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            title: cleanTitle,
            body: cleanBody,
            author: user.name || user.displayName || user.email || "Farmer",
            authorId:
              user.id ||
              user.uid ||
              user.email ||
              "anonymous",
          }),
        },
        15000
      );

      const data = await getResponseData(res);

      if (!res.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            `Unable to publish post (${res.status})`
        );
      }

      setTitle("");
      setBody("");
      setShowForm(false);

      await fetchPosts();
    } catch (err) {
      console.error("Error creating post:", err);

      if (err.name === "AbortError") {
        setError("The server took too long to respond.");
      } else if (err instanceof TypeError) {
        setError("Unable to connect to the backend server.");
      } else {
        setError(err.message || "Unable to publish your post.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================================
  // LIKE POST
  // ==========================================================
  const handleLike = async (id) => {
    if (!id) return;

    try {
      const res = await fetchWithTimeout(
        `${API_URL}/api/forum/${encodeURIComponent(id)}/like`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
          },
        },
        15000
      );

      const data = await getResponseData(res);

      if (!res.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            `Unable to like post (${res.status})`
        );
      }

      await fetchPosts();
    } catch (err) {
      console.error("Error liking post:", err);

      setError(
        err.message || "Unable to like this post. Please try again."
      );
    }
  };

  // ==========================================================
  // ADD COMMENT
  // ==========================================================
  const handleComment = async (id) => {
    if (!user) {
      alert("Please login first.");
      return;
    }

    if (!id) return;

    const text = commentText[id]?.trim();

    if (!text) {
      return;
    }

    try {
      const res = await fetchWithTimeout(
        `${API_URL}/api/forum/${encodeURIComponent(id)}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            text,
            author:
              user.name ||
              user.displayName ||
              user.email ||
              "Farmer",
          }),
        },
        15000
      );

      const data = await getResponseData(res);

      if (!res.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            `Unable to add comment (${res.status})`
        );
      }

      setCommentText((previous) => ({
        ...previous,
        [id]: "",
      }));

      await fetchPosts();
    } catch (err) {
      console.error("Error adding comment:", err);

      setError(
        err.message || "Unable to add comment. Please try again."
      );
    }
  };

  // ==========================================================
  // DELETE POST
  // ==========================================================
  const handleDelete = async (id) => {
    if (!id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) return;

    try {
      const res = await fetchWithTimeout(
        `${API_URL}/api/forum/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        },
        15000
      );

      const data = await getResponseData(res);

      if (!res.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            `Unable to delete post (${res.status})`
        );
      }

      await fetchPosts();
    } catch (err) {
      console.error("Error deleting post:", err);

      setError(
        err.message || "Unable to delete post. Please try again."
      );
    }
  };

  // ==========================================================
  // TIME AGO
  // ==========================================================
  const timeAgo = (date) => {
    if (!date) return "";

    const timestamp = new Date(date).getTime();

    if (Number.isNaN(timestamp)) {
      return "";
    }

    const seconds = Math.floor(
      (Date.now() - timestamp) / 1000
    );

    if (seconds < 0) return "just now";

    if (seconds < 60) {
      return "just now";
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 30) {
      return `${days}d ago`;
    }

    const months = Math.floor(days / 30);

    if (months < 12) {
      return `${months}mo ago`;
    }

    const years = Math.floor(months / 12);

    return `${years}y ago`;
  };

  // ==========================================================
  // UI
  // ==========================================================
  return (
    <div
      className="min-vh-100 py-5"
      style={{
        backgroundColor: isDark ? "#121212" : "#f8f9fa",
        color: isDark ? "#fff" : "#212529",
        marginTop: "70px",
      }}
    >
      <div className="container">

        {/* ====================================================
            HEADER
        ==================================================== */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h1 className="display-5 fw-bold text-success mb-1">
              Farmer's Community
            </h1>

            <p className="text-muted lead">
              Connect with fellow farmers. Share knowledge. Grow
              together.
            </p>
          </div>

          {user && (
            <button
              type="button"
              className="btn btn-success btn-lg rounded-pill px-4 shadow"
              onClick={() => {
                setShowForm((previous) => !previous);
                setError("");
              }}
            >
              <i
                className={`bi ${
                  showForm ? "bi-x-lg" : "bi-plus-lg"
                } me-2`}
              ></i>

              {showForm ? "Cancel" : "New Post"}
            </button>
          )}
        </div>

        {/* ====================================================
            CREATE POST FORM
        ==================================================== */}
        {showForm && user && (
          <div
            className={`card shadow-sm mb-5 border-0 rounded-4 ${
              isDark ? "bg-dark" : "bg-white"
            }`}
          >
            <div className="card-body p-4">

              <h4 className="fw-bold text-success mb-3">
                <i className="bi bi-pencil-square me-2"></i>
                Create a Post
              </h4>

              <form onSubmit={handleCreatePost}>

                <input
                  type="text"
                  className={`form-control mb-3 ${
                    isDark
                      ? "bg-black text-light border-secondary"
                      : ""
                  }`}
                  placeholder="Post Title (e.g. How to deal with leaf curl in tomatoes?)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={200}
                  required
                />

                <textarea
                  className={`form-control mb-3 ${
                    isDark
                      ? "bg-black text-light border-secondary"
                      : ""
                  }`}
                  rows="4"
                  placeholder="Share your experience, ask a question, or give advice..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  maxLength={5000}
                  required
                />

                <button
                  type="submit"
                  className="btn btn-success px-4 rounded-pill fw-bold"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send me-2"></i>
                      Publish Post
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ====================================================
            LOGIN MESSAGE
        ==================================================== */}
        {!user && (
          <div className="alert alert-warning text-center rounded-4 shadow-sm mb-4">
            <i className="bi bi-person-lock me-2"></i>

            Please{" "}
            <a
              href="/login"
              className="fw-bold text-dark"
            >
              login
            </a>{" "}
            to create posts and join the community discussion.
          </div>
        )}

        {/* ====================================================
            ERROR MESSAGE
        ==================================================== */}
        {error && (
          <div
            className="alert alert-danger d-flex justify-content-between align-items-center"
            role="alert"
          >
            <span>{error}</span>

            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={fetchPosts}
              disabled={loading}
            >
              Retry
            </button>
          </div>
        )}

        {/* ====================================================
            LOADING
        ==================================================== */}
        {loading ? (
          <div
            className="text-center py-5 text-muted"
            role="status"
          >
            <div
              className="spinner-border text-success mb-3"
              role="status"
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <div>Loading community posts...</div>
          </div>
        ) : posts.length === 0 ? (

          /* ==================================================
             NO POSTS
          ================================================== */
          <div className="text-center py-5 text-muted">
            <i
              className="bi bi-chat-dots"
              style={{ fontSize: "4rem" }}
            ></i>

            <h4 className="mt-3">
              No posts yet. Be the first to start a
              conversation!
            </h4>
          </div>

        ) : (

          /* ==================================================
             POSTS
          ================================================== */
          posts.map((post) => (
            <div
              key={post._id}
              className={`card shadow-sm mb-4 border-0 rounded-4 ${
                isDark ? "bg-dark" : "bg-white"
              }`}
            >
              <div className="card-body p-4">

                {/* ==========================================
                    POST HEADER
                ========================================== */}
                <div className="d-flex justify-content-between align-items-start mb-3">

                  <div className="d-flex align-items-center gap-3">

                    <div
                      className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold"
                      style={{
                        width: "45px",
                        height: "45px",
                        fontSize: "1.2rem",
                      }}
                    >
                      {post.author
                        ?.charAt(0)
                        ?.toUpperCase() || "F"}
                    </div>

                    <div>
                      <h6 className="fw-bold mb-0">
                        {post.author || "Farmer"}
                      </h6>

                      <small className="text-muted">
                        {timeAgo(post.createdAt)}
                      </small>
                    </div>
                  </div>

                  {/* ========================================
                      DELETE BUTTON
                  ======================================== */}
                  {user &&
                    String(user.id || user.uid) ===
                      String(post.authorId) && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm rounded-pill"
                        onClick={() =>
                          handleDelete(post._id)
                        }
                        title="Delete post"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    )}
                </div>

                {/* ==========================================
                    POST CONTENT
                ========================================== */}
                <h5 className="fw-bold text-success">
                  {post.title}
                </h5>

                <p
                  className="mb-3"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {post.body}
                </p>

                {/* ==========================================
                    ACTIONS
                ========================================== */}
                <div className="d-flex gap-3 border-top pt-3">

                  <button
                    type="button"
                    className="btn btn-outline-success btn-sm rounded-pill"
                    onClick={() =>
                      handleLike(post._id)
                    }
                  >
                    <i className="bi bi-hand-thumbs-up me-1"></i>

                    {post.likes || 0} Likes
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm rounded-pill"
                    onClick={() =>
                      setExpandedPost(
                        expandedPost === post._id
                          ? null
                          : post._id
                      )
                    }
                  >
                    <i className="bi bi-chat-dots me-1"></i>

                    {post.comments?.length || 0} Comments
                  </button>
                </div>

                {/* ==========================================
                    COMMENTS
                ========================================== */}
                {expandedPost === post._id && (
                  <div className="mt-3 pt-3 border-top">

                    {/* Existing comments */}
                    {post.comments?.length > 0 ? (
                      post.comments.map((comment, index) => (
                        <div
                          key={
                            comment._id ||
                            `${post._id}-${index}`
                          }
                          className={`p-2 px-3 rounded-3 mb-2 ${
                            isDark
                              ? "bg-black"
                              : "bg-light"
                          }`}
                        >
                          <strong className="text-success">
                            {comment.author || "Farmer"}
                          </strong>

                          <small className="text-muted ms-2">
                            {timeAgo(comment.createdAt)}
                          </small>

                          <p className="mb-0 mt-1">
                            {comment.text}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted mb-2">
                        No comments yet.
                      </p>
                    )}

                    {/* Add comment */}
                    {user && (
                      <div className="d-flex gap-2 mt-2">

                        <input
                          type="text"
                          className={`form-control form-control-sm ${
                            isDark
                              ? "bg-black text-light border-secondary"
                              : ""
                          }`}
                          placeholder="Write a comment..."
                          value={
                            commentText[post._id] || ""
                          }
                          onChange={(e) =>
                            setCommentText((previous) => ({
                              ...previous,
                              [post._id]:
                                e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleComment(post._id);
                            }
                          }}
                          maxLength={1000}
                        />

                        <button
                          type="button"
                          className="btn btn-success btn-sm rounded-pill px-3"
                          onClick={() =>
                            handleComment(post._id)
                          }
                        >
                          <i className="bi bi-send"></i>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Forum;