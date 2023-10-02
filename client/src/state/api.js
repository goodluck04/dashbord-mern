import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  reducerPath: "adminApi",
  tagTypes: [
    "User",
    "Products",
    "Customers",
    "Transactions",
    "Geography",
    "Sales",
    "Admins",
    "Performance",
    "Dashboard"
  ],
  endpoints: (build) => ({
    // getUser(id) hook will tak id from from the page
    getUser: build.query({
      // query will be added with baseurl
      query: (id) => `general/user/${id}`,
      providesTags: ["User"],
    }),
    // get all product with stats
    getProducts: build.query({
      query: () => "client/products",
      providesTags: ["Products"],
    }),
    // this is sort hand
    getCustomers: build.query({
      query: () => "client/customers",
      providesTags: ["Customers"],
    }),
    // this is the proper format of api call if you have params
    getTransactions: build.query({
      query: ({ page, pageSize, sort, search }) => ({
        url: "client/transactions",
        method: "GET",
        params: { page, pageSize, sort, search },
      }),
      providesTags: ["Transactions"],
    }),
    getGeography: build.query({
      query: () => "client/geography",
      providesTags: ["Geography"],
    }),
    // sales all api call on common IP
    getSales: build.query({
      query: () => "sales/sales",
      providesTags: ["Sales"],
    }),
    // admin
    getAdmins: build.query({
      query: () => "management/admins",
      providesTags: ["Admins"],
    }),
    getUserPerformance: build.query({
      query: (id) => `management/performance/${id}`,
      providesTags: ["Performance"],
    }),
    getDashboard: build.query({
      query: () => "general/dashboard",
      providesTags: ["Dashboard"],
    }),
  }),
});
//  useGetUserQuery -> is given/made by redux-query
export const {
  useGetUserQuery,
  useGetProductsQuery,
  useGetCustomersQuery,
  useGetTransactionsQuery,
  useGetGeographyQuery,
  useGetSalesQuery,
  useGetAdminsQuery,
  useGetUserPerformanceQuery,
  useGetDashboardQuery
} = api;
