const API_URL = "http://localhost:5000/api";

export const signupCitizen = async (formData: any) => {
  const response = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Signup failed");
  }
  return response.json();
};

export const loginCitizen = async (credentials: any) => {
  const response = await fetch(`${API_URL}/login/citizen`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Login failed");
  }
  return response.json();
};

export const loginOfficer = async (credentials: any) => {
  const response = await fetch(`${API_URL}/login/officer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Login failed");
  }
  return response.json();
};
