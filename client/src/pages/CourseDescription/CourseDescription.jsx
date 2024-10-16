
import { useEffect, useState } from "react";
import { useCourseContext } from "../../context/CourseContext";
import "./coursedesc.css";
import { useNavigate, useParams } from "react-router-dom";
import { server } from "../../main";
import Loading from "../../components/loading/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../../context/UserContext";

const CourseDescription = ({ user }) => {

  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const {fetchUser} = useAuthContext();
  const { fetchCourse, course, fetchCourses, fetchSubscribedCourses } = useCourseContext();

  useEffect(() => {
    fetchCourse(params.courseId);
  }, []);


  const checkoutHandler = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    const {
      data: { order },
    } = await axios.post(
      `/api/course/checkout/${params.courseId}`,
      {},
      {
        headers: {
          token,
        },
      }
    );

    const options = {
      key: "rzp_test_yOMeMyaj2wlvTt", // Enter the Key ID generated from the Dashboard
      amount: order.id, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "E learning", //your business name
      description: "Learn with us",
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1

      handler: async function (response) {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
          response;

        try {
          const { data } = await axios.post(
            `/api/course/verification/${params.courseId}`,
            {
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
            },
            {
              headers: {
                token,
              },
            }
          );

          await fetchUser();
          await fetchCourses();
          await fetchSubscribedCourses();
          toast.success(data.message);
          setLoading(false);
          navigate(`/payment-success/${razorpay_payment_id}`);
        } catch (error) {
          toast.error(error.response.data.message);
          setLoading(false);
        }
      },
      theme: {
        color: "#8a4baf",
      },
    };
    const razorpay = new window.Razorpay(options);

    razorpay.open();
  };

  const handleBuyCourse = async() => {

    setLoading(true);
    try {
      const {data} = await axios.post(`/api/course/buy-course/${params.courseId}`, {}, {
        headers: {
          token: localStorage.getItem("token")
        }
      });
      console.log(data);
      await fetchUser();
      await fetchCourses();
      await fetchSubscribedCourses();
      setLoading(false);
      toast.success(data.message);
      navigate(`/${user._id}/dashboard`);
      
    } catch (error) {
      toast.error(error);
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <>
      {loading ? <Loading />: (
        <>
          {course && (
            <div className="course-description">
              <div className="course-header">
                <img
                  src={`${server}/${course.image}`}
                  alt=""
                  className="course-image"
                />
                <div className="course-info">
                  <h2>{course.title}</h2>
                  <p>Instructor: {course.createdBy}</p>
                  <p>Duration: {course.duration} weeks</p>
                </div>
              </div>

              <p>{course.description}</p>

              <p>Let's get started with course At ₹{course.price}</p>

              {user && user.subscription.includes(course._id) ? (
                <button
                  onClick={() => navigate(`/course/study/${course._id}`)}
                  className="btn"
                >
                  Start
                </button>
              ) : (
                <button onClick={handleBuyCourse} className="btn">
                  Buy Now
                </button>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CourseDescription;
