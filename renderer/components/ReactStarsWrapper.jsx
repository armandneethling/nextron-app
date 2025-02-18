import React from 'react';
import ReactStars from 'react-rating-stars-component';

const ReactStarsWrapper = ({
  count = 5,
  value = 0,
  edit = true,
  size = 24,
  activeColor = "#ffd700"
}) => {
  return (
    <ReactStars
      count={count}
      value={value}
      edit={edit}
      size={size}
      activeColor={activeColor}
    />
  );
};

export default ReactStarsWrapper;
