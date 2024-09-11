import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 800,
  duration: '100s',
};

const params = {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI1YTExNTIwYS03ZmUxLTQzMGUtYTNiMy05NDc5N2IzNDMzYWYiLCJyb2xlSWQiOiJiYTgzY2M2ZS0zZWI1LTQzYTUtYjBmNy01MTFkMGExZTI1MGUiLCJwZXJtaXNzaW9ucyI6WyJjYW5NYW5hZ2VBc3Nlc3NtZW50IiwiY2FuTWFuYWdlVXNlciIsImNhbk1hbmFnZVJvbGUiLCJjYW5NYW5hZ2VOb3RpZmljYXRpb24iLCJjYW5NYW5hZ2VMb2NhbEdyb3VwIiwiY2FuTWFuYWdlUmVwb3J0cyIsImNhbkF0dGVtcHRBc3Nlc3NtZW50IiwiY2FuVmlld1JlcG9ydCIsImNhbk1hbmFnZU15QWNjb3VudCIsImNhblZpZXdOb3RpZmljYXRpb24iXX0.htmcMxfIHmBugkH3aKtOig_3ECEfesMvyQjDAnl5fw0',
  },
};

export default function () {
  const res = http.get('https://api.pnacademy.in/v1/assessment/results?page=1&pageSize=4&sortBy=name&order=DESC', params);
  check(res, { 'status was 200': (r) => r.status == 200 });
}