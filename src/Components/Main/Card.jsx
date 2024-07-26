import React from 'react';
import styled from 'styled-components';

// Styled-component for Card
const CardContainer = styled.div`
  position: relative;
  overflow: hidden;
  min-width: 60px;
  margin: 10px;
  background-image: ${({ $img }) => `url(${$img})`};
  background-size: auto 120%;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  transition: 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95);

  &.active {
    flex-grow: 10000;
    transform: scale(1);
    max-width: 600px;
    margin: 0;
    border-radius: 40px;
    background-size: auto 100%;

    .shadow {
      box-shadow: inset 0 -120px 120px -120px black, inset 0 -120px 120px -100px black;
    }

    .label {
      bottom: 20px;
      left: 20px;

      .info > div {
        left: 0px;
        opacity: 1;
      }
    }
  }

  &:not(.active) {
    flex-grow: 1;
    border-radius: 30px;

    .shadow {
      bottom: -40px;
      box-shadow: inset 0 -120px 0px -120px black, inset 0 -120px 0px -100px black;
    }

    .label {
      bottom: 10px;
      left: 10px;

      .info > div {
        left: 20px;
        opacity: 0;
      }
    }
  }

  .shadow {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 120px;
    transition: 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95);
  }

  .label {
    display: flex;
    position: absolute;
    right: 0;
    height: 40px;
    transition: 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95);

    .icon {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      min-width: 40px;
      max-width: 40px;
      height: 40px;
      border-radius: 100%;
      background-color: white;
      color: black; /* Adjust color if needed */
      background-image: ${({ $profileImg }) => $profileImg ? `url(${$profileImg})` : 'none'};
      background-size: cover;
      background-position: center;
    }

    .info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 10px;
      color: white;
      white-space: pre;

      > div {
        position: relative;
        transition: 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95), opacity 0.5s ease-out;
      }

      .main {
        font-weight: bold;
        font-size: 1.2rem;
      }

      .sub {
        transition-delay: 0.1s;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
`;

// Card Component
const Card = ({ img, name, profileImg, isActive, onClick }) => (
  <CardContainer $img={img} $profileImg={profileImg} className={isActive ? 'active' : ''} onClick={onClick}>
    <div className="shadow"></div>
    <div className="label">
      <div className="icon"></div>
      <div className="info">
        <div className="main">{name}</div>
      </div>
    </div>
  </CardContainer>
);

export default Card;
