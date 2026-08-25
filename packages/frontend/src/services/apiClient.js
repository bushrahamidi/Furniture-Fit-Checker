import axios from 'axios';

export async function checkFit(room, furniture) {
  const response = await axios.post('/api/fit-check', { room, furniture });
  return response.data;
}

export function collectErrorMessages(errors) {
  return Object.values(errors).flatMap((value) => (
    typeof value === 'string' ? [value] : collectErrorMessages(value)
  ));
}

export function getRequestErrorMessage(error) {
  const data = error.response?.data;

  if (data?.errors) {
    return collectErrorMessages(data.errors).join(' ');
  }

  if (data?.error) {
    return data.error;
  }

  return 'Unable to check fit. Please try again.';
}
