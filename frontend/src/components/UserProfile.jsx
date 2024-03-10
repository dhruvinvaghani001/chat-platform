import React from "react";

const UserProfile = ({ user: userData }) => {
  return (
    <div className="mt-4">
      <div className="flex flex-col justify-center items-center gap-4">
        <div>
          <img src={userData?.avatar} alt="" width={300} className="rounded-full"/>
        </div>
        <div className="text-black">
          <h3 className="text-xl flex justify-center">{userData?.username}</h3>
          <h3 className="text-xl flex justify-center">{userData?.email}</h3>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
