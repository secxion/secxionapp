import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { Provider } from "react-redux";
import { store, persistor } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ContextProvider } from "./Context";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={<div>Loading app...</div>} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        <ContextProvider> 
          <RouterProvider router={router} />
        </ContextProvider>
      </QueryClientProvider>
    </PersistGate>
  </Provider>
);

reportWebVitals();
