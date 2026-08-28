import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const DiseaseDetect = () => {
  const { theme } = useTheme();
  const [image, setImage] = useState(null);
  const [mimeType, setMimeType] = useState("");
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Future-proofing for multi-language support (Phase 2 part 2)
  const language = "English"; 

  const isDark = theme === "dark";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file.");
        return;
      }
      
      setMimeType(file.type);
      setError("");
      setResult("");
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const response = await fetch("http://localhost:5000/api/vision/disease-detect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image,
          mimeType,
          language
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.result);
      } else {
        setError(data.error || "Failed to analyze image. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: isDark ? "#121212" : "#f8f9fa", color: isDark ? "#fff" : "#212529", marginTop: "70px", transition: "all 0.3s" }}>
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-success mb-3">AI Crop Disease Detection</h1>
          <p className="lead text-muted">Upload a photo of your crop, leaf, or plant. Our AI will analyze it to detect diseases, pests, or nutrient deficiencies and recommend a treatment.</p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className={`card shadow-lg border-0 rounded-4 overflow-hidden ${isDark ? 'bg-dark' : 'bg-white'}`}>
              <div className="card-body p-5">
                
                {/* Upload Area */}
                <div className={`p-5 mb-4 text-center rounded-4 border ${isDark ? 'border-secondary bg-black' : 'border-light bg-light'} position-relative`} style={{ borderStyle: "dashed !important", borderWidth: "2px" }}>
                  {!preview ? (
                    <div>
                      <i className="bi bi-cloud-arrow-up text-success mb-3" style={{ fontSize: "4rem" }}></i>
                      <h4>Upload Crop Image</h4>
                      <p className="text-muted mb-4">Drag and drop or click to browse</p>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange}
                        className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                        style={{ cursor: "pointer" }}
                      />
                      <button className="btn btn-success px-4 rounded-pill">Select File</button>
                    </div>
                  ) : (
                    <div className="position-relative">
                      <img src={preview} alt="Crop preview" className="img-fluid rounded shadow-sm" style={{ maxHeight: "300px", objectFit: "contain" }} />
                      <button 
                        className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle"
                        onClick={() => { setPreview(null); setImage(null); setResult(""); }}
                        style={{ width: "32px", height: "32px" }}
                        title="Remove image"
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="alert alert-danger rounded-3 border-0 shadow-sm">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
                  </div>
                )}

                <div className="text-center mb-4">
                  <button 
                    className="btn btn-success btn-lg px-5 rounded-pill fw-bold shadow" 
                    onClick={handleAnalyze}
                    disabled={!image || loading}
                    style={{ minWidth: "200px" }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Analyzing with AI...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-magic me-2"></i> Analyze Crop
                      </>
                    )}
                  </button>
                </div>

                {/* AI Result Area */}
                {result && (
                  <div className={`p-4 mt-4 rounded-4 shadow-sm border ${isDark ? 'bg-black border-success' : 'bg-success bg-opacity-10 border-success'}`}>
                    <h4 className="fw-bold text-success mb-3">
                      <i className="bi bi-check-circle-fill me-2"></i> AI Diagnosis
                    </h4>
                    <div className="fs-5" style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
                      {result}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetect;
