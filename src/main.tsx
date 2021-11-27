import React from 'react'
import { RecoilRoot } from 'recoil';
import { render } from 'react-dom'
import './index.css'
import App from './App'
import { AuthProvider } from './store/AuthContext'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { siteRoot } from './data/sitemap'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { PaywallLayout, PaywallPage } from './pages/paywall/PaywallPage'
import { LoginPage } from './pages/LoginPage'
import { PasswordResetPage } from './pages/PasswordResetPage'
import { CenterLayout } from './components/layout/CenterLayout'
import { ContentLayout } from './components/layout/ContentLayout'
import { ProductListPage } from './pages/paywall/ProductListPage';

render(
  <React.StrictMode>
    <RecoilRoot>
      <AuthProvider>
        <BrowserRouter basename="/next">
          <Routes>
            <Route
              path="/"
              element={<App />}
            >
              <Route
                path=""
                element={<CenterLayout />}
              >
                <Route
                  path={siteRoot.login}
                  element={<LoginPage />}
                />
                <Route
                  path={siteRoot.forgotPassword}
                  element={<ForgotPasswordPage />}
                />
                <Route
                  path={siteRoot.passwordReset}
                >
                  <Route
                    path=":token"
                    element={<PasswordResetPage />}
                  />
                </Route>
              </Route>

              <Route
                path=""
                element={<ContentLayout />}
              >
                <Route
                  path={siteRoot.paywall}
                  element={<PaywallLayout />}
                >
                  <Route
                    path=""
                    element={<PaywallPage />}
                  />
                  <Route
                    path={siteRoot.products}
                    element={<ProductListPage />}
                  />
                </Route>
              </Route>

            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root')
)
