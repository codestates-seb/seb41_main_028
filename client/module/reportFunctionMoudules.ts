import axios from 'axios';

import type {
  postReportHabitProps,
  postReportAuthPorps,
  postReportReviewPorps,
} from './moduleInterface';

export async function postHabitReport({
  habitId,
  hostUserId,
  userId,
  reportType,
}: postReportHabitProps) {
  try {
    const response = await axios
      .post(`${process.env.NEXT_PUBLIC_SERVER_URL}/habits/${habitId}/reports`, {
        postId: habitId,
        postType: 'HABIT',
        reportType,
        reporterUserId: userId,
        reportedUserId: hostUserId,
      })
      .then((res) => res.data);
    return response;
  } catch (e) {
    return e.response.status;
  }
}

export async function postAuthReport({
  habitId,
  authId,
  authorUserId,
  reportType,
  userId,
}: postReportAuthPorps) {
  try {
    const response = await axios
      .post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/habits/${habitId}/auths/${authId}/reports`,
        {
          postId: authId,
          postType: 'AUTH',
          reportType,
          reporterUserId: userId,
          reportedUserId: authorUserId,
        },
      )
      .then((res) => console.log(res));
    return response;
  } catch (e) {
    console.error(e);
  }
}

export async function postReviewReport({
  habitId,
  reviewId,
  reviewerUserId,
  reportType,
  userId,
}: postReportReviewPorps) {
  try {
    const response = await axios
      .post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/habits/${habitId}/reviews/${reviewId}/reports`,
        {
          postId: reviewId,
          postType: 'REVIEW',
          reportType,
          reporterUserId: userId,
          reportedUserId: reviewerUserId,
        },
      )
      .then((res) => console.log(res));
    return response;
  } catch (e) {
    console.error(e);
  }
}
