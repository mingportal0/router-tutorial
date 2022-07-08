# react-router-dom v6 사용법 공부
v5와 많이 달라져서 공부해본다.

# 설치
```cmd
npx create-react-app router-tutorial
```
데모 프로젝트 생성 후
```cmd
cd router-tutorial
npm install react-router-dom@6
```

# 기본 사용법
- `<BrowserRouter>`로 감싸서 사용한다.
- `Routes` 안에 `Route`를 넣는다.
- `Route` 안에 `to`와 `element`를 넣는다.
```js
// index.js
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import App from "./App";
import Expenses from "./routes/expenses";
import Invoices from "./routes/invoices";

const root = ReactDOM.createRoot(
  document.getElementById("root")
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="expenses" element={<Expenses />} />
      <Route path="invoices" element={<Invoices />} />
    </Routes>
  </BrowserRouter>
);
```

# Route 중첩 사용 시 (Nested Routes)
```js
// index.js
<Routes>
    <Route path="/" element={<App />}>
        <Route path="expenses" element={<Expenses />} />
        <Route path="invoices" element={<Invoices />} />
    </Route>
</Routes>
```
이렇게 사용하면
```js
// App.js
import './App.css';
import { Outlet, Link } from "react-router-dom";

export default function App() {
  return (
    <div>
      <h1>Bookkeeper!</h1>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <Link to="/invoices">Invoices</Link> |{" "}
        <Link to="/expenses">Expenses</Link> |{" "}
        <Link to="/shoes">Shoes</Link>
      </nav>
      <Outlet />
    </div>
  );
}
```
App.js에서 `Outlet`을 사용할 수 있다.
`Outlet`은 jsp의 include와 비슷하게 작동한다.

# /:id 입력
주로 상세 페이지에 사용하는 것.
`/invoices/${invoice.number}`와 같이 사용한다.
```jsx
/// invoices.jsx
<Link
    style={{ display: "block", margin: "1rem 0" }}
    to={`/invoices/${invoice.number}`}
    key={invoice.number}
>
```
상세 페이지는 자식 페이지에 넣어서 `path=":invoiceId"`와 같이 사용한다.
```js
// index.js
<Routes>
  <Route path="/" element={<App />}>
    <Route path="expenses" element={<Expenses />} />
    <Route path="invoices" element={<Invoices />}>
      <Route path=":invoiceId" element={<Invoice />} />
    </Route>
    <Route
      path="*"
      element={
        <main style={{ padding: "1rem" }}>
          <p>There's nothing here!</p>
        </main>
      }
    />
  </Route>
</Routes>
```

## index 페이지
id를 넣지 않았을 때 기본으로 나타나는 페이지.
`path` 대신 `index`를 넣는다.
```js
// index.js
<Routes>
  <Route path="/" element={<App />}>
    <Route path="expenses" element={<Expenses />} />
    <Route path="invoices" element={<Invoices />}>
        <Route
            index
            element={
                <main style={{ padding: "1rem" }}>
                <p>Select an invoice</p>
                </main>
            }
        />
        <Route path=":invoiceId" element={<Invoice />} />
    </Route>
    <Route
      path="*"
      element={
        <main style={{ padding: "1rem" }}>
          <p>There's nothing here!</p>
        </main>
      }
    />
  </Route>
</Routes>
```

# 404 Error 페이지
`path="*"`와 같이 사용한다.
```js
/// index.js
<Routes>
  <Route path="/" element={<App />}>
    <Route path="expenses" element={<Expenses />} />
    <Route path="invoices" element={<Invoices />} />
    <Route
      path="*"
      element={
        <main style={{ padding: "1rem" }}>
          <p>There's nothing here!</p>
        </main>
      }
    />
  </Route>
</Routes>
```

# Link에 Active 여부 표시
`Link` 대신 `NavLink`를 사용한다.
그러면 isActive를 사용할 수 있다.
style이나 className에 사용한다.
```jsx
// invoices.jsx
import { NavLink, Outlet } from "react-router-dom";
<NavLink
    style={({ isActive }) => {
        return {
        display: "block",
        margin: "1rem 0",
        color: isActive ? "red" : "",
        };
    }}
    to={`/invoices/${invoice.number}`}
    key={invoice.number}
>
<NavLink className={({ isActive }) => isActive ? "red" : "blue"} />
```

# Search Params
`let [searchParams, setSearchParams] = useSearchParams();` 처럼 state와 비슷하게 사용할 수 있다.
```jsx
// invoices.jsx
import {
  NavLink,
  Outlet,
  useSearchParams,
} from "react-router-dom";
import { getInvoices } from "../data";

export default function Invoices() {
  let invoices = getInvoices();
  let [searchParams, setSearchParams] = useSearchParams();

  return (
    <div style={{ display: "flex" }}>
      <nav
        style={{
          borderRight: "solid 1px",
          padding: "1rem",
        }}
      >
        <input
          value={searchParams.get("filter") || ""}
          onChange={(event) => {
            let filter = event.target.value;
            if (filter) {
              setSearchParams({ filter });
            } else {
              setSearchParams({});
            }
          }}
        />
        {invoices
          .filter((invoice) => {
            let filter = searchParams.get("filter");
            if (!filter) return true;
            let name = invoice.name.toLowerCase();
            return name.startsWith(filter.toLowerCase());
          })
          .map((invoice) => (
            <NavLink
              style={({ isActive }) => ({
                display: "block",
                margin: "1rem 0",
                color: isActive ? "red" : "",
              })}
              to={`/invoices/${invoice.number}`}
              key={invoice.number}
            >
              {invoice.name}
            </NavLink>
          ))}
      </nav>
      <Outlet />
    </div>
  );
}
```

## 링크 클릭 시 Search Params 유지
```jsx
// QueryNavLink.jsx
import { useLocation, NavLink } from "react-router-dom";

function QueryNavLink({ to, ...props }) {
  let location = useLocation();
  return <NavLink to={to + location.search} {...props} />;
}
```

## 링크를 이런 식으로도 만들 수 있다.
```jsx
// BrandLink.jsx
import { Link, useSearchParams } from "react-router-dom";

export default function BrandLink({ brand, ...props }) {
  let [params] = useSearchParams();
  let isActive = params.getAll("brand").includes(brand);
  return (
    <Link
    style={{ display: "block", marginBottom: "1rem", color: isActive ? "red" : "" }}
      to={`/shoes?brand=${brand}`}
      {...props}
    />
  );
}
```
사용은 이렇게 한다.
```jsx
// Shoes.jsx
import { Outlet } from "react-router-dom";
import BrandLink from "../components/BrandLink";

export default function Shoes() {
    return (
      <div style={{ display: "flex" }}>
        <nav
          style={{
              borderRight: "solid 1px",
              padding: "1rem",
          }}
        >
          <BrandLink brand="nike">Nike</BrandLink>
          <BrandLink brand="vans">Vans</BrandLink>
        </nav>
        <Outlet />
      </div>
    );
}
```

## Search Params를 여러개 넣고 싶다면..
BrandLink.jsx 다음과 같이 바꾼다.
```jsx
// BrandLink.jsx
import { Link, useSearchParams } from "react-router-dom";

export default function BrandLink({ brand, ...props }) {
  let [params] = useSearchParams();
  let isActive = params.getAll("brand").includes(brand);
  if (!isActive) {
    params.append("brand", brand);
  }
  return (
    <Link
    style={{ display: "block", marginBottom: "1rem", color: isActive ? "red" : "" }}
      to={`/shoes?${params.toString()}`}
      {...props}
    />
  );
}
```
여기서 더해 만약 Active한 링크 다시 클릭 시 params에서 지우고 싶으면..
```jsx
// BrandLink.jsx
import { Link, useSearchParams } from "react-router-dom";

export default function BrandLink({ brand, ...props }) {
    let [params] = useSearchParams();
    let isActive = params.getAll("brand").includes(brand);
    if (!isActive) {
        params.append("brand", brand);
    } else {
        params = new URLSearchParams(
            Array.from(params).filter(
            ([key, value]) => key !== "brand" || value !== brand
            )
        );
    }
    return (
      <Link
        style={{ display: "block", marginBottom: "1rem", color: isActive ? "red" : "" }}
        to={`/shoes?${params.toString()}`}
        {...props}
      />
    );
  }
```

# 소스 상 링크 이동
Function 내에서 redirect 하고 싶을 때 `navigate(url)`을 사용한다.
```jsx
// invoices.jsx
import {
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";

let navigate = useNavigate();
let location = useLocation();

return (
    <button
        onClick={() => {
        deleteInvoice(invoice.number);
        navigate("/invoices" + location.search);
        }}
    >
);
```
