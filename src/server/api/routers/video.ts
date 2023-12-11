import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import cloudinary from "cloudinary";
cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const videoRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  upload: publicProcedure
    .input(z.object({ videoDataUrl: z.string() }))
    .mutation(async ({ ctx, input }) => {
      let publicId = "";

      await cloudinary.v2.uploader.upload(
        input.videoDataUrl,
        { resource_type: "video", video_codec: "auto" },
        function (error, result) {
          if (result) {
            publicId = result.public_id;
            return publicId;
          }
          if (error) {
            console.error(error);
            return error;
          }
        },
      );
    }),
  delete: publicProcedure
    .input(z.object({ publicId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await cloudinary.v2.uploader
        .destroy(
          input.publicId,
          { resource_type: "video" },
          function (error, result) {
            if (result) {
              return "Video Deleted";
            }
          },
        )
        .catch((e) => {
          console.error(e);
        });
    }),
});
