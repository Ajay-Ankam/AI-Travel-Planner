// This is a placeholder for when you add Unsplash or Google Places API
export const getPlaceImage = async (placeName) => {
  // Logic to fetch a photo URL based on the name provided by Gemini
  return `https://source.unsplash.com/featured/?${encodeURIComponent(placeName)}`;
};
