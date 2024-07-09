import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import listRoute from "./routes";
function App() {
  
  return (
    
    <BrowserRouter>
    <div className="">
      <Routes>
        {listRoute.map((item, index) => {
          const Page = item.component;
          const Layout = item.layout;
          return (
            <Route
              key={index}
              path={item.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          );
        })}
        
        <Route path="*" element={<Navigate to={'/'}/>}/>
      </Routes>
    </div>
  </BrowserRouter>
  );
}

export default App;
