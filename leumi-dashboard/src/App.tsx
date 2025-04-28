import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/common/AppSidebar.tsx";
import { Header } from "./components/common/Header.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import { jwtDecode } from "jwt-decode";
import { fetchLoggedInUser } from "@/api/api.ts";
import { Asset, TUser, Wallet } from "@/api/types.ts";
import AssetsPage from "@/pages/AssetsPage.tsx";
import TransactionsPage from "./pages/TransactionsPage.tsx";
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<TUser | null>(null);
  const [leumiWalletAssets, setLeumiWalletAssets] = useState<Asset[]>([]);
  const [leumiWallet, setLeumiWallet] = useState<Wallet>();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode<{ user: { id: string } }>(token);
        const user = await fetchLoggedInUser(decodedToken.user.id);
        setUser(user);
        setLeumiWallet(user.wallet);
        setIsAuthenticated(true);
      }
    };
    fetchData();
  }, []);
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          {isAuthenticated ? (
            <div className="min-h-screen flex flex-col">
              <Header user={user} setIsAuthenticated={setIsAuthenticated} />
              <SidebarProvider>
                <div className="flex flex-1 pt-[57px]">
                  <AppSidebar />
                  <main className="flex-1 p-8">
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <DashboardPage
                            user={user}
                            leumiWallet={leumiWallet}
                            leumiWalletAssets={leumiWalletAssets}
                            setLeumiWallet={setLeumiWallet}
                            setLeumiWalletAssets={setLeumiWalletAssets}
                          />
                        }
                      />
                      <Route
                        path="/assets"
                        element={<AssetsPage leumiWalletId={leumiWallet.id} initialAssets={leumiWalletAssets} />}
                      />
                      <Route path="/transactions" element={<TransactionsPage leumiWallet={leumiWallet} />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                </div>
              </SidebarProvider>
            </div>
          ) : (
            <Routes>
              <Route
                path="/login"
                element={
                  <LoginPage
                    setIsAuthenticated={setIsAuthenticated}
                    setUser={user => {
                      setUser(user);
                      setLeumiWallet(user.wallet);
                    }}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
