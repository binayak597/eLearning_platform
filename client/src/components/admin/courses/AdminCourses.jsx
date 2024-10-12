import { useState } from "react";
import Layout from "../../utils/Layout";
import { useNavigate } from "react-router-dom";
import "./admincourses.css";
import toast from "react-hot-toast";
import axios from "axios";
import { useCourseContext } from "../../../context/CourseContext";
import CourseCard from "../../courseCard/CourseCard";

const categories = [
  "Web Development",
  "App Development",
  "Game Development",
  "Data Science",
  "Artificial Intelligence",
];

const AdminCourses = ({ user }) => {
  const navigate = useNavigate();

  if (user && user.role !== "admin") return navigate("/");

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const changeImageHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };

  const { courses, fetchCourses } = useCourseContext();

  const submitHandler = async (ev) => {
    ev.preventDefault();
    setBtnLoading(true);

    const myForm = new FormData();

    myForm.append("title", title);
    myForm.append("description", desc);
    myForm.append("category", category);
    myForm.append("price", price);
    myForm.append("createdBy", createdBy);
    myForm.append("duration", duration);
    myForm.append("file", image);

    try {
      const { data } = await axios.post("/api/admin/course/new", myForm, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      if (data.error) throw new Error(data.error);
      toast.success(data.message);
      setBtnLoading(false);
      await fetchCourses();
      setImage("");
      setTitle("");
      setDesc("");
      setDuration("");
      setImagePreview("");
      setCreatedBy("");
      setPrice("");
      setCategory("");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Layout>
      <div className="admin-courses">
        <div className="left">
          <h1>All Courses</h1>
          <div className="dashboard-content">
            {courses && courses.length > 0 ? (
              courses.map((c) => {
                return <CourseCard key={c._id} course={c} />;
              })
            ) : (
              <p>No Courses Yet</p>
            )}
          </div>
        </div>

        <div className="right">
          <div className="add-course">
            <div className="course-form">
              <h2>Add Course</h2>
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

                <label htmlFor="text">Price</label>
                <input
                  type="Number"
                  value={price}
                  onChange={(ev) => setPrice(ev.target.value)}
                  required
                />

                <label htmlFor="text">createdBy</label>
                <input
                  type="text"
                  value={createdBy}
                  onChange={(ev) => setCreatedBy(ev.target.value)}
                  required
                />

                <select
                  value={category}
                  onChange={(ev) => setCategory(ev.target.value)}
                >
                  <option value={""}>Select Category</option>
                  {categories.map((item, idx) => (
                    <option value={item} key={idx}>
                      {item}
                    </option>
                  ))}
                </select>

                <label htmlFor="text">Duration</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(ev) => setDuration(ev.target.value)}
                  required
                />

                <input type="file" required onChange={changeImageHandler} />
                {imagePreview && <img src={imagePreview} alt="" width={300} />}
                <button disabled={btnLoading} className="btn">
                  {btnLoading ? "Loading" : "Add"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminCourses;
