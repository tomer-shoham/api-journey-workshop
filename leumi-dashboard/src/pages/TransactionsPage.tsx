import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { fetchTransactions } from "@/api/api.ts";
import { Transaction } from "@/api/types.ts";

const TransactionsPage = ({ leumiWallet }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchTransactions(leumiWallet.id).then(data => {
      setTransactions(data);
    });
  }, [leumiWallet.id]);
  return (
    <div className="w-full">
      <Card className="mb-8 p-6 bg-gradient-to-r from-purple-500 to-indigo-600">
        <div className="text-white">
          <h2 className="text-2xl font-bold mb-2">Transaction Overview</h2>
          <p className="text-lg">Total Transactions: {transactions?.length}</p>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <div className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>AssetId</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map(transaction => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>{transaction.source}</TableCell>
                  <TableCell>{transaction.destination}</TableCell>
                  <TableCell>{transaction.assetId}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default TransactionsPage;
