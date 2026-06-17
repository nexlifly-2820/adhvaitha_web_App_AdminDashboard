export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
export type PaymentStatus = "Paid" | "Unpaid" | "Refunded";

export interface Order {
  id: string;
  customerName: string;
  mobileNumber: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  orderDate: string; // ISO format string
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  orderStatus: OrderStatus;
  deliveryAddress: string;
  trackingId?: string;
  courierName?: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  mobileNumber: string;
}

export interface ShippingInfo {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ProductItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderTimelineEvent {
  status: string;
  date: string; // ISO format string
  description: string;
}

export interface OrderDetails extends Order {
  customerInfo: CustomerInfo;
  shippingInfo: ShippingInfo;
  products: ProductItem[];
  timeline: OrderTimelineEvent[];
}
