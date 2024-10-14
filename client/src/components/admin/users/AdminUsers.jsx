import { useEffect, useState } from "react";
import "./adminusers.css";
import axios from "axios";
import Layout from "../../utils/Layout";
import toast from "react-hot-toast";

const AdminUsers = ({user}) => {

  const [users, setUsers] = useState([]);


  if (user && user.mainRole !== "superadmin") return navigate("/");

  async function fetchUsers() {
    try {
      const { data } = await axios.get("/api/admin/all-users", {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      if(data.error) throw new Error(data.error);

      setUsers(data.users);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id) => {
    if (confirm("are you sure you want to update this user role")) {
      try {
        const { data } = await axios.put(
          `/api/admin/user/${id}`,
          {},
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );

        if(data.error) throw new Error(data.error);
        toast.success(data.message);
        await fetchUsers();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  console.log(users);
  return (
    <Layout>
      <div className="users">
        <h1>All Users</h1>
        <table border={"black"}>
          <thead>
            <tr>
              <td>#</td>
              <td>Name</td>
              <td>Email</td>
              <td>Role</td>
              <td>Update Role</td>
            </tr>
          </thead>

          {users &&
            users.map((u, idx) => (
              <tbody>
                <tr>
                  <td>{idx + 1}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <button
                      onClick={() => updateRole(u._id)}
                      className="common-btn"
                    >
                      Update Role
                    </button>
                  </td>
                </tr>
              </tbody>
            ))}
        </table>
      </div>
    </Layout>
  );
};

export default AdminUsers;
