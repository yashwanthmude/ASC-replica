import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "./home.css";
import "./nav.css";
import Navbar from "./nav.jsx";

export default function Registration() {
    const [allCourses, setAllCourses] = useState([]);


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/registration/add", {
                course_id: event.target.value,
                sec_id: allCourses[0].sec_id,
                year: allCourses[0].year,
                semester: allCourses[0].semester,

            }, { withCredentials: true });
            if (response.status === 200) {
                // refresh the page

                window.location.href = "/home/registration";
            }
        } catch (e) {
            if (e.response.status === 401) {
                window.location.href = "/login";
            }
        }
    };













    useEffect(() => {
        axios.get("http://localhost:5000/registration/all", { withCredentials: true })
            .then((res) => {
                setAllCourses(res.data);
                console.log(allCourses);
            });
    }, []);
    return (
        <div className="registration">
            <Navbar />
            <h1>Registration</h1>
            <div className="all-courses">
                <table>
                    <thead>
                        <tr>
                            <th>Course ID</th>
                            <th>Title</th>
                            <th>Year</th>
                            <th>Semester</th>
                            <th>sec_id</th>
                            <th>Enroll</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allCourses.map((course) => (
                            <tr key={course.course_id}>
                                <td>
                                    <a href={`/course/${course.course_id}`}>
                                        {course.course_id}
                                    </a>
                                </td>
                                <td>{course.title}</td>
                                <td>{course.year}</td>
                                <td>{course.semester}</td>
                                <td>{course.sec_id}</td>
                                <td>
                                    <button
                                        className="enroll"
                                        value={course.course_id}
                                        onClick={handleSubmit}
                                    >
                                        Enroll
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
}



