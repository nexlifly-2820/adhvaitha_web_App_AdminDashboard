import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { OrderDetails } from "@/types/order";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CircleCheck, CircleDashed, CheckCircle2, Clock, Truck, XCircle, Loader2 } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { appOrdersCollection } from "@/lib/firebase-app";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OrderDetailsDrawerProps {
  order: OrderDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailsDrawer({
  order,
  isOpen,
  onClose,
}: OrderDetailsDrawerProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("Placed");
  const [trackingId, setTrackingId] = useState("");
  const [courierName, setCourierName] = useState("");

  useEffect(() => {
    if (order) {
      setNewStatus(order.orderStatus || "Placed");
      setTrackingId(order.trackingId || "");
      setCourierName(order.courierName || "");
    }
  }, [order]);

  if (!order) return null;

  const razorpayMatch = order.paymentMethod?.match(/pay_[a-zA-Z0-9]+/);
  const paymentId = razorpayMatch ? razorpayMatch[0] : null;

  const handleUpdateOrder = async () => {
    if (!order.id) return;
    setIsUpdating(true);
    try {
      const orderRef = doc(appOrdersCollection, order.id);
      await updateDoc(orderRef, {
        status: newStatus,
        trackingId: trackingId,
        courierName: courierName,
        updatedAt: new Date().toISOString()
      });
      toast.success("Order updated successfully!");
      onClose(); // Close the drawer on success
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
      case "Processing":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "Shipped":
        return <Truck className="h-4 w-4 text-blue-500" />;
      case "Delivered":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "Cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <CircleDashed className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg overflow-y-auto p-0 border-l">
        <div className="h-full overflow-y-auto">
          <div className="p-6">
            <SheetHeader className="mb-6 space-y-1">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-xl font-semibold">
                  Order {order.id}
                </SheetTitle>
                <div className="flex gap-2">
                  <Badge variant={order.paymentStatus === "Paid" ? "default" : "secondary"}>
                    {order.paymentStatus}
                  </Badge>
                  <Badge variant="outline">{order.orderStatus}</Badge>
                </div>
              </div>
              <SheetDescription>
                Placed on {format(new Date(order.orderDate), "MMM dd, yyyy 'at' hh:mm a")}
              </SheetDescription>
            </SheetHeader>

            <div className="grid gap-6">
              {/* Fulfillment Actions */}
              <div className="space-y-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <h3 className="text-sm font-semibold text-blue-900 uppercase tracking-wider">
                  Fulfillment Actions
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-600">Update Order Status</label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Placed">Placed (New)</SelectItem>
                        <SelectItem value="Packed">Packed</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {newStatus === "Shipped" && (
                    <div className="grid grid-cols-2 gap-3 p-3 bg-white rounded-lg border">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Tracking ID</label>
                        <Input 
                          placeholder="e.g. AW123456789" 
                          value={trackingId}
                          onChange={(e) => setTrackingId(e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Courier Name</label>
                        <Input 
                          placeholder="e.g. BlueDart" 
                          value={courierName}
                          onChange={(e) => setCourierName(e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={handleUpdateOrder} 
                    disabled={isUpdating}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Order Updates
                  </Button>
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Payment Details
                </h3>
                <div className="bg-muted/30 p-4 rounded-lg space-y-2 text-sm">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground">Method:</span>
                    <span className="col-span-2 font-medium">{order.paymentMethod || 'COD'}</span>
                  </div>
                  {paymentId && (
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-muted-foreground">Razorpay ID:</span>
                      <span className="col-span-2 font-mono text-xs bg-slate-200 px-2 py-1 rounded select-all w-fit">
                        {paymentId}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/* Customer Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Customer Information
                </h3>
                <div className="bg-muted/30 p-4 rounded-lg space-y-2 text-sm">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="col-span-2 font-medium">{order.customerInfo.name}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="col-span-2">{order.customerInfo.email}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="col-span-2">{order.customerInfo.mobileNumber}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Shipping Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Shipping Information
                </h3>
                <div className="bg-muted/30 p-4 rounded-lg text-sm space-y-1">
                  <p>{order.shippingInfo.address}</p>
                  <p>
                    {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}
                  </p>
                  <p>{order.shippingInfo.country}</p>
                </div>
              </div>

              <Separator />

              {/* Product Details */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Product Details
                </h3>
                <div className="space-y-4">
                  {order.products.map((product, index) => (
                    <div key={product.id || index} className="flex justify-between items-start text-sm">
                      <div className="space-y-1">
                        <p className="font-medium">{product.name || 'Unknown Product'}</p>
                        <p className="text-muted-foreground text-xs">SKU: {product.sku || 'N/A'}</p>
                        <p className="text-muted-foreground text-xs">Qty: {product.quantity || 1}</p>
                      </div>
                      <p className="font-medium">
                        ${(product.totalPrice || product.price || product.unitPrice || 0).toFixed(2)}
                      </p>
                    </div>
                  ))}
                  <div className="pt-4 border-t flex justify-between items-center font-semibold">
                    <span>Total Amount</span>
                    <span className="text-lg">${(order.totalAmount || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Order Timeline */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Order Timeline
                </h3>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px before:h-full before:w-0.5 before:bg-border">
                  {order.timeline.map((event, index) => (
                    <div key={index} className="relative flex items-center justify-between group is-active">
                      {/* Icon */}
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border bg-background shrink-0 z-10">
                        {getStatusIcon(event.status)}
                      </div>
                      {/* Content */}
                      <div className="w-[calc(100%-2.5rem)] p-4 rounded-lg border bg-background shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                          <div className="font-semibold text-sm">{event.status}</div>
                          <time className="text-xs text-muted-foreground">
                            {format(new Date(event.date), "MMM dd, yyyy HH:mm")}
                          </time>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {event.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
