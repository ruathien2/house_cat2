import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";
import { HomePage, NotFoundPage, SignInPage, SignUpPage } from "./pages";
import DetailsPage from "./pages/DetailsPage";
import DashboardLayout from "./modules/dashboard/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import DashboardHeader from "./modules/dashboard/DashboardHeader";
import PostAddNews from "./modules/post/PostAddNews";
import CategoryManage from "./modules/category/CategoryManage";
import CategoryAddNew from "./modules/category/CategoryAddNew";
import CategoryUpdate from "./modules/category/CategoryUpdate";
import UserManage from "./modules/users/UserManage";
import UserAddNew from "./modules/users/UserAddNew";
import UserUpdate from "./modules/users/UserUpdate";
import PostManage from "./modules/post/PostManage";
import PostUpdate from "./modules/post/PostUpdate";
import UserProfile from "./modules/profile/UserProfile";
import CategoryWrite from "./pages/CategoryWrite";

function App() {
  return (
    <div>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage></HomePage>}></Route>
          <Route path="/sign-up" element={<SignUpPage></SignUpPage>}></Route>
          <Route path="/sign-in" element={<SignInPage></SignInPage>}></Route>
          <Route path="*" element={<NotFoundPage></NotFoundPage>}></Route>

          <Route path="/:slug" element={<DetailsPage></DetailsPage>}></Route>
          <Route
            path="/category-write/:slug"
            element={<CategoryWrite></CategoryWrite>}
          ></Route>

          <Route element={<DashboardLayout></DashboardLayout>}>
            <Route path="/dasboard" element={<Dashboard></Dashboard>}></Route>
            <Route
              path="/manage/add-posts"
              element={<PostAddNews></PostAddNews>}
            ></Route>
            <Route
              path="/manage/add-category"
              element={<CategoryAddNew></CategoryAddNew>}
            ></Route>
            <Route
              path="/manage/category"
              element={<CategoryManage></CategoryManage>}
            ></Route>
            <Route
              path="/manage/update-category"
              element={<CategoryUpdate></CategoryUpdate>}
            ></Route>
            <Route
              path="/manage/user"
              element={<UserManage></UserManage>}
            ></Route>
            <Route
              path="/manage/create-user"
              element={<UserAddNew></UserAddNew>}
            ></Route>
            <Route
              path="/manage/update-user"
              element={<UserUpdate></UserUpdate>}
            ></Route>
            <Route
              path="/manage/posts"
              element={<PostManage></PostManage>}
            ></Route>
            <Route
              path="/manage/update-post"
              element={<PostUpdate></PostUpdate>}
            ></Route>
            <Route
              path="/profile"
              element={<UserProfile></UserProfile>}
            ></Route>
          </Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
