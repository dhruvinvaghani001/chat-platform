import React from "react";

const UserProfile = ({ user: userData }) => {
  return (
    <div>
      <div>
        <div>
          <img src={userData?.avatar} alt="" />
        </div>
        <div className="text-black">
          <h1>Details</h1>
          <h3>username : {userData?.username}</h3>
          <h3>Email : {userData?.email}</h3>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
