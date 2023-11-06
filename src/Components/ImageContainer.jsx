import { useEffect, useState } from "react";

const ImageContainer = () => {
  // State hooks
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  useEffect(() => {
    // Handle deletion of selected images
    const handleDelete = () => {
      const updatedImages = images.filter((image) => !image.selected);
      setImages(updatedImages);
      setSelectedImages([]);
      setShowCheckbox(false);
    };

    // Attach event listener for delete button click
    document.addEventListener("keydown", handleDelete);

    // Cleanup event listener
    return () => {
      document.removeEventListener("keydown", handleDelete);
    };
  }, [images]);

  // Function to handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImages([...images, { src: reader.result, selected: false }]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to handle image selection
  const handleImageSelect = (index) => {
    const clickTime = new Date().getTime();
    const timeThreshold = 300;

    if (clickTime - lastClickTime < timeThreshold) {
      // Double click
      const updatedImages = [...images];
      updatedImages[index].selected = false;
      setImages(updatedImages);
    } else {
      // Single click
      const updatedImages = [...images];
      updatedImages[index].selected = !updatedImages[index].selected;
      setImages(updatedImages);
      setShowCheckbox(true);
    }

    setLastClickTime(clickTime);

    const selected = images.filter((image) => image.selected);
    setSelectedImages(selected);
  };

  // Function to handle drag start
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  // Function to handle drag over
  const handleDragOver = (e, index) => {
    e.preventDefault();
    setOverIndex(index);
  };

  // Function to handle drop
  const handleDrop = () => {
    const updatedImages = [...images];
    const draggedImage = updatedImages[draggedIndex];
    updatedImages.splice(draggedIndex, 1);
    updatedImages.splice(overIndex, 0, draggedImage);

    setImages(updatedImages);
    setDraggedIndex(null);
    setOverIndex(null);
  };

  // Function to handle delete button click
  const handleDeleteButtonClick = () => {
    const updatedImages = images.filter((image) => !image.selected);
    setImages(updatedImages);
    setSelectedImages([]);
    setShowCheckbox(false);
  };

  // Function to handle checkbox change
  const handleCheckboxChange = () => {
    const updatedImages = images.map((image) => ({
      ...image,
      selected: true,
    }));
    setImages(updatedImages);
    setSelectedImages(images);
  };

  return (
    <div className="text-left mt-5">
      {/* Selected Images Section */}
      <div className="mb-3 grid grid-cols-2 items-end">
        <div>
          <span className="text-lg font-bold text-gray-700 col-span-1">
            Selected Images: {selectedImages.length}
          </span>
          {selectedImages.length > 0 && (
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-white cursor-pointer ml-2 col-span-1 justify-self-center"
              checked={selectedImages.length > 0}
              onChange={handleCheckboxChange}
            />
          )}
        </div>

        <div>
          {selectedImages.length > 0 && (
            <button
              onClick={handleDeleteButtonClick}
              className="ml-2 text-right border-none text-red-600 font-semibold rounded col-span-1"
            >
              Delete files
            </button>
          )}
        </div>
      </div>

      {/* Image Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-5 gap-3 w-full mx-auto p-5 border"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {/* Render Images */}
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative group ${
              index === 0 ? "md:row-span-2 md:col-span-2" : ""
            }`}
            onClick={() => handleImageSelect(index)}
            onDoubleClick={() => handleImageSelect(index)}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
          >
            <div
              className={`cursor-pointer border border-gray-300 rounded-lg overflow-hidden ${
                image.selected ? "bg-slate-800" : ""
              }`}
            >
              <img
                src={image.src}
                alt={`Uploaded ${index + 1}`}
                className={`object-cover rounded-lg w-full h-full transition-opacity duration-300 ease-in-out group-hover:opacity-70 ${
                  index === 0 ? "h-2/3 md:h-full" : ""
                }`}
              />
            </div>
            {showCheckbox && (
              <div
                className={`absolute top-2 left-2 opacity-100 ${
                  image.selected ? "opacity-100" : "opacity-0"
                }`}
              >
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-white cursor-pointer"
                  checked={image.selected}
                  onChange={() => handleImageSelect(index)}
                />
              </div>
            )}
          </div>
        ))}

        {/* Upload Image Placeholder */}
        <label
          htmlFor="upload"
          className="w-[210px] h-40 md:h-[210px] p-4 border border-gray-300 rounded-lg flex items-center justify-center cursor-pointer md:col-span-1"
        >
          <input
            type="file"
            id="upload"
            className="hidden"
            onChange={handleImageChange}
          />
          <span className="text-gray-500">Upload Image</span>
        </label>
      </div>
    </div>
  );
};

export default ImageContainer;
