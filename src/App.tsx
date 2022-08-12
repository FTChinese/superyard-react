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
import { AuthOnlyGuard } from './components/middleware/AuthOnlyGuard';
import { PaywallLayout, PaywallPage } from './pages/paywall/PaywallPage';
import { ProductDetailPage } from './pages/paywall/ProductDetailPage';
import { ProductListPage } from './pages/paywall/ProductListPage';
import { StripePricePage } from './pages/paywall/StripePricepage';
import { LegalListPage } from './pages/legal/LegalListPage';
import { LegalDetailPage } from './pages/legal/LegalDetailPage';
import { ReleaseListPage } from './pages/android/ReleaseListPage';
import { ReleaseEditPage } from './pages/android/ReleaseEditPage';
import { GlobalLoader } from './components/progress/GlobalLoader';
import { useProgress } from './components/hooks/useProgress';
import { TestUserListPage } from './pages/readers/TestUserListPage';
import { TestUserDetailPage } from './pages/readers/TestUserDetailPage';
import { SearchReaderPage } from './pages/readers/SearchReaderPage';
import { FtcDetailPage } from './pages/readers/FtcDetailPage';
import { WxDetailPage } from './pages/readers/WxDetailPage';
import { HomePage } from './pages/HomePage';
import { useAuth } from './components/hooks/useAuth';
import { Loading } from './components/progress/Loading';
import { NoAuthGuard } from './components/middleware/NoAuthGuard';

function Skeleton() {
  // When this app is accessed from url, e.g., manual refreshing,
  // passport will
  // be loaded from localstorage. This is ususally
  // slower than building the global state.
  // We should wait for the before rendering nested components.
  const { loadingAuth } = useAuth();
  const { progress } = useProgress();
  return (
    <Loading loading={loadingAuth}>
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
    </Loading>
  );
}

function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route
          path="/"
          element={<Skeleton />}
        >
          <Route
            element={
              <NoAuthGuard>
                <CenterLayout />
              </NoAuthGuard>
            }
          >
            <Route path={sitePath.login} element={<LoginPage />} />
            <Route path={sitePath.forgotPassword} element={<ForgotPasswordPage />} />
            <Route path={`${sitePath.passwordReset}/:token`} element={<PasswordResetPage />} />
          </Route>

          <Route
            element={
              <AuthOnlyGuard>
                <ContentLayout />
              </AuthOnlyGuard>
            }
          >
            <Route
              path={sitePath.paywall}
              element={<PaywallLayout />}
            >
              <Route
                path=""
                element={<PaywallPage />}
              />
              <Route
                path={sitePath.products}
                element={<ProductListPage />}
              />
              <Route
                path={`${sitePath.products}/:productId`}
                element={<ProductDetailPage />}
              />
              <Route
                path={`${sitePath.stripePrices}/:priceId`}
                element={<StripePricePage />}
              />
            </Route>

            <Route path={sitePath.readers}>
              <Route
                path=''
                element={<SearchReaderPage />}
              />
              <Route
                path="ftc/:id"
                element={<FtcDetailPage />}
              />
              <Route
                path="wx/:id"
                element={<WxDetailPage />}
              />
              <Route
                path={sitePath.sandbox}
                element={<TestUserListPage />}
              />
              <Route
                path={`${sitePath.sandbox}/:id`}
                element={<TestUserDetailPage />}
              />
            </Route>

            <Route path={sitePath.android}>
              <Route
                path=""
                element={<ReleaseListPage />}
              />
              <Route
                path=":versionName"
                element={<ReleaseEditPage />}
              />
            </Route>

            <Route path={sitePath.legal}>
              <Route path="" element={<LegalListPage />} />
              <Route path=":id" element={<LegalDetailPage />} />
            </Route>

            <Route
              index
              element={<HomePage />}
            />
          </Route>

        </Route>
      </Routes>
    </>
  );
}

export default App;
