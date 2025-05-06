import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminNews() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold mb-4">Administratorer</h1>
        <Button variant="default">Inviter ny administrator</Button>
      </div>

      <h2>Aktive administratorer</h2>
      <Table>
        <TableCaption>Tabell over aktive administratorer</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">brukernavn</TableHead>
            <TableHead>epost</TableHead>
            <TableHead className="text-right">dato</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/*<TableRow>*/}
          {/*  <TableCell className="font-medium">INV001</TableCell>*/}
          {/*  <TableCell>Paid</TableCell>*/}
          {/*  <TableCell>Credit Card</TableCell>*/}
          {/*  <TableCell className="text-right">$250.00</TableCell>*/}
          {/*</TableRow>*/}
        </TableBody>
      </Table>

      <h2>Invitasjoner</h2>
      <Table>
        <TableCaption>Tabell over utestående administrator-invitasjoner </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">brukernavn</TableHead>
            <TableHead>epost</TableHead>
            <TableHead className="text-right">epost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/*<TableRow>*/}
          {/*  <TableCell className="font-medium">INV001</TableCell>*/}
          {/*  <TableCell>Paid</TableCell>*/}
          {/*  <TableCell>Credit Card</TableCell>*/}
          {/*  <TableCell className="text-right">$250.00</TableCell>*/}
          {/*</TableRow>*/}
        </TableBody>
      </Table>

    </div>
  );
}
