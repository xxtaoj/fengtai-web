import { Navigate, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { CompanyPage } from './pages/CompanyPage';
import { NewsPage } from './pages/NewsPage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { ProductsPage } from './pages/ProductsPage';
import { ContactPage } from './pages/ContactPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminPage } from './pages/AdminPage';

export function App(){
  return <><ScrollToTop/><Routes><Route path="/admin" element={<AdminPage/>}/><Route path="*" element={<SiteRoutes/>}/></Routes></>;
}

function SiteRoutes(){
  return <>
    <Header/>
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/company" element={<CompanyPage/>}/>
      <Route path="/activity" element={<NewsPage/>}/>
      <Route path="/activity/:slug" element={<NewsDetailPage/>}/>
      <Route path="/products" element={<ProductsPage/>}/>
      <Route path="/products/:slug" element={<ProductDetailPage/>}/>
      <Route path="/contact" element={<ContactPage/>}/>
      <Route path="/news" element={<Navigate to="/activity" replace/>}/>
      <Route path="/news/:slug" element={<NewsDetailPage/>}/>
      <Route path="/export" element={<Navigate to="/products#custom-weaving" replace/>}/>
      <Route path="/domestic" element={<Navigate to="/products#ready-stock" replace/>}/>
      <Route path="/orders" element={<Navigate to="/contact#inquiry" replace/>}/>
      <Route path="*" element={<NotFoundPage/>}/>
    </Routes>
    <Footer/>
  </>;
}
