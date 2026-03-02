import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Prim "mo:prim";
import Cycles "mo:core/Cycles";
import Nat "mo:core/Nat";

module {
  public type ExternalBlob = Blob;

  public type State = {
    var authorizedPrincipals : [Principal];
  };

  public func new() : State {
    let authorizedPrincipals : [Principal] = [];
    {
      var authorizedPrincipals;
    };
  };

  public func getCashierPrincipal() : async Principal {
    switch (Prim.envVar<system>("CAFFFEINE_STORAGE_CASHIER_PRINCIPAL")) {
      case (null) {
        Runtime.trap("CAFFFEINE_STORAGE_CASHIER_PRINCIPAL environment variable is not set");
      };
      case (?cashierPrincipal) {
        Principal.fromText(cashierPrincipal);
      };
    };
  };

  // Authorization functions
  public func updateGatewayPrincipals(registry : State) : async () {
    let cashierPrincipal = await getCashierPrincipal();
    let cashierActor = actor (cashierPrincipal.toText()) : actor {
      storage_gateway_principal_list_v1 : () -> async [Principal];
    };

    registry.authorizedPrincipals := await cashierActor.storage_gateway_principal_list_v1();
  };

  public func isAuthorized(registry : State, caller : Principal) : Bool {
    let authorized = registry.authorizedPrincipals.find(
      func(principal) {
        Principal.equal(principal, caller);
      }
    ) != null;
    authorized;
  };

  public func refillCashier(
    _registry : State,
    cashier : Principal,
    refillInformation : ?{
      proposed_top_up_amount : ?Nat;
    },
  ) : async {
    success : ?Bool;
    topped_up_amount : ?Nat;
  } {
    let currentBalance = Cycles.balance();
    let reservedCycles : Nat = 400_000_000_000;

    let currentFreeCyclesCount : Nat = Nat.sub(currentBalance, reservedCycles);

    let cyclesToSend : Nat = switch (refillInformation) {
      case (null) { currentFreeCyclesCount };
      case (?info) {
        switch (info.proposed_top_up_amount) {
          case (null) { currentFreeCyclesCount };
          case (?proposed) { Nat.min(proposed, currentFreeCyclesCount) };
        };
      };
    };

    let targetCanister = actor (cashier.toText()) : actor {
      account_top_up_v1 : ({ account : Principal }) -> async ();
    };

    await (with cycles = cyclesToSend) targetCanister.account_top_up_v1({
      account = Prim.getSelfPrincipal<system>();
    });

    {
      success = ?true;
      topped_up_amount = ?cyclesToSend;
    };
  };
};
