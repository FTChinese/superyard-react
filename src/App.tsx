import 'react-toastify/dist/ReactToastify.min.css';
import {
  Outlet, Route, Routes,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Toolbar } from './components/layout/Toolbar';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { CenterLayout } from './components/layout/CenterLayout';
import { sitePath } from './data/sitemap';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { LoginPage } from './pages/LoginPage';
import { PasswordResetPage } from './pages/PasswordResetPage';
import { ContentLayout } from './components/layout/ContentLayout';
import { RequireAuth } from './components/routes/RequireAuth';
import { PaywallLayout, PaywallPage } from './pages/paywall/PaywallPage';
import { ProductDetailPage } from './pages/paywall/ProductDetailPage';
import { ProductListPage } from './pages/paywall/ProductListPage';
import { StripePricePage } from './pages/paywall/StripePricepage';
import { LegalListPage } from './pages/legal/LegalListPage';
import { LegalDetailPage } from './pages/legal/LegalDetailPage';
import { ReleaseListPage } from './pages/android/ReleaseListPage';
import { ReleaseEditPage } from './pages/android/ReleaseEditPage';
import { GlobalLoader } from './components/progress/GlobalLoader';
import { useProgress } from './components/hooks/progressState';

function Skeleton() {
  const { progress } = useProgress();
  return (
    <>
      <Toolbar />

      <div className="page-content pt-3">
        <Outlet />
        <GlobalLoader progress={progress} />
      </div>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
      />
    </>
  );
}

function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Skeleton />}>
          <Route element={<CenterLayout />}>
            <Route path={sitePath.login} element={<LoginPage />} />
            <Route path={sitePath.forgotPassword} element={<ForgotPasswordPage />} />
            <Route path={`${sitePath.passwordReset}/:token`} element={<PasswordResetPage />} />
          </Route>

          <Route
            element={
              <RequireAuth>
                <ContentLayout />
              </RequireAuth>
            }
          >
            <Route path={sitePath.paywall} element={<PaywallLayout />} >
              <Route path="" element={<PaywallPage />} />
              <Route path={sitePath.products} element={<ProductListPage />} />
              <Route path={`${sitePath.products}/:productId`} element={<ProductDetailPage />} />
              <Route path={`${sitePath.stripePrices}/:priceId`} element={<StripePricePage />}/>
            </Route>
          </Route>

          <Route
            element={
              <RequireAuth>
                <ContentLayout />
              </RequireAuth>
            }
          >
            <Route path={sitePath.android}>
              <Route path="" element={<ReleaseListPage />} />
              <Route path=":versionName" element={<ReleaseEditPage />} />
            </Route>
          </Route>

          <Route
            element={
              <RequireAuth>
                <ContentLayout />
              </RequireAuth>
            }
          >
            <Route path={sitePath.legal}>
              <Route path="" element={<LegalListPage />} />
              <Route path=":id" element={<LegalDetailPage />} />
            </Route>
          </Route>

        </Route>
      </Routes>
    </>
  );
}

export default App;
