import { Outlet, Link, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { ChatWidget } from "../misc/ChatWidget";

export function Layout() {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      {/* Floating chat widget visible on all routes except assistant (has full chat) */}
      {location.pathname !== "/assistant" && <ChatWidget />}
      <footer className="border-t bg-muted/30">
        <div className="container py-10 grid gap-8 md:grid-cols-4">
          <div>
            <p className="text-xl font-extrabold">AgriSure</p>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              Insurance for agriculture with real‑time weather and friendly
              guidance.
            </p>
          </div>
          <div>
            <p className="font-semibold">Products</p>
            <ul className="mt-2 text-sm text-muted-foreground space-y-1">
              <li>
                <a className="hover:text-foreground" href="/products">
                  All products
                </a>
              </li>
              <li>
                <a className="hover:text-foreground" href="/quote">
                  Get a quote
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">Company</p>
            <ul className="mt-2 text-sm text-muted-foreground space-y-1">
              <li>
                <a className="hover:text-foreground" href="/solutions">
                  Solutions
                </a>
              </li>
              <li>
                <a className="hover:text-foreground" href="/partners">
                  Partners
                </a>
              </li>
              <li>
                <a className="hover:text-foreground" href="/about">
                  About
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">Resources</p>
            <ul className="mt-2 text-sm text-muted-foreground space-y-1">
              <li>
                <a className="hover:text-foreground" href="/resources">
                  Articles
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t">
          <div className="container py-6 text-sm text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© {new Date().getFullYear()} AgriSure. All rights reserved.</p>
            <p className="text-xs">Built with React & Express</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
