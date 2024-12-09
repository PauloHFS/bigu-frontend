import { toast } from "react-toastify";
import { api } from "./api";

export const sendChatMessage = async (body:
  {
    rideId: string,
    userId: string,
    message: string
  }
) => {
  try {
    const response = api.post('/chat/send', body);
    return response;
  } catch (err: any) {
    toast.error(err.message)
  }
}

// export const getChatMessages = async (userId: string, otherUserId: string) => {
//   try {
//     const response = api.get(`/messages?userId=${userId}&otherUserId=${otherUserId}`);
//     return response;
//   } catch (err: any) {
//     toast.error(err.message)
//   }
// }


export const pollMessages = async (rideId: string, timestamp: string) => {
  try {
    const response = api.get(`/chat/poll?rideId=${rideId}&lastTimestamp=${timestamp}`);
    return response;
  } catch (err: any) {
    toast.error(err.message)
  }
}