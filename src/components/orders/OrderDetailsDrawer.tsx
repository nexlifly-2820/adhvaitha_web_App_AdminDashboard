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

import { format } from "date-fns";
import { CircleCheck, CircleDashed, CheckCircle2, Clock, Truck, XCircle } from "lucide-react";

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
  if (!order) return null;

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
                  {order.products.map((product) => (
                    <div key={product.id} className="flex justify-between items-start text-sm">
                      <div className="space-y-1">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-muted-foreground text-xs">SKU: {product.sku}</p>
                        <p className="text-muted-foreground text-xs">Qty: {product.quantity}</p>
                      </div>
                      <p className="font-medium">
                        ${product.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  ))}
                  <div className="pt-4 border-t flex justify-between items-center font-semibold">
                    <span>Total Amount</span>
                    <span className="text-lg">${order.totalAmount.toFixed(2)}</span>
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
