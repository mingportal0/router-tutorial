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