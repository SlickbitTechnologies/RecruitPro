import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Modal,
  Backdrop,
  Tooltip,
  Skeleton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SendIcon from "@mui/icons-material/Send";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";

import { toast } from "react-toastify";
import {
  candidateResume,
  getCandidateResumes,
  deleteCandidate,
} from "../services/services";
import "./CandidatesPage.css";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function CandidatesPage() {
  const [resumeFiles, setResumeFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const hasFetched = useRef(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedResumeUrl, setSelectedResumeUrl] = useState(null);
  const [showFull, setShowFull] = useState(false);
  const fileInputRef = useRef(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const toggleShow = () => setShowFull((prev) => !prev);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const data = await getCandidateResumes();
        setCandidates(data);
      } catch (err) {
        toast.error("Failed to fetch candidates.");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteCandidate(id);
      toast.success("Candidate deleted successfully");
      setCandidates((prev) => prev.filter((c) => c.candidate_id !== id));
    } catch (err) {
      toast.error("Failed to delete candidate.");
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    setDeleteOpen(false);
    if (deleteId) {
      await handleDelete(deleteId);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteOpen(false);
    setDeleteId(null);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 2) {
      toast.warning("You can upload a maximum of 2 files.");
      return;
    }
    const invalidFiles = files.filter(
      (file) => file.type !== "application/pdf"
    );
    if (invalidFiles.length > 0) {
      toast.warning("Only PDF files are allowed.");
      return;
    }
    setResumeFiles(files);
  };

  const handleSubmit = async () => {
    if (resumeFiles.length === 0) {
      toast.warning("Please select one or more resumes to upload.");
      return;
    }
    try {
      setUploading(true);
      toast.info("Uploading and analyzing resumes...");
      await candidateResume(resumeFiles);
      toast.success("Resumes processed successfully!");
      const updated = await getCandidateResumes();
      setCandidates(updated);
      setResumeFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error("Upload failed. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box className="candidates-root">
      <Box className="candidates-header">
        <Box>
          <Typography variant="h5" className="candidates-title">
            <b>Candidates</b>
          </Typography>
          <Typography variant="body2" className="candidates-subtitle">
            Manage and review candidate applications
          </Typography>
        </Box>
      </Box>

      <Box className="candidates-controls">
        <Box className="upload-card">
          <label className="upload-dropzone">
            <CloudUploadIcon className="upload-dropzone-icon" />
            <span className="upload-dropzone-text">Upload PDF (Max 2)</span>
            <input
              type="file"
              hidden
              multiple
              accept=".pdf"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </label>
          <Button
            className="modern-submit-btn"
            onClick={handleSubmit}
            disabled={uploading}
            sx={{ color: "#fff", textTransform: "none", fontWeight: "600" }}
            endIcon={
              <SendIcon style={{ fontSize: "1.10rem", color: "#fff" }} />
            }
          >
            {uploading ? "Uploading" : "Submit"}
          </Button>
        </Box>

        {resumeFiles.length > 0 && (
          <Box mt={1} sx={{ maxHeight: 100, overflowY: "auto" }}>
            {resumeFiles.map((file, idx) => (
              <Typography
                key={idx}
                variant="body2"
                sx={{
                  fontSize: "0.85rem",
                  color: "#555",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 300,
                }}
              >
                📄 {file.name}
              </Typography>
            ))}
          </Box>
        )}
      </Box>

      {candidates.length === 0 ? (
        <Box
          className="no-candidates-box"
          sx={{ textAlign: "center", py: 8, color: "#7a7a7a" }}
        >
          <PeopleAltOutlinedIcon
            sx={{ fontSize: 64, color: "#bdbfff", mb: 2 }}
          />
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#4f8cff", mb: 1 }}
          >
            No Candidates Found
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Upload resumes to get started!
          </Typography>
        </Box>
      ) : (
        <>
          <Box className="candidates-count-row">
            <Typography variant="body2" className="candidates-count">
              Showing <b>{candidates.length}</b> of <b>{candidates.length}</b>{" "}
              candidates
            </Typography>
          </Box>

          <Box className="candidates-list">
            {loading || uploading
              ? Array.from({ length: 3 }).map((_, idx) => (
                  <Card
                    key={`skeleton-${idx}`}
                    className="candidate-card"
                    elevation={0}
                  >
                    <CardContent className="candidate-card-content">
                      <Skeleton variant="circular" width={40} height={40} />
                      <Box
                        className="candidate-info"
                        sx={{ width: "100%", ml: 2 }}
                      >
                        <Skeleton variant="text" width="40%" height={28} />
                        <Skeleton variant="text" width="60%" height={20} />
                        <Skeleton
                          variant="rectangular"
                          width="100%"
                          height={60}
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                ))
              : candidates.map((c, index) => (
                  <motion.div
                    key={c.candidate_id || c.id || c.name}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Card className="candidate-card" elevation={0}>
                      <CardContent className="candidate-card-content">
                        <Avatar className="candidate-avatar">
                          {c.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </Avatar>
                        <Box className="candidate-info">
                          <Box className="candidate-header">
                            <Typography
                              variant="subtitle1"
                              className="candidate-name"
                            >
                              <b>{c.name}</b>
                            </Typography>
                          </Box>
                          <Typography
                            variant="body1"
                            className="candidate-role"
                            sx={{ fontWeight: 600, color: "#2563eb" }}
                          >
                            {c.designation}
                          </Typography>
                          <Typography
                            variant="body2"
                            className="candidate-desc"
                            sx={{
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: showFull ? "unset" : 2,
                              WebkitBoxOrient: "vertical",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {c.professional_summary}
                          </Typography>
                          {c.professional_summary?.length > 150 && (
                            <Typography
                              variant="body2"
                              color="primary"
                              sx={{ cursor: "pointer", mt: 0.5 }}
                              onClick={toggleShow}
                            >
                              {showFull ? "Show less" : "Show more"}
                            </Typography>
                          )}
                          <Box className="candidate-meta">
                            <Typography
                              variant="body2"
                              className="candidate-meta-item"
                            >
                              {c.email}
                            </Typography>
                            <Typography
                              variant="body2"
                              className="candidate-meta-item"
                            >
                              {c.contact_number}
                            </Typography>
                            <Typography
                              variant="body2"
                              className="candidate-meta-item"
                            >
                              {c.location || c.Location}
                            </Typography>
                          </Box>
                          <Box className="candidate-tags">
                            {c.technical_skills?.map((tag) => (
                              <Chip
                                key={tag}
                                label={tag}
                                className="candidate-tag"
                              />
                            ))}
                          </Box>
                          <Typography
                            variant="body2"
                            className="candidate-education"
                          >
                            <b>Education:</b> {c.education?.[0]?.degree} –{" "}
                            {c.education?.[0]?.institution}
                          </Typography>
                        </Box>
                        <Box className="candidate-score-col">
                          <Box className="candidate-actions">
                            <Tooltip title="View Resume" arrow>
                              <IconButton
                                onClick={() => {
                                  setSelectedResumeUrl(c.resume_url);
                                  setOpenModal(true);
                                }}
                              >
                                <DescriptionOutlinedIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Candidate" arrow>
                              <IconButton
                                onClick={() =>
                                  handleDeleteClick(c.candidate_id)
                                }
                              >
                                <DeleteOutlineOutlinedIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
          </Box>
        </>
      )}

      {/* Resume Preview Modal */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            color: "#222",
            fontSize: "1.13rem",
            borderRadius: 5,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.08rem",
            color: "white",
            backgroundColor: "#4b32c3",
          }}
        >
          Candidate Resume
        </DialogTitle>

        <DialogContent dividers>
          {selectedResumeUrl ? (
            <iframe
              src={selectedResumeUrl}
              title="Resume Preview"
              width="100%"
              height="600px"
              style={{ border: "none" }}
            />
          ) : (
            <Typography>Loading resume...</Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpenModal(false)}
            sx={{ color: "#6c47ff", fontWeight: 600 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {/* Delete Confirmation Modal */}
      <Modal open={deleteOpen} onClose={cancelDelete}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 3,
            p: 4,
            minWidth: 320,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Confirm Delete
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Are you sure you want to delete this candidate?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button variant="contained" color="error" onClick={confirmDelete}>
              Yes
            </Button>
            <Button variant="outlined" onClick={cancelDelete}>
              No
            </Button>
          </Box>
        </Box>
      </Modal>

      {uploading && (
        <Backdrop
          open={true}
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: "#fff" }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </Box>
  );
}
