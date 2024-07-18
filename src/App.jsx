import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { useState, useEffect } from "react";

import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import AccountPage from "./pages/AccountPage";
import NotFoundPage from "./pages/NotFoundPage";
import WishlistPage from "./pages/WishlistPage";
import CheckoutPage from "./pages/CheckoutPage";

const App = () => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [sortedGames, setSortedGames] = useState([]);
  const [sortTerm, setSortTerm] = useState("reviews_count");
  const [outletHeader, setOutletHeader] = useState("");
  const [signIn, setSignIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [term, setTerm] = useState("legend of zelda");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [total, setTotal] = useState(0);
  const apiKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const fetchGames = async () => {
      const apiUrl = `https://api.rawg.io/api/games?key=${apiKey}&search=${term}&page_size=30`;
      setLoading(true);
      try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        setGames(data.results);
        console.log(data.results);
      } catch (error) {
        console.log("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [term]);

  //sorts games in descending order based on suggestions_count
  useEffect(() => {
    const gamesToFilter = [...games].filter((game) => {
      const added = parseInt(game.added, 10);
      const reviews = parseInt(game.reviews_count, 10);
      return reviews >= 40 && added >= 5;
    });
    setFilteredGames(gamesToFilter);
    console.log(filteredGames);
  }, [games]);

  useEffect(() => {
    if (sortTerm === "") return;
    const gamesToSort = [...filteredGames].sort((a, b) => {
      if (sortTerm === "released") {
        return new Date(b[sortTerm]) - new Date(a[sortTerm]);
      }
      return b[sortTerm] - a[sortTerm];
    });

    setSortedGames(gamesToSort);
  }, [filteredGames, sortTerm]);

  useEffect(() => {
    // const storedCart = localStorage.getItem("myCart");
    // if (storedCart) {
    //   setCart(JSON.parse(storedCart));
    // }
    console.log(cart);
  }, [cart]);

  const saveCart = () => {
    const cartToStore = { key: "value" };
    localStorage.setItem("myCart", json.stringify(cartToStore));
    setCart(cartToStore);
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="/"
        element={
          <MainLayout
            total={total}
            setTotal={setTotal}
            cart={cart}
            setCart={setCart}
            signIn={signIn}
            search={search}
            setSearch={setSearch}
            setTerm={setTerm}
            setSortTerm={setSortTerm}
          />
        }
      >
        <Route
          index
          element={
            <HomePage
              cart={cart}
              setCart={setCart}
              loading={loading}
              sortedGames={sortedGames}
            />
          }
        />
        <Route
          path="/account"
          element={<AccountPage signIn={signIn} setSignIn={setSignIn} />}
        />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route
          path="/checkout"
          element={<CheckoutPage total={total} setTotal={setTotal} />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};

export default App;
