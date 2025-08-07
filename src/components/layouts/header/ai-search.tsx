"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { findCar } from "@/lib/actions/ai-action";
import { SearchIcon, SmileIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { string } from "zod";
export const AIsearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const router = useRouter();
  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!description) return toast.error("Please enter a description");
    setIsLoading(true);
    try {
      const result: "No car Found" | "Error generating car Search" | string =
        await findCar(description);
      const carId = string().parse(result);
      router.replace(`/cars/${carId}`);

      toast.success(`Car found successfully! with ID: ${carId}`);
      setDescription("");
      setIsOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="mr-4 ml-auto flex items-center gap-1 bg-muted rounded-lg px-4 py-2 hover:bg-muted">
        <SearchIcon className="h-4 w-4" /> Search with AI
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Define! What type of car you like ?</DialogTitle>
          <DialogDescription>
            You can tell features like color, type, brand, etc. and we will find
            the best match for you.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={submitHandler}>
          <Textarea
            placeholder="Write about your car ..."
            value={description}
            rows={5}
            className="max-h-[20rem]"
            style={{
              // @ts-expect-error // css not supported in Textarea
              fieldSizing: "content",
            }}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button disabled={isLoading} className="flex items-center gap-1">
            {isLoading ? (
              "Searching ...."
            ) : (
              <>
                <SmileIcon className="h-5 w-5" />
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
