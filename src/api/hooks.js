import { useQuery, useMutation } from 'react-query';
import * as api from './index';

export function useCallDuration(userPhone) {
  return useQuery(['callDuration', userPhone], () => api.getCallDuration(userPhone));
}

export function useSendSms() {
  return useMutation(({ sender, receiver, content }) => api.sendSms(sender, receiver, content));
}

export function useMakeVoiceCall() {
  return useMutation(({ sender, receiver, duration }) => api.makeVoiceCall(sender, receiver, duration));
}

export function useConsumeInternet() {
  return useMutation(({ consumer, dataSize }) => api.consumeInternet(consumer, dataSize));
}

export function useConsumeData() {
  return useMutation(({ consumer }) => api.consumeData(consumer));
}

export function useSetInternetPackage() {
  return useMutation(({ internetPackagePrice }) => api.setInternetPackage(internetPackagePrice));
}

export function useSetVoicePackage() {
  return useMutation(({ voicePackagePrice }) => api.setVoicePackage(voicePackagePrice));
}

export function useSetSmsPackage() {
  return useMutation(({ smsPackagePrice }) => api.setSmsPackage(smsPackagePrice));
}

export function useRegisterUser() {
  return useMutation(({ name, balance, nin }) => api.registerUser(name, balance, nin));
}

export function useUserDetails(msisdn) {
  return useQuery(['userDetails', msisdn], () => api.getUserDetails(msisdn), {
    enabled: !!msisdn, // Only run the query if msisdn is provided
  });
}

export function useAllUsers() {
  return useQuery('allUsers', api.getAllUsers);
}

export function useGenerateRandomUsers() {
  return useMutation(({ count }) => api.generateRandomUsers(count));
}

export function useUpdateUserBalance() {
  return useMutation(({ MSISDN, newBalance }) => api.updateUserBalance(MSISDN, newBalance));
}