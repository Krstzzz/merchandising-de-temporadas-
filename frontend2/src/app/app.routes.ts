import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/home/home.component").then((m) => m.HomeComponent),
  },
  {
    path: "login",
    loadComponent: () =>
      import("./pages/login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "register",
    loadComponent: () =>
      import("./pages/register/register.component").then(
        (m) => m.RegisterComponent,
      ),
  },
  {
    path: "catalog",
    loadComponent: () =>
      import("./pages/catalog/catalog.component").then(
        (m) => m.CatalogComponent,
      ),
  },
  {
    path: "product/:id",
    loadComponent: () =>
      import("./pages/product-detail/product-detail.component").then(
        (m) => m.ProductDetailComponent,
      ),
  },
  {
    path: "cart",
    loadComponent: () =>
      import("./pages/cart/cart.component").then((m) => m.CartComponent),
  },
  {
    path: "checkout",
    loadComponent: () =>
      import("./pages/checkout/checkout.component").then(
        (m) => m.CheckoutComponent,
      ),
  },
  {
    path: "confirm",
    loadComponent: () =>
      import("./pages/confirm/confirm.component").then(
        (m) => m.ConfirmComponent,
      ),
  },
  {
    path: "admin",
    loadComponent: () =>
      import("./pages/admin/admin.component").then((m) => m.AdminComponent),
  },
  { path: "**", redirectTo: "" },
];
