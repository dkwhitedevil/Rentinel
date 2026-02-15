/// Rentinel Application - Full fairness lifecycle
/// Apply → Accept / Reject / Ghost after 48h
module rentinel_contract::application {

    use sui::clock;
    use sui::object;
    use sui::tx_context::{sender, TxContext};

    /// ================= STATUS CONSTANTS =================
    const STATUS_PENDING: u8 = 0;
    const STATUS_ACCEPTED: u8 = 1;
    const STATUS_REJECTED: u8 = 2;
    const STATUS_GHOSTED: u8 = 3;

    /// 48 hours in milliseconds
    const GHOST_THRESHOLD_MS: u64 = 172800000;

    /// ================= APPLICATION OBJECT =================
    public struct Application has key, store {
        id: object::UID,
        tenant: address,
        landlord: address,
        listing: vector<u8>,
        created_at: u64,
        status: u8,
    }

    /// ======================================================
    /// 1️⃣ TENANT APPLIES (creates on-chain proof)
    /// ======================================================
    public entry fun apply(
        clock: &clock::Clock,
        tenant: address,
        landlord: address,
        listing: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(tenant == sender(ctx), 0);

        let app = Application {
            id: object::new(ctx),
            tenant,
            landlord,
            listing,
            created_at: clock::timestamp_ms(clock),
            status: STATUS_PENDING,
        };

        transfer::share_object(app);
    }

    /// ======================================================
    /// 2️⃣ LANDLORD ACCEPTS
    /// ======================================================
    public entry fun accept(app: &mut Application, ctx: &mut TxContext) {
        assert!(sender(ctx) == app.landlord, 0);
        assert!(app.status == STATUS_PENDING, 1);

        app.status = STATUS_ACCEPTED;
    }

    /// ======================================================
    /// 3️⃣ LANDLORD REJECTS
    /// ======================================================
    public entry fun reject(app: &mut Application, ctx: &mut TxContext) {
        assert!(sender(ctx) == app.landlord, 0);
        assert!(app.status == STATUS_PENDING, 1);

        app.status = STATUS_REJECTED;
    }

    /// ======================================================
    /// 4️⃣ MARK AS GHOSTED AFTER 48 HOURS
    /// Anyone can call → proves silence publicly
    /// ======================================================
    public entry fun mark_ghosted(clock: &clock::Clock, app: &mut Application) {
        assert!(app.status == STATUS_PENDING, 2);

        let now = clock::timestamp_ms(clock);
        let elapsed = now - app.created_at;

        assert!(elapsed >= GHOST_THRESHOLD_MS, 3);

        app.status = STATUS_GHOSTED;
    }
}
