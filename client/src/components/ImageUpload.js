import React from "react";

function ImageUpload({ onImageChange }) {
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      onImageChange(imageURL, file);
    }
  };

  return (
    <div style={{ margin: "1rem" }}>
      <input type="file" accept="image/*" onChange={handleChange} />
    </div>
  );
}

export default ImageUpload;
