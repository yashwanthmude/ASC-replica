import React, { useState } from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Navbar from './nav';
export default function Instructor() {
    const [instructor_info, setInstructor_info] = useState([]);
    const [instructor_course, setInstructor_course] = useState([]);
    const [course_prev, setCourse_prev] = useState([]);
    const {instructor_id} = useParams()
    


    useEffect(() => {
        axios.get('http://localhost:5000/instructor/' + instructor_id,{withCredentials: true})
            .then(res => {
                
                setInstructor_course(res.data.instructor_course)
                setInstructor_info(res.data.instructor_info)
                setCourse_prev(res.data.course_prev)

            })
            .catch(err => {
                if(err.response.status===401){
                    window.location.href = "/login";
                }
            })
    }, [])

    return (
    
        <div className="instructor">
            <Navbar/>
            <h1>Instructor Information</h1>
            <div className="instructor-info">
                {instructor_info.map(info => (
                    <div key={info.instructor_id}>
                        <h2>{info.instructor_id}</h2>
                        <p>{info.name}</p>
                        <p>{info.dept_name}</p>
                
                </div>
                ))}
            </div>
            <div className="instructor-courses">
                <h2>Running Courses</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Course ID</th>
                            <th>Course Name</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {instructor_course.map(course => (
                            <tr key={course.course_id}>
                                <td>
                                    <a href={`/course/${course.course_id}`}>{course.course_id}</a>
                                </td>
                                <td>{course.title}</td>
                                
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

            <div className="previous-courses">
                <h2>Previous Courses</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Course ID</th>
                            <th>Course Name</th>
                            <th>Year</th>
                            <th>Semester</th>
                        </tr>
                    </thead>
                    <tbody>
                        {course_prev.map(course => (
                            <tr key={course.course_id}>
                                <td>
                                    <a href={`/course/${course.course_id}`}>{course.course_id}</a>
                                </td>
                                <td>{course.title}</td>
                                <td>{course.year}</td>
                                <td>{course.semester}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

    );
}