import axios from 'axios';
import { BASE_URL } from './../config/index';
// 1. How long can make a call
export const getCallDuration = async (userPhone) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/traditional-transactions/user/${userPhone}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 2. Send SMS
export const sendSms = async (sender, receiver, content) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/traditional-transactions/sms`, null, {
      params: { sender, receiver, content }
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 3. Voice call
export const makeVoiceCall = async (sender, receiver, duration) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/traditional-transactions/call`, null, {
      params: { sender, receiver, duration }
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 4. Consume internet
export const consumeInternet = async (consumer, dataSize) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/traditional-transactions/internet`, null, {
      params: { consumer, dataSize }
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 5. Consume Data (duplicate of consumeInternet)
export const consumeData = async (consumer) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/traditional-transactions/consumeData`, null, {
      params: { consumer }
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 6. Set internet package
export const setInternetPackage = async (internetPackagePrice) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/traditional-packages/internet`, { internetPackagePrice });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 7. Set voice package
export const setVoicePackage = async (voicePackagePrice) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/traditional-packages/voice`, { voicePackagePrice });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 8. Set SMS package
export const setSmsPackage = async (smsPackagePrice) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/traditional-packages/sms`, { smsPackagePrice });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 9. Register user
export const registerUser = async (name, balance, nin) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/traditional-users/register`, {
      name,
      balance,
      nin
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 10. Get user details
export const getUserDetails = async (MSISDN) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/traditional-users/userDetails`, {
      params: { MSISDN }
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 11. Get all users
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/traditional-users/allUsers`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 12. Generate random users
export const generateRandomUsers = async (count) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/traditional-users/generate/${count}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 13. Update user balance
export const updateUserBalance = async (MSISDN, newBalance) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/v1/traditional-users/updateUserBalance`, null, {
      params: { MSISDN, newBalance }
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
