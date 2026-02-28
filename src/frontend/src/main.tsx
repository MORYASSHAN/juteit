import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./App";
<<<<<<< HEAD
import "../index.css";

=======
import { InternetIdentityProvider } from "./hooks/useInternetIdentity";
import "../index.css";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

>>>>>>> b3703adf158970be9b21f99fa733e18d38b2f1e1
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
<<<<<<< HEAD
    <App />
=======
    <InternetIdentityProvider>
      <App />
    </InternetIdentityProvider>
>>>>>>> b3703adf158970be9b21f99fa733e18d38b2f1e1
  </QueryClientProvider>,
);
