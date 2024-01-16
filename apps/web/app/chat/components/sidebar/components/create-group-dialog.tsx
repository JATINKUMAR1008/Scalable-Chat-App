import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

export default function CreateGroupDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>
            Create new group and add people.
          </DialogDescription>
          <div className="my-2 grid gap-4 p-2">
            <div className="grid grid-cols-4 items-center">
              <Label htmlFor="gname" className="text-md font-semibold">
                Group name
              </Label>
              <Input className="col-span-3" id="gname" name="gname" />
            </div>
            <div>
              <Button>Add Participants.</Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
