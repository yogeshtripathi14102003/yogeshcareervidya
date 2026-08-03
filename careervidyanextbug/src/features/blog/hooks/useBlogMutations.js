"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createBlog, updateBlog, deleteBlog } from "../api/blogApi.js";

export function useCreateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs", "list"] });
      toast.success("Blog published");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to publish blog");
    },
  });
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }) => updateBlog(id, formData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["blogs", "list"] });
      queryClient.invalidateQueries({ queryKey: ["blogs", "detail"] });
      toast.success("Blog updated");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update blog");
    },
  });
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs", "list"] });
      toast.success("Blog deleted");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete blog");
    },
  });
}
