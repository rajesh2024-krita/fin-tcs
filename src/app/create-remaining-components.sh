
#!/bin/bash

# Create remaining essential component directories and files

# Transaction components
mkdir -p src/app/components/transaction/{account-closure,deposit-receipt,deposit-renew,deposit-slip,deposit-payment}

# Accounts components  
mkdir -p src/app/components/accounts/{group,ledger,cash-book,day-book,voucher,loan-receipt,trial-balance,balance-sheet,profit-loss,receipt-payment}

# Reports components
mkdir -p src/app/components/reports/{employees,voucher,opening-balance,closing-balance,loan}

echo "Component directories created"
