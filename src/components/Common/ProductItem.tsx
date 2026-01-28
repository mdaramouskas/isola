"use client";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { EyeIcon } from "@/assets/icons";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { AppDispatch } from "@/redux/store";
import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useCart } from "@/hooks/useCart";
import CheckoutBtn from "../Shop/CheckoutBtn";
import WishlistButton from "../Wishlist/AddWishlistButton";
import { formatPrice } from "@/utils/formatePrice";
import Tooltip from "./Tooltip";
import { calculateDiscountPercentage } from "@/utils/calculateDiscountPercentage";

type Props = {
  bgClr?: string;
  item: Product;
};
// add updated the type here
const ProductItem = ({ item, bgClr = "[#F6F7FB]" }: Props) => {
  const defaultVariant = item?.productVariants.find(
    (variant) => variant.isDefault
  );
  const searchParams = useSearchParams();
  const selectedColors = searchParams.get("colors")
    ? searchParams.get("colors")!.split(",")
    : [];
  const selectedSizes = searchParams.get("sizes")
    ? searchParams.get("sizes")!.split(",")
    : [];

  const resolvedVariant = (() => {
    const variants = item.productVariants || [];
    if (!variants.length) return defaultVariant;

    if (selectedColors.length && selectedSizes.length) {
      const exact = variants.find(
        (v) => selectedColors.includes(v.color) && selectedSizes.includes(v.size)
      );
      if (exact) return exact;
    }

    if (selectedColors.length) {
      const byColor = variants.find((v) => selectedColors.includes(v.color));
      if (byColor) return byColor;
    }

    if (selectedSizes.length) {
      const bySize = variants.find((v) => selectedSizes.includes(v.size));
      if (bySize) return bySize;
    }

    return defaultVariant || variants[0];
  })();
  const { openModal } = useModalContext();
  // const [product, setProduct] = useState({});
  const dispatch = useDispatch<AppDispatch>();

  const { addItem, cartDetails } = useCart();

  const pathUrl = usePathname();

  const isAlradyAdded = Object.values(cartDetails ?? {}).some(
    (cartItem) =>
      cartItem.id === item.id &&
      (cartItem.color || "") === (resolvedVariant?.color || "") &&
      (cartItem.size || "") === (resolvedVariant?.size || "")
  );

  const cartItem = {
    id: item.id,
    name: item.title,
    price: item.discountedPrice ? item.discountedPrice : item.price,
    currency: "usd",
    image: resolvedVariant?.image ? resolvedVariant.image : "",
    slug: item?.slug,
    availableQuantity: item.quantity,
    color: resolvedVariant?.color ? resolvedVariant.color : "",
    size: resolvedVariant?.size ? resolvedVariant.size : "",
  };

  // update the QuickView state
  const handleQuickViewUpdate = () => {
    const serializableItem = {
      ...item,
      updatedAt:
        item.updatedAt instanceof Date
          ? item.updatedAt.toISOString()
          : item.updatedAt, // ✅ Convert Date to ISO string
    };
    dispatch(updateQuickView(serializableItem));
  };

  // add to cart
  const handleAddToCart = (item: Product) => {
    if (item.quantity > 0) {
      // @ts-ignore
      addItem(cartItem);
      toast.success("Product added to cart!");
    } else {
      toast.error("This product is out of stock!");
    }
  };

  const handleItemToWishList = () => {
    dispatch(
      addItemToWishlist({
        id: item.id,
        title: item.title,
        slug: item.slug,
        image: defaultVariant?.image ? defaultVariant.image : "",
        price: item.discountedPrice ? item.discountedPrice : item.price,
        quantity: item.quantity,
        color: defaultVariant?.color ? defaultVariant.color : "",
      })
    );
  };

  return (
    <div className="group">
      <div
        className={`relative overflow-hidden border border-gray-3 flex items-center justify-center rounded-xl bg-${bgClr} min-h-[270px] mb-4`}
      >
        <Link
          href={`${pathUrl.includes("products")
              ? `${item?.slug}`
              : `products/${item?.slug}`
            }`}
        >
          {(() => {
            const imgSrc = resolvedVariant?.image ? resolvedVariant.image : "";
            const isExternal = typeof imgSrc === "string" && (imgSrc.startsWith("http://") || imgSrc.startsWith("https://"));
            return isExternal ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imgSrc} alt={item.title || "product-image"} width={250} height={250} />
            ) : (
              <Image src={imgSrc} alt={item.title || "product-image"} width={250} height={250} />
            );
          })()}
        </Link>
        <div className="absolute top-2 right-2">
          {item.quantity < 1 ? (
            <span className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-full">
              Out of Stock
            </span>
          ) : item?.discountedPrice && item?.discountedPrice > 0 ? (
            <span className="px-2 py-1 text-xs font-medium text-white rounded-full bg-blue">
              {calculateDiscountPercentage(item.discountedPrice, item.price)}%
              OFF
            </span>
          ) : null}
        </div>

        <div className="absolute left-0 bottom-0 translate-y-full w-full flex items-center justify-center gap-2.5 pb-5 ease-linear duration-200 group-hover:translate-y-0">
          <Tooltip content="Quick View" placement="top">
            <button
              className="border border-gray-3 h-[38px] w-[38px] rounded-lg flex items-center justify-center text-dark bg-white hover:text-blue"
              onClick={() => {
                openModal();
                handleQuickViewUpdate();
              }}
            >
              <EyeIcon />
            </button>
          </Tooltip>

          {isAlradyAdded ? (
            <CheckoutBtn />
          ) : (
            <button
              onClick={() => handleAddToCart(item)}
              disabled={item.quantity < 1}
              className="inline-flex px-5 py-2 font-medium h-[38px] text-white duration-200 ease-out rounded-lg text-custom-sm bg-blue hover:bg-blue-dark"
            >
              {item.quantity > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          )}
          {/* wishlist button */}
          <WishlistButton
            item={item}
            handleItemToWishList={handleItemToWishList}
          />
        </div>
      </div>

      <h3 className="font-semibold text-dark ease-out text-base duration-200 hover:text-blue mb-1.5 line-clamp-1">
        <Link
          href={`${pathUrl.includes("products")
              ? `${item?.slug}`
              : `products/${item?.slug}`
            }`}
        >
          {" "}
          {item.title}{" "}
        </Link>
      </h3>

      {/* Attributes display (color / size) */}
      <div className="flex items-center gap-3 text-sm mt-1 text-dark-3">
        {resolvedVariant?.color && (
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: resolvedVariant.color }}
            />
            <span>{resolvedVariant.color}</span>
          </div>
        )}

        {resolvedVariant?.size && (
          <div className="flex items-center gap-2">
            <span className="text-sm">{resolvedVariant.size}</span>
          </div>
        )}
      </div>

      <span className="flex items-center gap-2 text-base font-medium">
        {item.discountedPrice && (
          <span className="line-through text-dark-4">
            {formatPrice(item.price)}
          </span>
        )}
        <span className="text-dark">
          {formatPrice(item.discountedPrice || item.price)}
        </span>
      </span>
    </div>
  );
};

export default ProductItem;
