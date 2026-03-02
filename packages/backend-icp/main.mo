import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  // Setup authorization and roles
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Text.compare(p1.name, p2.name);
    };
  };

  // Types
  public type Product = {
    id : Nat;
    name : Text;
    description : Text;
    category : Text;
    originalPrice : Nat;
    discountedPrice : Nat;
    sizes : [Text];
    colors : [Text];
    inStock : Bool;
    deliveryEstimate : Text;
    returnable : Bool;
    imageUrls : [Text]; // URLs to blobs
  };

  public type OfferBanner = {
    id : Nat;
    title : Text;
    description : Text;
    discountPercent : Nat;
    active : Bool;
    imageUrl : ?Text; // URL to blob
  };

  public type CartItem = {
    productId : Nat;
    quantity : Nat;
    selectedSize : Text;
    selectedColor : Text;
  };

  public type OrderStatus = {
    #pending;
    #confirmed;
    #shipped;
    #delivered;
    #cancelled;
  };

  public type Order = {
    id : Nat;
    buyer : Principal;
    items : [CartItem];
    totalAmount : Nat;
    status : OrderStatus;
    paymentStatus : Text; // "Paid" | "Pending"
    createdAt : Time.Time;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
    address : Text;
  };

  // Data stores
  var nextProductId = 0;
  var nextBannerId = 0;
  var nextOrderId = 0;

  let products = Map.empty<Nat, Product>();
  let banners = Map.empty<Nat, OfferBanner>();
  let carts = Map.empty<Principal, [CartItem]>();
  let orders = Map.empty<Nat, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Products
  public shared ({ caller }) func addProduct(p : Product) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Only owner can add products");
    };

    let id = nextProductId;
    nextProductId += 1;

    let product = {
      p with id;
    };

    products.add(id, product);
    id;
  };

  public shared ({ caller }) func updateProduct(id : Nat, p : Product) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Only owner can update products");
    };

    if (not products.containsKey(id)) {
      Runtime.trap("Product not found");
    };

    products.add(id, { p with id });
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Only owner can delete products");
    };

    if (not products.containsKey(id)) {
      Runtime.trap("Product not found");
    };

    products.remove(id);
  };

  public query ({ caller }) func getProduct(id : Nat) : async ?Product {
    products.get(id);
  };

  public query ({ caller }) func listProducts() : async [Product] {
    products.values().toArray().sort();
  };

  // Offer Banners
  public shared ({ caller }) func addBanner(b : OfferBanner) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Only owner can add banners");
    };

    let id = nextBannerId;
    nextBannerId += 1;

    let banner = {
      b with id;
    };

    banners.add(id, banner);
    id;
  };

  public shared ({ caller }) func updateBanner(id : Nat, b : OfferBanner) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Only owner can update banners");
    };

    if (not banners.containsKey(id)) {
      Runtime.trap("Banner not found");
    };

    banners.add(id, { b with id });
  };

  public shared ({ caller }) func deleteBanner(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Only owner can delete banners");
    };

    if (not banners.containsKey(id)) {
      Runtime.trap("Banner not found");
    };

    banners.remove(id);
  };

  public query ({ caller }) func getActiveBanners() : async [OfferBanner] {
    banners.values().toArray().filter(func(b) { b.active });
  };

  // Cart
  public shared ({ caller }) func addToCart(item : CartItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only buyers can add to cart");
    };

    let cart : [CartItem] = switch (carts.get(caller)) {
      case (null) { [] };
      case (?items) { items };
    };
    let updatedCart = cart.concat([item]);
    carts.add(caller, updatedCart);
  };

  public shared ({ caller }) func removeFromCart(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only buyers can remove from cart");
    };

    let cart : [CartItem] = switch (carts.get(caller)) {
      case (null) { [] };
      case (?items) { items };
    };
    let updatedCart = cart.filter(func(item) { item.productId != productId });
    carts.add(caller, updatedCart);
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only buyers can view cart");
    };

    switch (carts.get(caller)) {
      case (null) { [] };
      case (?items) { items };
    };
  };

  // Orders
  public shared ({ caller }) func placeOrder() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only buyers can place orders");
    };

    let cart : [CartItem] = switch (carts.get(caller)) {
      case (null) { [] };
      case (?items) { items };
    };

    if (cart.size() == 0) {
      Runtime.trap("Cart is empty");
    };

    // Calculate total amount
    var total = 0;
    for (item in cart.values()) {
      switch (products.get(item.productId)) {
        case (?p) { total += p.discountedPrice * item.quantity };
        case (null) {
          Runtime.trap("Invalid product in cart");
        };
      };
    };

    let id = nextOrderId;
    nextOrderId += 1;

    let order = {
      id;
      buyer = caller;
      items = cart;
      totalAmount = total;
      status = #pending;
      paymentStatus = "Pending";
      createdAt = Time.now();
    };

    orders.add(id, order);
    carts.add(caller, []);
    id;
  };

  public shared ({ caller }) func updateOrderStatus(id : Nat, status : OrderStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Only owner can update order status");
    };

    switch (orders.get(id)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder = { order with status };
        orders.add(id, updatedOrder);
      };
    };
  };

  public query ({ caller }) func getOrder(id : Nat) : async ?Order {
    switch (orders.get(id)) {
      case (null) { null };
      case (?order) {
        // Allow access if caller is the buyer or an admin
        if (caller != order.buyer and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        ?order;
      };
    };
  };

  public query ({ caller }) func getMyOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only buyers can view their orders");
    };

    orders.values().toArray().filter(func(o) { o.buyer == caller });
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Only owner can view all orders");
    };
    orders.values().toArray();
  };
};
