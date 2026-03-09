package com.cashback.engine.domain.transaction;

public enum TransactionStatus {
    TRACKED,
    PENDING,
    CONFIRMED,
    PAYABLE,
    PAID,
    CANCELLED,
    REJECTED
}
