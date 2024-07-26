import React from "react";
import UserLinks from "./UserLinks";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center border-b border-gray-100 w-full px-10 py-2 relative">
      <Link to="/">
        <div style={{ display: 'flex', alignItems: 'center', marginRight: 'auto' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '12px 48px',
              color: '#ffffff',
              background: 'linear-gradient(to right, #4d4d4d 0, white 10%, #4d4d4d 20%)',
              backgroundPosition: '0',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'shine 3s infinite linear',
              animationFillMode: 'forwards',
              fontWeight: '600',
              fontSize: '20px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              fontFamily: 'Poppins, sans-serif',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
            }}
          >
            Connectify
          </span>
        </div>
      </Link>
      <div>
        <UserLinks />
      </div>
      <style>
        {`
          @keyframes shine {
            0% {
              background-position: 0;
            }
            60% {
              background-position: 180px;
            }
            100% {
              background-position: 180px;
            }
          }
          
          body {
            background: black;
            font-family: 'Poppins', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        `}
      </style>
    </div>
  );
};

export default Navbar;
