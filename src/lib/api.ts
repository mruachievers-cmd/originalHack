const API_URL = "http://localhost:5001/api";

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

// --- DATA METHODS ---

export const getFIRs = async () => {
    const response = await fetch(`${API_URL}/firs`);
    return response.json();
};

export const submitFIR = async (data: any) => {
    const response = await fetch(`${API_URL}/firs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
};

export const getSOSAlerts = async () => {
    const response = await fetch(`${API_URL}/sos`);
    return response.json();
};

export const submitSOS = async (data: any) => {
    const response = await fetch(`${API_URL}/sos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
};

export const getEvidence = async () => {
    const response = await fetch(`${API_URL}/evidence`);
    return response.json();
};

export const submitEvidence = async (data: any) => {
    const response = await fetch(`${API_URL}/evidence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
};

export const getTips = async () => {
    const response = await fetch(`${API_URL}/tips`);
    return response.json();
};

export const submitTip = async (data: any) => {
    const response = await fetch(`${API_URL}/tips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
};

export const updateTipStatus = async (id: string, status: string) => {
    const response = await fetch(`${API_URL}/tips/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    });
    return response.json();
};
