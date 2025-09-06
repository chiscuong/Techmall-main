"use client";
import { productsDummyData, userDummyData } from "@/assets/assets";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

// ✅ Cấu hình axios để luôn gửi cookies
axios.defaults.withCredentials = true;

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = (props) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const router = useRouter();

  const { user, isLoaded, isSignedIn } = useUser(); // ✅ Thêm isLoaded, isSignedIn
  const { getToken } = useAuth();
  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [cartItems, setCartItems] = useState({});

  const fetchProductData = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchUserData = async () => {
    try {
      // ✅ Kiểm tra role trước khi set
      if (user?.publicMetadata?.role === "seller") {
        setIsSeller(true);
      }

      console.log("🔍 Fetching user data...", {
        isSignedIn,
        userId: user?.id,
        hasUser: !!user,
      });

      // ✅ Thử dùng fetch thay vì axios
      const response = await fetch("/api/user/data", {
        method: "GET",
        credentials: "include", // Đảm bảo gửi cookies
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("🔍 API Response:", { status: response.status, data });

      if (data.success) {
        setUserData(data.user);
        setCartItems(data.user.cartItems || {}); // ✅ Default to empty object
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("❌ Fetch user data error:", error);
      toast.error(error.message || "Failed to fetch user data");
    }
  };

  // ✅ Debug user object và tạo user nếu chưa tồn tại
  const createUserIfNotExists = async () => {
    if (!user) return;
    try {
      // ✅ THÊM ĐOẠN NÀY để debug
      console.log("🔍 Full user object:", user);
      console.log("🔍 User data to send:", {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.imageUrl,
        hasImage: !!user.imageUrl,
        publicMetadata: user.publicMetadata,
      });

      console.log("🔍 Creating user if not exists...", user.id);

      // ✅ Dùng fetch thay vì axios
      const response = await fetch("/api/user/create", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.primaryEmailAddress?.emailAddress,
          name:
            user.fullName ||
            `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.imageUrl,
        }),
      });

      const data = await response.json();
      console.log("🔍 Create user response:", {
        status: response.status,
        data,
      });
    } catch (error) {
      console.error("Create user error:", error);
    }
  };

  const addToCart = async (itemId, selectedColor = null) => {
    let cartData = structuredClone(cartItems);

    // Tạo unique key cho item với màu
    const cartKey = selectedColor ? `${itemId}_${selectedColor.value}` : itemId;

    if (cartData[cartKey]) {
      cartData[cartKey].quantity += 1;
    } else {
      cartData[cartKey] = {
        productId: itemId,
        quantity: 1,
        selectedColor: selectedColor,
      };
    }
    setCartItems(cartData);

    if (user) {
      try {
        const response = await fetch("/api/cart/update", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cartData }),
        });

        const data = await response.json();
        if (data.success) {
          toast.success("Item added to cart");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const updateCartQuantity = async (cartKey, quantity) => {
    let cartData = structuredClone(cartItems);
    if (quantity === 0) {
      delete cartData[cartKey];
    } else {
      cartData[cartKey].quantity = quantity;
    }
    setCartItems(cartData);

    if (user) {
      try {
        const response = await fetch("/api/cart/update", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cartData }),
        });

        const data = await response.json();
        if (data.success) {
          toast.success("Cart Updated");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      if (cartItems[items].quantity > 0) {
        totalCount += cartItems[items].quantity;
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find(
        (product) => product._id === cartItems[items].productId
      );
      if (cartItems[items].quantity > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[items].quantity;
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  // ✅ Chỉ gọi API khi user đã fully loaded và signed in
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      console.log("✅ User loaded and signed in, calling APIs...");
      createUserIfNotExists(); // 🟢 Gọi hàm này khi user mới login/signup
      fetchUserData();
    } else if (isLoaded && !isSignedIn) {
      console.log("❌ User not signed in");
      // Reset state khi user logout
      setUserData(false);
      setCartItems({});
      setIsSeller(false);
    }
  }, [isLoaded, isSignedIn, user]);

  // ✅ Show loading cho đến khi Clerk load xong
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const value = {
    user,
    isSignedIn, // ✅ Expose này để components khác dùng
    getToken,
    currency,
    router,
    isSeller,
    setIsSeller,
    userData,
    fetchUserData,
    products,
    fetchProductData,
    cartItems,
    setCartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    getCartAmount,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
