import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Storage "Storage";
import Prim "mo:prim";
import Runtime "mo:core/Runtime";

mixin () {
  type ExternalBlob = Storage.ExternalBlob;

  transient let _caffeineStorageState : Storage.State = Storage.new();

  type _CaffeineStorageRefillInformation = {
    proposed_top_up_amount : ?Nat;
  };

  type _CaffeineStorageRefillResult = {
    success : ?Bool;
    topped_up_amount : ?Nat;
  };

  type _CaffeineStorageCreateCertificateResult = {
    method : Text;
    blob_hash : Text;
  };

  public shared ({ caller }) func _caffeineStorageRefillCashier(refillInformation : ?_CaffeineStorageRefillInformation) : async _CaffeineStorageRefillResult {
    let cashier = await Storage.getCashierPrincipal();
    if (cashier != caller) {
      Runtime.trap("Unauthorized access");
    };
    await Storage.refillCashier(_caffeineStorageState, cashier, refillInformation);
  };

  public shared ({ caller }) func _caffeineStorageUpdateGatewayPrincipals() : async () {
    await Storage.updateGatewayPrincipals(_caffeineStorageState);
  };

  public query ({ caller }) func _caffeineStorageBlobIsLive(hash : Blob) : async Bool {
    Prim.isStorageBlobLive(hash);
  };

  public query ({ caller }) func _caffeineStorageBlobsToDelete() : async [Blob] {
    if (not Storage.isAuthorized(_caffeineStorageState, caller)) {
      Runtime.trap("Unauthorized access");
    };
    let deadBlobs = Prim.getDeadBlobs();
    switch (deadBlobs) {
      case (null) {
        [];
      };
      case (?deadBlobs) {
        deadBlobs.sliceToArray(0, 10000);
      };
    };
  };

  public shared ({ caller }) func _caffeineStorageConfirmBlobDeletion(blobs : [Blob]) : async () {
    if (not Storage.isAuthorized(_caffeineStorageState, caller)) {
      Runtime.trap("Unauthorized access");
    };
    Prim.pruneConfirmedDeadBlobs(blobs);
    // Trigger GC forcefully.
    type GC = actor {
      __motoko_gc_trigger : () -> async ();
    };
    let myGC = actor (debug_show (Prim.getSelfPrincipal<system>())) : GC;
    await myGC.__motoko_gc_trigger();
  };

  public shared ({ caller }) func _caffeineStorageCreateCertificate(blobHash : Text) : async _CaffeineStorageCreateCertificateResult {
    {
      method = "upload";
      blob_hash = blobHash;
    };
  };
};
