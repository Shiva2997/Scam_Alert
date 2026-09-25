import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Assess from './pages/Assess'
import Result from './pages/Result'
import Checklist from './pages/Checklist'
import Alerts from './pages/Alerts'
import Help from './pages/Help'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="assess" element={<Assess />} />
        <Route path="result" element={<Result />} />
        <Route path="checklist" element={<Checklist />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="help" element={<Help />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
