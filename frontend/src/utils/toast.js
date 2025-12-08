import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

export const toast = {
  success: (message) => {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "#4CAF50",
      stopOnFocus: true,
    }).showToast();
  },
  error: (message) => {
    Toastify({
      text: message || "Có lỗi xảy ra!",
      duration: 4000,
      backgroundColor: "#f44336",
    }).showToast();
  },
  info: (message) => {
    Toastify({
      text: message,
      backgroundColor: "#2196F3",
    }).showToast();
  }
};