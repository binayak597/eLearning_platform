import { useEffect, useState } from "react";
import "./lecture.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import Loading from "../../components/loading/Loading";
import toast from "react-hot-toast";
import { TiTick } from "react-icons/ti";

const Lecture = ({ user }) => {
  const [lectures, setLectures] = useState([]);
  const [lecture, setLecture] = useState({});
  const [loading, setLoading] = useState(true);
  const [lecLoading, setLecLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [video, setVideo] = useState("");
  const [videoPreview, setVideoPreview] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const [completed, setCompleted] = useState("");
  const [completedLec, setCompletedLec] = useState("");
  const [lecLength, setLecLength] = useState("");
  const [progress, setProgress] = useState([]);

  const params = useParams();
  const navigate = useNavigate();

  if (user && user.role !== "admin" && !user.subscription.includes(params.courseId))
    return navigate("/");

  async function fetchLectures() {
    try {
      const { data } = await axios.get(`/api/course/lectures/${params.courseId}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      if(data.error) throw new Error(data.error);
      setLectures(data.lectures);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  }

  async function fetchLecture(id) {
    setLecLoading(true);
    try {
      const { data } = await axios.get(`/api/course/lecture/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      if(data.error) throw new Error(data.error);
      setLecture(data.lecture);
      setLecLoading(false);
    } catch (error) {
      console.log(error.message);
      setLecLoading(false);
    }
  }

  useEffect(() => {
    fetchLectures();
    fetchProgress();
  }, []);

  const changeVideoHandler = (ev) => {
    const file = ev.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setVideoPreview(reader.result);
      setVideo(file);
    };
  };

  const submitHandler = async (ev) => {
    setBtnLoading(true);
    ev.preventDefault();
    const myForm = new FormData();

    myForm.append("title", title);
    myForm.append("description", desc);
    myForm.append("file", video);

    try {
      const { data } = await axios.post(
        `/api/admin/course/${params.courseId}`,
        myForm,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if(data.error) throw new Error(data.error);
      toast.success(data.message);
      setBtnLoading(false);
      setShow(false);
      fetchLectures();
      setTitle("");
      setDesc("");
      setVideo("");
      setVideoPreview("");
    } catch (error) {
      toast.error(error.message);
      setBtnLoading(false);
    }
  };

  const addProgress = async (id) => {
    try {
      const { data } = await axios.post(
        `/api/user/add-progress?courseId=${params.courseId}&lectureId=${id}`,
        {},
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      console.log(data.message);
      fetchProgress();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProgress = async () => {

    try {
      const { data } = await axios.get(
        `/api/user/get-progress?courseId=${params.courseId}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      setCompleted(data.courseProgressPercentage);
      setCompletedLec(data.completedLectures);
      setLecLength(data.allLectures);
      setProgress(data.progress);
    } catch (error) {
      console.log(error);
    }

  }

  const deleteHandler = async (id) => {
    if (confirm("Are you sure want to delete this lecture?")) {
      try {
        const { data } = await axios.delete(`/api/admin/lecture/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });

        if(data.error) throw new Error(data.error);
        toast.success(data.message);
        fetchLectures();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
        <div className="progress">
            Lecture completed - {completedLec} out of {lecLength} <br />
            <progress value={completed} max={100}></progress> {completed} %
          </div>
          <div className="lecture-page">
            <div className="left">
              {lecLoading ? (
                <Loading />
              ) : (
                <>
                
                  {lecture.video ? (
                    <>
                      <video
                        src={`${server}/${lecture.video}`}
                        width={"100%"}
                        controls
                        controlsList="nodownload noremoteplayback"
                        disablePictureInPicture
                        disableRemotePlayback
                        autoPlay
                        onEnded={() => addProgress(lecture._id)}
                      ></video>
                      <h1>{lecture.title}</h1>
                      <h3>{lecture.description}</h3>
                    </>
                  ) : (
                    <h1>Please Select a Lecture</h1>
                  )}
                </>
              )}
            </div>
            <div className="right">
              {user && user.role === "admin" && (
                <button className="btn" onClick={() => setShow(!show)}>
                  {show ? "Close" : "Add Lecture +"}
                </button>
              )}

              {show && (
                <div className="lecture-form">
                  <h2>Add Lecture</h2>
                  <form onSubmit={submitHandler}>
                    <label htmlFor="text">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(ev) => setTitle(ev.target.value)}            
                      required
                    />

                    <label htmlFor="text">Description</label>
                    <input
                      type="text"
                      value={desc}
                      onChange={(ev) => setDesc(ev.target.value)}
                      required
                    />

                    <input
                      type="file"
                      placeholder="choose video"
                      onChange={changeVideoHandler}
                      required
                    />
                    {videoPreview && (
                      <video
                        src={videoPreview}
                        alt=""
                        width={300}
                        controls
                      ></video>
                    )}

                    <button
                      disabled={btnLoading}   
                      className="btn"
                    >
                      {btnLoading ? "Loading" : "Add"}
                    </button>
                  </form>
                </div>
              )}

              {lectures && lectures.length > 0 ? (
                lectures.map((l, idx) => (
                  <>
                    <div
                      onClick={() => fetchLecture(l._id)}
                      key={idx}
                      className={`lecture-number ${
                        lecture._id ===l._id && "active"
                      }`}
                    >
                      {idx + 1}. {l.title}{" "}
                      {progress[0] &&
                        progress[0]?.completedLectures.includes(l._id) && (
                          <span
                            style={{
                              background: "black",
                              padding: "2px",
                              borderRadius: "6px",
                              color: "green",
                            }}
                          >
                            <TiTick />
                          </span>
                        )}
                    </div>
                    {user && user.role === "admin" && (
                      <button
                        className="btn"
                        style={{ background: "red" }}
                        onClick={() => deleteHandler(l._id)}
                      >
                        Delete {l.title}
                      </button>
                    )}
                  </>
                ))
              ) : (
                <p>No Lectures Yet!</p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Lecture;
