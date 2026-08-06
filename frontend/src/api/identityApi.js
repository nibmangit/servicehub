import client from "./client";

export const identityApi = { 
  getRandomTestFin: async () => {
    const response = await client.get("identity/random-test-fin/");
    return response.data;
  },

  // Submit FIN to verify identity
  verifyFayda: async (fin) => {
    const response = await client.post("identity/verify-fayda/", { fin });
    return response.data;
  },
   
  checkStatus: async () => {
    const response = await client.get("identity/status/");
    return response.data;
  }
};