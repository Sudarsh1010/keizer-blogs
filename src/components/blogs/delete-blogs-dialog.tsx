"use client";

import type { Row } from "@tanstack/react-table";
import * as React from "react";
import { Button } from "components/ui/button";
import {
  Credenza,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "components/ui/credenza";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { api } from "trpc/react";

import type { BlogListWithAuthor } from "./list";

interface DeleteBlogsDialogProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Credenza>, "children"> {
  blogs: Row<BlogListWithAuthor>["original"][];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteBlogsDialog({
  blogs,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteBlogsDialogProps) {
  const { mutate, isPending } = api.blog.deleteMultiple.useMutation({
    onSuccess: () => {
      props.onOpenChange?.(false);
      toast.success("Blogs deleted");
      onSuccess?.();
    },
    onError: (e) => toast.error(e.message),
  });

  function onDelete() {
    mutate({ ids: blogs.map((blog) => blog.id) });
  }

  return (
    <Credenza {...props}>
      {showTrigger ? (
        <CredenzaTrigger asChild>
          <Button variant="outline" size="sm">
            <Trash className="mr-2 size-4" aria-hidden="true" />
            Delete ({blogs.length})
          </Button>
        </CredenzaTrigger>
      ) : null}

      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Are you absolutely sure?</CredenzaTitle>
          <CredenzaDescription>
            This action cannot be undone. This will permanently delete your{" "}
            <span className="font-medium">{blogs.length}</span>
            {blogs.length === 1 ? " blog" : " blogs"} from our servers.
          </CredenzaDescription>
        </CredenzaHeader>

        <CredenzaFooter className="gap-2 sm:space-x-0">
          <CredenzaClose asChild>
            <Button variant="outline">Cancel</Button>
          </CredenzaClose>

          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={onDelete}
            loading={isPending}
          >
            Delete
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}