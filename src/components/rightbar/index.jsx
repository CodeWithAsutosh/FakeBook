import React, { useEffect, useState } from 'react';
import './rightbar.scss';
const baseURL = process.env.REACT_APP_BASE_URL;
const userId = localStorage.getItem('userId');
const accessToken = localStorage.getItem('token');

const Rightbar = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {

    const payload = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
    }

    let result = await fetch(`${baseURL}/relationships/peopleSuggestion`, payload)
    result = await result.json();
    if (result.status === true) {
      setUsers(result?.data)
    } else {
      alert(result.msg)
    }
  }

  const handleclick = async (id) => {

    const payload = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ followerId: id })
    }

    let result = await fetch(`${baseURL}/relationships/add`, payload)
    result = await result.json();
    if (result.status === true) {
      alert(result.msg);
      fetchData();
    } else {
      alert('Something wrong!');
    }
  }

  return (
    <div className='rightBar'>
      <div className="container">
        <div className="item">
          <span>Suggestions For You</span>

          {users.length !== 0 ?
            users.map((key) => {

              return (
                <div className="user" key={key["_id"]}>
                  <div className="userInfo">
                    <img src="/images/avatar.png" alt="" />
                    <span>{key.firstName} {key.lastName}</span>
                  </div>
                  <div className="buttons">
                    <button onClick={() => handleclick(key["_id"])}>Follow</button>
                    <button>Dismiss</button>
                  </div>
                </div>
              )
            })
            :
            <p>No Suggestions</p>
          }



        </div>
        <div className="item">
          <span>Latest Activities</span>
          <div className="user">
            <div className="userInfo">
              <img src="/images/avatar.png" alt="" />
              <p>
                <span>Jane Doe</span> changed their profile picture.
              </p>
            </div>
            <span>1 min ago</span>
          </div>
          <div className="user">
            <div className="userInfo">
              <img src="/images/avatar.png" alt="" />
              <p>
                <span>Jane Doe</span> changed their profile picture.
              </p>
            </div>
            <span>1 min ago</span>
          </div>
          <div className="user">
            <div className="userInfo">
              <img src="/images/avatar.png" alt="" />
              <p>
                <span>Jane Doe</span> changed their profile picture.
              </p>
            </div>
            <span>1 min ago</span>
          </div>
          <div className="user">
            <div className="userInfo">
              <img src="/images/avatar.png" alt="" />
              <p>
                <span>Jane Doe</span> changed their profile picture.
              </p>
            </div>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="item">
          <span>Online Friends</span>
          <div className="user">
            <div className="userInfo">
              <img src="/images/avatar.png" alt="" />
              <div className="online" />
              <span>Jane Doe</span>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img src="/images/avatar.png" alt="" />
              <div className="online" />
              <span>Jane Doe</span>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img src="/images/avatar.png" alt="" />
              <div className="online" />
              <span>Jane Doe</span>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img src="/images/avatar.png" alt="" />
              <div className="online" />
              <span>Jane Doe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Rightbar