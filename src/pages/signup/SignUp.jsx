import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import VanillaTilt from 'vanilla-tilt';
import axios from "axios";

const SignUp = () => {

    const navigate = useNavigate();

    const [inputs, setInputs] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
    })

    const [err, setErr] = useState(null)

    const handleChange = e =>{
        setInputs(prev=>({...prev, [e.target.name]: e.target.value}))
    }

    const handleClick = async e => {
        e.preventDefault()

        try {
            await axios.post("http://localhost:3002/users/signup",inputs);
            navigate("/login");
        } catch (err) {
            setErr(err.response.data.message);
        }
    }

    const boxRef = useRef(null);

    useEffect(() => {
        VanillaTilt.init(boxRef.current, {
            max: 25,
            speed: 400,
            glare: true,
        });
    }, []);

    return (
        <div className="signup login-signup">
            <div className="box" ref={boxRef}>
                <div className="elements form"></div>
                <div className="elements name">
                    <h2>SignUp</h2>
                </div>
                <div className="elements content">
                    <form action="">
                        <input type="text" placeholder="First Name" name="firstName" onChange={handleChange}/>
                        <input type="text" placeholder="Last Name" name="lastName" onChange={handleChange}/>
                        <input type="email" placeholder="Email" name="email" onChange={handleChange}/>
                        <input type="number" placeholder="Phone Number" name="phoneNumber" onChange={handleChange}/>
                        <input type="password" placeholder="Password" name="password" onChange={handleChange}/>
                        {err && err}
                        <button onClick={handleClick}>Sign Up</button>
                        <p style={{ fontSize: "10px", marginTop: "12px" }}> Already have an account? <Link to="/login"><span>Login</span></Link></p>
                    </form>
                </div>
                <div className="card"></div>
            </div>
        </div>
    )
}

export default SignUp;