/// Rentinel - Blockchain-anchored rental fairness
/// Timestamps rental applications on Sui for court-ready proof.
module rentinel_contract::rentinel_contract {

    use sui::event;
    use sui::tx_context::{sender, TxContext};

    /// Emitted when a tenant submits a rental application.
    /// Events are immutable and queryable - proof of timestamp.
    public struct ApplicationSubmitted has copy, drop {
        applicant: address,
        listing: vector<u8>,
        message_hash: vector<u8>,
    }

    /// Timestamp a rental application on-chain. Emits an event that serves as
    /// immutable proof of when the application was submitted.
    /// Callable by anyone; the sender is recorded as the applicant.
    public fun submit_application(
        listing: vector<u8>,
        message_hash: vector<u8>,
        ctx: &mut TxContext
    ) {
        event::emit(ApplicationSubmitted {
            applicant: sender(ctx),
            listing,
            message_hash,
        });
    }
}
