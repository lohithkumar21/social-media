import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import fetchPostData from '../../assets/fetchPostData';
import Card from './Card'; // Import the Card component

const CardSection = () => {
  const [cards, setCards] = useState([]);
  const [activeCardId, setActiveCardId] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const fetchedData = await fetchPostData();
      console.log('Fetched Data: ', fetchedData); // Check the fetched data
      setCards(fetchedData);
    };

    loadData();
  }, []);

  // Function to handle card clicks
  const handleCardClick = (id) => {
    setActiveCardId(id === activeCardId ? null : id); // Toggle active state
  };

  return (
    <OptionsContainer>
      {cards.map((card) => (
        <Card
          key={card.documentId} // Ensure a unique key
          img={card.image} // Background image URL
          name={card.name} // Name of the user
          profileImg={card.logo} // Profile image URL
          isActive={card.documentId === activeCardId} // Compare card ID with activeCardId
          onClick={() => handleCardClick(card.documentId)} // Handle click
        />
      ))}
    </OptionsContainer>
  );
};

// Styled-components
const OptionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  overflow: hidden;
  min-width: 600px;
  max-width: 900px;
  width: calc(100% - 100px);
  height: 400px;
  position: relative;

  .credit {
    position: absolute;
    bottom: 20px;
    left: 20px;
    color: inherit;
  }
`;

export default CardSection;
