import React from "react";
import "./navNewUser.css";

const NavNewUser = () => (
  <navwrap>
  <div className="brand">The CryptoShop</div>
    <div className="nav justify-content-end">
      <ul className="nav">
        <li className="nav-item">
          <button className="btn-primary nav-link" href="#">Register</button>
        </li>
        <li className="nav-item">
          <button className="btn-primary nav-link" href="#">Sign In</button>
        </li>
      </ul>
    </div>
  </navwrap>
);

export default NavNewUser;
