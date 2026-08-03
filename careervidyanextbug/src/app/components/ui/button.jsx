//import { Button } from "@/components/ui/button";
import {Button} from"@/components/ui/button";
import { User } from "lucide-react";

export default function Example() {
  return (
    <div className="flex gap-4 p-6">
      <Button>Default Button</Button>
      <Button variant="outline" className="flex items-center gap-2">
        <User className="w-4 h-4" /> Sign in
      </Button>
      <Button variant="ghost">Ghost Button</Button>
      <Button variant="danger">Delete</Button>
    </div>
  );
}
