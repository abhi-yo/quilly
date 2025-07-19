const API_BASE_URL = "http://localhost:8000";

export const analyzeBlog = async (url) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze/blog/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const analyzePDF = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/analyze/pdf/`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const checkServerHealth = async () => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/docs`);
    return response.ok;
  } catch (error) {
    return false;
  }
};
