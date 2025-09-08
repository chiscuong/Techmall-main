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

  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [cartItems, setCartItems] = useState({});

  const fetchProductData = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      console.log("🔍 API Response:", data);
      console.log("🔍 Total products loaded:", data.products?.length);

      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("❌ Fetch products error:", error);
      toast.error(error.message);
    }
  };

  const fetchUserData = async () => {
    try {
      if (user?.publicMetadata?.role === "seller") {
        setIsSeller(true);
      }

      console.log("🔍 Fetching user data...", {
        isSignedIn,
        userId: user?.id,
        hasUser: !!user,
      });

      const response = await fetch("/api/user/data", {
        method: "GET",
        credentials: "include",
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
        setCartItems(data.user.cartItems || {});
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("❌ Fetch user data error:", error);
      toast.error(error.message || "Failed to fetch user data");
    }
  };

  const createUserIfNotExists = async () => {
    if (!user) return;
    try {
      console.log("🔍 Creating user if not exists...", user.id);

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

  // ✅ Thêm hàm cleanup cart để xóa sản phẩm không tồn tại
  const cleanupCart = async () => {
    if (!user || Object.keys(cartItems).length === 0) return;

    let cartData = structuredClone(cartItems);
    let hasChanges = false;

    // Kiểm tra từng item trong cart
    for (const cartKey in cartItems) {
      const productId = cartItems[cartKey].productId;

      // Tìm sản phẩm trong danh sách products
      const itemInfo = products.find(
        (product) => product._id === productId || product.id === productId
      );

      // Nếu sản phẩm không tồn tại, xóa khỏi cart
      if (!itemInfo) {
        console.log(`🗑️ Removing non-existent product from cart: ${productId}`);
        delete cartData[cartKey];
        hasChanges = true;
      }
    }

    // Cập nhật cart nếu có thay đổi
    if (hasChanges) {
      setCartItems(cartData);

      // Sync với server
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
          toast.success(
            "Đã cập nhật giỏ hàng và loại bỏ sản phẩm không tồn tại"
          );
        }
      } catch (error) {
        console.error("Error updating cart:", error);
      }
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

  // ✅ Thêm hàm remove khỏi cart
  const removeFromCart = async (cartKey) => {
    let cartData = structuredClone(cartItems);
    delete cartData[cartKey];
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
          console.log("Item removed from cart");
        }
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  // ✅ Cải tiến hàm getCartCount với error handling
  const getCartCount = () => {
    let totalCount = 0;

    for (const cartKey in cartItems) {
      try {
        const item = cartItems[cartKey];
        if (item && item.quantity > 0) {
          // Kiểm tra sản phẩm có tồn tại không
          const productId = item.productId;
          const itemInfo = products.find(
            (product) => product._id === productId || product.id === productId
          );

          if (itemInfo) {
            totalCount += item.quantity;
          } else {
            console.warn(`Product ${productId} not found, skipping count`);
          }
        }
      } catch (error) {
        console.error(`Error counting cart item ${cartKey}:`, error);
      }
    }

    return totalCount;
  };

  // ✅ Cải tiến hàm getCartAmount với error handling tốt hơn
  const getCartAmount = () => {
    let totalAmount = 0;

    for (const cartKey in cartItems) {
      try {
        const item = cartItems[cartKey];
        if (!item || item.quantity <= 0) continue;

        // Tìm sản phẩm với cả _id và id để đảm bảo
        const itemInfo = products.find(
          (product) =>
            product._id === item.productId || product.id === item.productId
        );

        if (itemInfo && itemInfo.offerPrice) {
          totalAmount += itemInfo.offerPrice * item.quantity;
        } else if (!itemInfo) {
          console.warn(`Không tìm thấy sản phẩm với ID: ${item.productId}`);
          // Tự động xóa sản phẩm không tồn tại khỏi cart
          removeFromCart(cartKey);
        }
      } catch (error) {
        console.error(
          `Error calculating amount for cart item ${cartKey}:`,
          error
        );
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
      createUserIfNotExists();
      fetchUserData();
    } else if (isLoaded && !isSignedIn) {
      console.log("❌ User not signed in");
      // Reset state khi user logout
      setUserData(false);
      setCartItems({});
      setIsSeller(false);
    }
  }, [isLoaded, isSignedIn, user]);

  // ✅ Cleanup cart khi products thay đổi
  useEffect(() => {
    if (products.length > 0 && Object.keys(cartItems).length > 0) {
      cleanupCart();
    }
  }, [products, user]); // Chạy khi products hoặc user thay đổi

  // ✅ Show loading cho đến khi Clerk load xong
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const value = {
    user,
    isSignedIn,
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
    removeFromCart, // ✅ Thêm function này
    getCartCount,
    getCartAmount,
    cleanupCart, // ✅ Thêm function này
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
